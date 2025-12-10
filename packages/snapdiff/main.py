#!/usr/bin/env python3
import contextlib
import hashlib
import platform
import shutil
import subprocess
from pathlib import Path

import fire
from git import InvalidGitRepositoryError, Repo

BASE_SNAPSHOT_DIR = Path("/tmp/snapdiff_snapshots")


def get_repo(path: str | None = None) -> Repo:
    """Return a Git repo object for the current directory or given path."""
    path = Path(path) if path else Path.cwd()
    try:
        return Repo(path, search_parent_directories=False)
    except InvalidGitRepositoryError:
        for parent in path.parents:
            try:
                return Repo(parent, search_parent_directories=False)
            except InvalidGitRepositoryError:
                continue
        msg = f"No Git repo found at {path} or its parents"
        raise InvalidGitRepositoryError(msg)


def gitignored_files(repo: Repo) -> list[Path]:
    """Return git-ignored files relative to repo root (skip submodules)."""
    repo_root = Path(repo.working_tree_dir)
    submodules = {repo_root / sm.path for sm in repo.submodules}
    ignored = []
    for f in repo_root.rglob("*"):
        if f.is_file() and not any(f.is_relative_to(sm) for sm in submodules):
            try:
                if repo.ignored(str(f)):
                    ignored.append(f.relative_to(repo_root))
            except Exception:
                continue
    return ignored


def repo_identifier(repo: Repo) -> str:
    """Deterministic repo ID using HEAD commit + remote URL fallback."""
    h = hashlib.sha256()
    try:
        head = repo.head.commit.hexsha
    except Exception:
        head = "no-head"
    try:
        remote = next(repo.remotes.origin.urls)
    except Exception:
        remote = "no-remote"
    h.update(head.encode())
    h.update(b"\0")
    h.update(remote.encode())
    return h.hexdigest()


def filecmp(f1: Path, f2: Path) -> bool:
    if not f1.exists() or not f2.exists():
        return False
    if f1.stat().st_size != f2.stat().st_size:
        return False
    with open(f1, "rb") as a, open(f2, "rb") as b:
        while chunk := a.read(8192):
            if chunk != b.read(8192):
                return False
    return True


def open_image(img: Path) -> None:
    if platform.system() == "Darwin":
        subprocess.run(["open", str(img)], check=False)
    elif platform.system() == "Windows":
        import os

        os.startfile(str(img))
    else:
        subprocess.run(["xdg-open", str(img)], check=False)


def snapshot_ignored(repo: Repo) -> None:
    """Snapshot git-ignored files, keeping only the latest snapshot."""
    repo_root = Path(repo.working_tree_dir)
    snap_dir = BASE_SNAPSHOT_DIR / repo_identifier(repo) / "latest"
    if snap_dir.exists():
        shutil.rmtree(snap_dir)
    snap_dir.mkdir(parents=True, exist_ok=True)
    for file in gitignored_files(repo):
        src, dst = repo_root / file, snap_dir / file
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)


def diff_ignored(repo: Repo) -> None:
    """Compare current git-ignored files against the latest snapshot."""
    repo_root = Path(repo.working_tree_dir)
    snap_dir = BASE_SNAPSHOT_DIR / repo_identifier(repo) / "latest"
    if not snap_dir.exists():
        return
    changed = [
        f for f in gitignored_files(repo) if not filecmp(snap_dir / f, repo_root / f)
    ]
    if not changed:
        return
    for file in changed:
        prev_file = snap_dir / file
        cur_file = repo_root / file
        if file.suffix.lower() in (".png", ".jpg", ".jpeg", ".gif"):
            with contextlib.suppress(Exception):
                subprocess.run(["compare", str(prev_file), str(cur_file)], check=False)
            if cur_file.exists():
                open_image(cur_file)
            continue
        if prev_file.exists() and cur_file.exists():
            subprocess.run(["diffoscope", str(prev_file), str(cur_file)], check=False)
        elif cur_file.exists():
            subprocess.run(["diffoscope", "/dev/null", str(cur_file)], check=False)
        else:
            subprocess.run(["diffoscope", str(prev_file), "/dev/null"], check=False)


class SnapDiff:
    """Snapshot and diff git-ignored files using GitPython."""

    def snapshot(self, repo: str | None = None) -> None:
        with contextlib.suppress(InvalidGitRepositoryError):
            snapshot_ignored(get_repo(repo))

    def diff(self, repo: str | None = None) -> None:
        with contextlib.suppress(InvalidGitRepositoryError):
            diff_ignored(get_repo(repo))


if __name__ == "__main__":
    fire.Fire(SnapDiff)
