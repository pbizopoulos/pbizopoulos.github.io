#!/usr/bin/env python3
"""Snapshot and compare ignored files in a Git repository."""

import hashlib
import os
import platform
import subprocess
from pathlib import Path

import fire
from git import InvalidGitRepositoryError, Repo

SNAPSHOT_BASE_DIRECTORY = Path("/tmp/gitignore_snapshots")


def _compute_repository_id(repository: Repo) -> str:
    if repository.remotes:
        remote_url = next(iter(repository.remotes[0].urls), None)
        data_bytes = remote_url.encode() if remote_url else b""
    else:
        data_bytes = str(repository.working_tree_dir).encode()
    return hashlib.sha256(data_bytes).hexdigest()


def _list_ignored_files(repository: Repo) -> list[Path]:
    ignored = repository.git.ls_files(
        "-o",  # other (untracked) files
        "-i",  # ignored files
        "--directory",
        "--exclude-standard",
    )
    return sorted(Path(file_path) for file_path in ignored.splitlines() if file_path)


class GitIgnore:
    """Manage snapshots and diffs of ignored files in Git repositories."""

    def commit(self, repository_path: str | None = None) -> None:
        target_path = Path(repository_path or ".")
        if target_path.is_file():
            target_path = target_path.parent
        try:
            repository = Repo(target_path, search_parent_directories=True)
        except InvalidGitRepositoryError as e:
            message = f"No Git repository found for: {target_path.resolve()}"
            raise InvalidGitRepositoryError(message) from e
        repository_root = Path(repository.working_tree_dir)
        repository_directory = SNAPSHOT_BASE_DIRECTORY / _compute_repository_id(repository)
        repository_directory.mkdir(parents=True, exist_ok=True)
        ignored_files = _list_ignored_files(repository)
        if not ignored_files:
            return
        snapshot_data = bytearray()
        for file_path in ignored_files:
            full_file_path = repository_root / file_path
            if full_file_path.is_file():
                snapshot_data.extend(full_file_path.read_bytes())
            snapshot_data.extend(str(file_path).encode())
        snapshot_hash = hashlib.sha256(snapshot_data).hexdigest()
        snapshot_directory = repository_directory / snapshot_hash
        snapshot_directory.mkdir(exist_ok=True)
        relative_file_paths = [f"./{file_path}" for file_path in ignored_files]
        subprocess.run(
            [
                "rsync",
                "-a",
                "--delete",
                "--relative",
                *relative_file_paths,
                str(snapshot_directory),
            ],
            cwd=repository_root,
            check=True,
        )
        latest_symlink = repository_directory / "latest"
        if latest_symlink.exists() or latest_symlink.is_symlink():
            latest_symlink.unlink()
        latest_symlink.symlink_to(snapshot_hash, target_is_directory=True)

    def diff(self, repository_path: str | None = None) -> None:
        target_path = Path(repository_path or ".")
        if target_path.is_file():
            target_path = target_path.parent
        try:
            repository = Repo(target_path, search_parent_directories=True)
        except InvalidGitRepositoryError as e:
            message = f"No Git repository found for: {target_path.resolve()}"
            raise InvalidGitRepositoryError(message) from e
        repository_root = Path(repository.working_tree_dir)
        repository_directory = SNAPSHOT_BASE_DIRECTORY / _compute_repository_id(repository)
        latest_snapshot_symlink = repository_directory / "latest"
        if not latest_snapshot_symlink.exists():
            return
        ignored_files = _list_ignored_files(repository)
        if not ignored_files:
            return
        diffs_directory = repository_directory / "diffs"
        diffs_directory.mkdir(exist_ok=True)
        for relative_file_path in ignored_files:
            previous_file_path = latest_snapshot_symlink / relative_file_path
            current_file_path = repository_root / relative_file_path
            if previous_file_path.is_dir() or not current_file_path.exists():
                continue
            diff_data = bytearray()
            if previous_file_path.is_file() and current_file_path.exists():
                diff_data.extend(previous_file_path.read_bytes())
                diff_data.extend(current_file_path.read_bytes())
                diff_data.extend(str(relative_file_path).encode())
            diff_hash = hashlib.sha256(diff_data).hexdigest()
            diff_snapshot_directory = diffs_directory / diff_hash
            diff_snapshot_directory.mkdir(parents=True, exist_ok=True)
            subprocess.run(
                [
                    "diffoscope",
                    str(previous_file_path),
                    str(current_file_path),
                    "--html-dir",
                    str(diff_snapshot_directory),
                ],
                check=False,
            )
            index_html_path = diff_snapshot_directory / "index.html"
            current_platform = platform.system()
            if current_platform == "Darwin":
                subprocess.run(["open", str(index_html_path)], check=False)
            elif current_platform == "Windows":
                os.startfile(str(index_html_path))
            else:
                subprocess.run(["xdg-open", str(index_html_path)], check=False)


if __name__ == "__main__":
    fire.Fire(GitIgnore)
