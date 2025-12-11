#!/usr/bin/env python3
"""Git ignore."""

import hashlib
import os
import platform
import subprocess
from pathlib import Path

import fire
from git import InvalidGitRepositoryError, Repo

BASE_DIR = Path("/tmp/gitignore_snapshots")


def get_repo(path: str | None = None) -> Repo:
    p = Path(path or ".")
    if p.is_file():
        p = p.parent
    try:
        return Repo(p, search_parent_directories=True)
    except InvalidGitRepositoryError as e:
        msg = f"No Git repository found for: {p.resolve()}"
        raise InvalidGitRepositoryError(msg) from e


def repo_id(repo: Repo) -> str:
    src = (
        next(iter(repo.remotes[0].urls), None)
        if repo.remotes
        else str(repo.working_tree_dir)
    )
    return hashlib.sha256(src.encode()).hexdigest()


def ignored_files(repo: Repo):
    out = repo.git.ls_files("-o", "-i", "--directory", "--exclude-standard")
    return sorted(Path(p) for p in out.splitlines() if p.strip())


def commit(repo: Repo) -> None:
    root = Path(repo.working_tree_dir)
    repo_dir = BASE_DIR / repo_id(repo)
    repo_dir.mkdir(parents=True, exist_ok=True)
    files = ignored_files(repo)
    if not files:
        return
    h = hashlib.sha256()
    for p in files:
        fp = root / p
        data = (fp.read_bytes() if fp.is_file() else b"") + str(p).encode()
        h.update(data)
    snap_hash = h.hexdigest()
    snap_dir = repo_dir / snap_hash
    snap_dir.mkdir(exist_ok=True)
    file_args = [f"./{p}" for p in files]
    subprocess.run(
        ["rsync", "-a", "--delete", "--relative", *file_args, str(snap_dir)],
        cwd=root,
        check=True,
    )
    latest = repo_dir / "latest"
    if latest.exists() or latest.is_symlink():
        latest.unlink()
    latest.symlink_to(snap_hash, target_is_directory=True)


def diff(repo: Repo) -> None:
    root = Path(repo.working_tree_dir)
    repo_dir = BASE_DIR / repo_id(repo)
    latest = repo_dir / "latest"
    if not latest.exists():
        return
    files = ignored_files(repo)
    if not files:
        return
    diff_dir = repo_dir / "diffs"
    diff_dir.mkdir(exist_ok=True)
    for path in files:
        pf = latest / path
        cf = root / path
        if pf.is_dir() or not cf.exists():
            continue
        file_data = pf.read_bytes() + cf.read_bytes() + str(path).encode()
        file_hash = hashlib.sha256(file_data).hexdigest()
        diff_subdir = diff_dir / file_hash
        diff_subdir.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["diffoscope", str(pf), str(cf), "--html-dir", str(diff_subdir)],
            check=False,
        )
        index_path = diff_subdir / "index.html"
        system = platform.system()
        if system == "Darwin":
            subprocess.run(["open", str(index_path)], check=False)
        elif system == "Windows":
            os.startfile(str(index_path))
        else:
            subprocess.run(["xdg-open", str(index_path)], check=False)


class GitIgnore:
    def commit(self, repo: str | None = None) -> None:
        commit(get_repo(repo))

    def diff(self, repo: str | None = None) -> None:
        diff(get_repo(repo))


if __name__ == "__main__":
    fire.Fire(GitIgnore)
