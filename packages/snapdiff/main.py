#!/usr/bin/env python3
from pathlib import Path
import hashlib
import platform
import subprocess

import fire
from git import Repo, InvalidGitRepositoryError

BASE_SNAPSHOT_DIR = Path("/tmp/snapdiff_snapshots")


def get_repo(path: str = None) -> Repo:
    p = Path(path or ".")
    if p.is_file():
        p = p.parent
    try:
        return Repo(p, search_parent_directories=True)
    except InvalidGitRepositoryError as e:
        raise InvalidGitRepositoryError(f"No Git repository found for: {p.resolve()}") from e


def repo_id(repo: Repo) -> str:
    src = next(iter(repo.remotes[0].urls), None) if repo.remotes else str(repo.working_tree_dir)
    return hashlib.sha256(src.encode()).hexdigest()


def ignored_files(repo: Repo):
    """Return all ignored files and directories relative to Git root."""
    out = repo.git.ls_files("-o", "-i", "--directory", "--exclude-standard")
    return sorted(Path(p) for p in out.splitlines() if p.strip())


def compute_ignored_hash(repo: Repo) -> str:
    """SHA256 of all ignored files contents, relative to git root"""
    root = Path(repo.working_tree_dir)
    h = hashlib.sha256()
    for p in ignored_files(repo):
        file_path = root / p
        if file_path.is_file():
            h.update(file_path.read_bytes())
        h.update(str(p).encode())  # include path in hash
    return h.hexdigest()


def open_image(img: Path):
    system = platform.system()
    if system == "Darwin":
        subprocess.run(["open", str(img)], check=False)
    elif system == "Windows":
        import os
        os.startfile(str(img))
    else:
        subprocess.run(["xdg-open", str(img)], check=False)


def snapshot(repo: Repo):
    root = Path(repo.working_tree_dir)
    repo_snap = BASE_SNAPSHOT_DIR / repo_id(repo)
    repo_snap.mkdir(parents=True, exist_ok=True)

    ig = ignored_files(repo)
    if not ig:
        print("No ignored files to snapshot.")
        return

    ignored_hash = compute_ignored_hash(repo)
    snap = repo_snap / ignored_hash
    snap.mkdir(exist_ok=True)

    # ✅ Robust rsync: pass ignored files as arguments with ./ prefix to preserve relative paths
    files = [f"./{p}" for p in ig]
    subprocess.run(
        ["rsync", "-a", "--delete", "--relative"] + files + [str(snap)],
        cwd=root,
        check=True
    )

    print(f"Snapshot created: {snap} ({len(ig)} ignored files)")

    # latest symlink
    latest_link = repo_snap / "latest"
    if latest_link.exists() or latest_link.is_symlink():
        latest_link.unlink()
    latest_link.symlink_to(snap.name, target_is_directory=True)
    print(f"Latest snapshot updated: {latest_link} -> {snap.name}")


def diff(repo: Repo):
    root = Path(repo.working_tree_dir)
    repo_snap = BASE_SNAPSHOT_DIR / repo_id(repo)
    latest_snap = repo_snap / "latest"

    if not latest_snap.exists():
        print("No snapshot found. Run 'snapshot' first.")
        return

    # 1️⃣ Tracked files via git
    print("\n=== Tracked files (git diff) ===")
    subprocess.run(["git", "-C", str(root), "diff"], check=False)

    # 2️⃣ Ignored files
    ig = ignored_files(repo)
    if not ig:
        print("\nNo ignored files.")
        return

    print("\n=== Ignored files diff ===")
    # rsync dry-run to detect changes
    files = [f"./{p}" for p in ig]
    proc = subprocess.run(
        ["rsync", "-a", "--relative", "--dry-run"] + files + [str(root)],
        cwd=latest_snap,  # run inside snapshot folder
        capture_output=True,
        text=True,
        check=False
    )

    for line in proc.stdout.splitlines():
        path = Path(line.strip())
        pf = latest_snap / path
        cf = root / path
        if not cf.exists():
            print(f"\n--- Deleted file: {path}")
            continue

        # Determine binary vs text
        try:
            with open(cf, "rb") as f:
                chunk = f.read(1024)
                is_binary = b"\0" in chunk
        except Exception:
            is_binary = True

        if is_binary:
            print(f"\n*** Binary file changed: {path}")
            subprocess.run(["diffoscope", str(pf), str(cf)], check=False)
            open_image(cf)
        else:
            print(f"\n--- Text file changed: {path}")
            subprocess.run(["diff", "-u", str(pf), str(cf)], check=False)


class SnapDiff:
    def snapshot(self, repo: str = None):
        snapshot(get_repo(repo))

    def diff(self, repo: str = None):
        diff(get_repo(repo))


if __name__ == "__main__":
    fire.Fire(SnapDiff)
