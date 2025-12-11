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
    p = Path(path or ".").parent if Path(path or ".").is_file() else Path(path or ".")
    try:
        return Repo(p, search_parent_directories=True)
    except InvalidGitRepositoryError as e:
        msg = f"No Git repository found for: {p.resolve()}"
        raise InvalidGitRepositoryError(msg) from e


def repo_id(repo: Repo) -> str:
    return hashlib.sha256(
        (src := next(iter(repo.remotes[0].urls), None)).encode()
        if repo.remotes
        else str(repo.working_tree_dir).encode(),
    ).hexdigest()


def ignored_files(repo: Repo):
    return sorted(
        Path(p)
        for p in repo.git.ls_files(
            "-o",
            "-i",
            "--directory",
            "--exclude-standard",
        ).splitlines()
        if p.strip()
    )


class GitIgnore:
    def commit(self, repo: str | None = None) -> None:
        repo = get_repo(repo)
        root = Path(repo.working_tree_dir)
        repo_dir = BASE_DIR / repo_id(repo)
        repo_dir.mkdir(parents=True, exist_ok=True)
        files = ignored_files(repo)
        if not files:
            return
        snap_hash = hashlib.sha256(
            b"".join(
                ((root / p).read_bytes() if (root / p).is_file() else b"")
                + str(p).encode()
                for p in files
            ),
        ).hexdigest()
        snap_dir = repo_dir / snap_hash
        snap_dir.mkdir(exist_ok=True)
        subprocess.run(
            [
                "rsync",
                "-a",
                "--delete",
                "--relative",
                *[f"./{p}" for p in files],
                str(snap_dir),
            ],
            cwd=root,
            check=True,
        )
        latest = repo_dir / "latest"
        if latest.exists() or latest.is_symlink():
            latest.unlink()
        latest.symlink_to(snap_hash, target_is_directory=True)

    def diff(self, repo: str | None = None) -> None:
        repo = get_repo(repo)
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
            file_hash = hashlib.sha256(
                pf.read_bytes() + cf.read_bytes() + str(path).encode(),
            ).hexdigest()
            diff_subdir = diff_dir / file_hash
            diff_subdir.mkdir(parents=True, exist_ok=True)
            subprocess.run(
                ["diffoscope", str(pf), str(cf), "--html-dir", str(diff_subdir)],
                check=False,
            )
            index_path = diff_subdir / "index.html"
            system = platform.system()
            opener = {
                "Darwin": ["open", str(index_path)],
                "Windows": lambda: os.startfile(str(index_path)),
            }.get(system, ["xdg-open", str(index_path)])
            if callable(opener):
                opener()
            else:
                subprocess.run(opener, check=False)


if __name__ == "__main__":
    fire.Fire(GitIgnore)
