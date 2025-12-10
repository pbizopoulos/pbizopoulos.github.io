#!/usr/bin/env python3
import hashlib
import platform
import shutil
import subprocess
from pathlib import Path

import fire
from git import InvalidGitRepositoryError, Repo

BASE_SNAPSHOT_DIR = Path("/tmp/snapdiff_snapshots")


# -------------------- Git Helpers -------------------- #


def get_repo(path: Path | None = None) -> Repo:
    """Return a GitPython Repo object for the current directory or specified path.
    Works for normal repos and submodules. Does not climb into parent repos.
    """
    path = Path(path) if path else Path.cwd()
    try:
        return Repo(path, search_parent_directories=False)
    except InvalidGitRepositoryError:
        # Try parents until we find a .git
        for parent in path.parents:
            try:
                return Repo(parent, search_parent_directories=False)
            except InvalidGitRepositoryError:
                continue
        msg = f"No Git repository found at {path} or its parents"
        raise InvalidGitRepositoryError(msg)


def tracked_files_hash(repo: Repo) -> str:
    """SHA256 hash of all tracked files in the repository."""
    files = sorted(repo.git.ls_files().splitlines())
    h = hashlib.sha256()
    repo_root = Path(repo.working_tree_dir)
    for file in files:
        fpath = repo_root / file
        if fpath.is_file():
            h.update(file.encode())
            h.update(b"\0")
            with open(fpath, "rb") as f:
                for chunk in iter(lambda: f.read(8192), b""):
                    h.update(chunk)
    return h.hexdigest()


def gitignored_files(repo: Repo):
    """List git-ignored files relative to repo root, skipping nested submodules.
    Works for normal repos or submodules.
    """
    repo_root = Path(repo.working_tree_dir)
    ignored = []

    # Nested submodules inside this repo (skip their contents)
    submodule_paths = {Path(repo_root) / sm.path for sm in repo.submodules}

    for f in repo_root.rglob("*"):
        if f.is_file():
            if any(f.is_relative_to(submod) for submod in submodule_paths):
                continue
            try:
                if repo.ignored(str(f)):
                    ignored.append(f.relative_to(repo_root))
            except Exception:
                continue
    return ignored


def repo_identifier(repo: Repo) -> str:
    """Deterministic repository identifier using HEAD commit + remote URL (or fallback)."""
    h = hashlib.sha256()
    try:
        head = repo.head.commit.hexsha
    except ValueError:
        head = "no-head"
    try:
        remote_url = next(repo.remotes.origin.urls)
    except (ValueError, AttributeError):
        remote_url = "no-remote"
    h.update(head.encode())
    h.update(b"\0")
    h.update(remote_url.encode())
    return h.hexdigest()


# -------------------- File Helpers -------------------- #


def filecmp(f1: Path, f2: Path) -> bool:
    if not f1.exists() or not f2.exists():
        return False
    if f1.stat().st_size != f2.stat().st_size:
        return False
    with open(f1, "rb") as a, open(f2, "rb") as b:
        while True:
            c1 = a.read(8192)
            c2 = b.read(8192)
            if c1 != c2:
                return False
            if not c1:
                break
    return True


def open_image(img: Path) -> None:
    if platform.system() == "Darwin":
        subprocess.run(["open", str(img)], check=False)
    elif platform.system() == "Windows":
        import os

        os.startfile(str(img))
    else:
        subprocess.run(["xdg-open", str(img)], check=False)


# -------------------- Snapshot / Diff -------------------- #


def snapshot_ignored(repo: Repo) -> None:
    """Snapshot git-ignored files preserving directory structure."""
    repo_root = Path(repo.working_tree_dir)
    repo_id = repo_identifier(repo)
    tracked_hash = tracked_files_hash(repo)

    snap_dir = BASE_SNAPSHOT_DIR / repo_id / tracked_hash
    if snap_dir.exists():
        shutil.rmtree(snap_dir)
    snap_dir.mkdir(parents=True, exist_ok=True)

    for file in gitignored_files(repo):
        src = repo_root / file
        dst = snap_dir / file
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)

    # Update latest symlink
    latest_link = BASE_SNAPSHOT_DIR / repo_id / "latest"
    if latest_link.exists() or latest_link.is_symlink():
        latest_link.unlink()
    latest_link.symlink_to(tracked_hash)


def diff_ignored(repo: Repo) -> None:
    repo_root = Path(repo.working_tree_dir)
    repo_id = repo_identifier(repo)
    repo_snap_dir = BASE_SNAPSHOT_DIR / repo_id

    latest_link = repo_snap_dir / "latest"
    if not latest_link.exists() or not latest_link.is_symlink():
        return

    prev_hash = latest_link.readlink().name
    prev_dir = repo_snap_dir / prev_hash
    tracked_hash = tracked_files_hash(repo)
    cur_dir = repo_snap_dir / tracked_hash

    if not cur_dir.exists():
        cur_dir.mkdir(parents=True, exist_ok=True)
        for file in gitignored_files(repo):
            src = repo_root / file
            dst = cur_dir / file
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)

    changed_files = []
    for file in gitignored_files(repo):
        prev_file = prev_dir / file
        cur_file = cur_dir / file
        if not filecmp(prev_file, cur_file):
            changed_files.append(file)

    if not changed_files:
        return

    for file in changed_files:
        prev_file = prev_dir / file
        cur_file = cur_dir / file

        if file.suffix.lower() in (".png", ".jpg", ".jpeg", ".gif"):
            diff_out = prev_dir / f"{file}.diff.png"
            diff_out.parent.mkdir(parents=True, exist_ok=True)
            if prev_file.exists() and cur_file.exists():
                subprocess.run(
                    ["compare", str(prev_file), str(cur_file), str(diff_out)],
                    check=False,
                )
                open_image(diff_out)
            elif cur_file.exists():
                shutil.copy(cur_file, diff_out)
                open_image(diff_out)
        elif prev_file.exists() and cur_file.exists():
            subprocess.run(["diffoscope", str(prev_file), str(cur_file)], check=False)
        elif cur_file.exists():
            subprocess.run(["diffoscope", "/dev/null", str(cur_file)], check=False)
        else:
            subprocess.run(["diffoscope", str(prev_file), "/dev/null"], check=False)

    if prev_hash == tracked_hash:
        pass
    else:
        pass


# -------------------- CLI -------------------- #


class SnapDiff:
    """Snapshot and diff git-ignored files using GitPython."""

    def snapshot(self, repo: str | None = None) -> None:
        try:
            repo_obj = get_repo(repo)
        except InvalidGitRepositoryError:
            return
        snapshot_ignored(repo_obj)

    def diff(self, repo: str | None = None) -> None:
        try:
            repo_obj = get_repo(repo)
        except InvalidGitRepositoryError:
            return
        diff_ignored(repo_obj)


if __name__ == "__main__":
    fire.Fire(SnapDiff)
