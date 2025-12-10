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
    p = Path(path) if path else Path.cwd()
    if p.is_file():
        p = p.parent
    try:
        return Repo(p, search_parent_directories=True)
    except InvalidGitRepositoryError as e:
        msg = f"No Git repository found for: {p.resolve()}"
        raise InvalidGitRepositoryError(msg) from e


def has_command(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def repo_identifier(repo: Repo) -> str:
    """Return a unique identifier for a repository.

    Uses the first remote URL if available; otherwise uses the repo's absolute path.
    """
    h = hashlib.sha256()
    if repo.remotes:
        remote_url = next(iter(repo.remotes[0].urls), None)
        identifier_source = remote_url or str(Path(repo.working_tree_dir).resolve())
    else:
        identifier_source = str(Path(repo.working_tree_dir).resolve())
    h.update(identifier_source.encode())
    return h.hexdigest()


def open_image(img: Path) -> None:
    system = platform.system()
    if system == "Darwin":
        subprocess.run(["open", str(img)], check=False)
    elif system == "Windows":
        import os
        os.startfile(str(img))
    else:
        subprocess.run(["xdg-open", str(img)], check=False)


def gitignored_files(repo: Repo) -> list[Path]:
    result = repo.git.ls_files("--others", "-i", "--exclude-standard")
    return [Path(line) for line in result.splitlines()] if result.strip() else []


def git_style_sha1(path: Path) -> str | None:
    if not path.exists():
        return None
    data = path.read_bytes()
    header = f"blob {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()


def compute_tracked_hash(repo: Repo) -> str:
    """Compute a SHA256 hash of the contents of all tracked (non-ignored) files."""
    repo_root = Path(repo.working_tree_dir)
    tracked_files = sorted(f for f in repo.git.ls_files().splitlines())
    h = hashlib.sha256()
    for path_str in tracked_files:
        path = repo_root / path_str
        if path.is_file():
            h.update(path.read_bytes())
        # Include filename in hash to detect added/removed files
        h.update(path_str.encode())
    return h.hexdigest()


def snapshot_ignored(repo: Repo) -> None:
    if not has_command("rsync"):
        raise RuntimeError("rsync is required for ultra-fast snapshots")
    repo_root = Path(repo.working_tree_dir)
    snap_dir = BASE_SNAPSHOT_DIR / repo_identifier(repo)
    ignored = gitignored_files(repo)
    if snap_dir.exists():
        shutil.rmtree(snap_dir)
    snap_dir.mkdir(parents=True, exist_ok=True)

    if ignored:
        proc = subprocess.Popen(
            [
                "rsync",
                "-a",
                "--delete",
                "--relative",
                "--files-from=-",
                f"{repo_root}/",
                f"{snap_dir}/",
            ],
            stdin=subprocess.PIPE,
        )
        proc.communicate(input="\n".join(str(f) for f in ignored).encode())
        proc.wait()
        print(f"Snapshot taken for {len(ignored)} ignored files.")  # noqa: T201

    # Save hash of tracked files for reproducibility
    input_hash = compute_tracked_hash(repo)
    (snap_dir / "input-hash.txt").write_text(input_hash)


def diff_ignored(repo: Repo) -> None:
    repo_root = Path(repo.working_tree_dir)
    snap_dir = BASE_SNAPSHOT_DIR / repo_identifier(repo)
    if not snap_dir.exists():
        print("No snapshot found. Run 'snapshot' first.")  # noqa: T201
        return

    # Compare tracked files hash for reproducibility
    saved_hash_path = snap_dir / "input-hash.txt"
    if saved_hash_path.exists():
        saved_hash = saved_hash_path.read_text()
        current_hash = compute_tracked_hash(repo)
        if saved_hash == current_hash:
            print("Inputs are reproducible: tracked files unchanged.")  # noqa: T201
        else:
            print("Tracked files have changed since snapshot!")  # noqa: T201

    # Continue with normal diff logic
    current = set(gitignored_files(repo))
    snapshot = {p.relative_to(snap_dir) for p in snap_dir.rglob("*") if p.is_file() and p.name != "input-hash.txt"}
    new_files = current - snapshot
    deleted_files = snapshot - current
    possibly_changed = current & snapshot
    changed_files = [
        f
        for f in possibly_changed
        if git_style_sha1(snap_dir / f) != git_style_sha1(repo_root / f)
    ]
    image_exts = {".png", ".jpg", ".jpeg", ".gif"}
    if new_files:
        print("New ignored files:")  # noqa: T201
        for f in sorted(new_files):
            print(f"  + {f}")  # noqa: T201
    if deleted_files:
        print("Deleted ignored files:")  # noqa: T201
        for f in sorted(deleted_files):
            print(f"  - {f}")  # noqa: T201
    if changed_files:
        print("Modified ignored files:")  # noqa: T201
        for f in sorted(changed_files):
            print(f"  * {f}")  # noqa: T201
            prev_file = snap_dir / f
            cur_file = repo_root / f
            if f.suffix.lower() in image_exts:
                if (
                    prev_file.exists()
                    and cur_file.exists()
                    and has_command("diffoscope")
                ):
                    subprocess.run(
                        ["diffoscope", str(prev_file), str(cur_file)],
                        check=False,
                    )
                if cur_file.exists():
                    open_image(cur_file)
            elif prev_file.exists() and cur_file.exists() and has_command("diff"):
                subprocess.run(
                    ["diff", "-u", str(prev_file), str(cur_file)],
                    check=False,
                )


class SnapDiff:
    def snapshot(self, repo: str | None = None) -> None:
        with contextlib.suppress(InvalidGitRepositoryError):
            snapshot_ignored(get_repo(repo))

    def diff(self, repo: str | None = None) -> None:
        with contextlib.suppress(InvalidGitRepositoryError):
            diff_ignored(get_repo(repo))


if __name__ == "__main__":
    fire.Fire(SnapDiff)
