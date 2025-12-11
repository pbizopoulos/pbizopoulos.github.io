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
        """Show differences between ignored files and the latest snapshot, including new/deleted files."""

        IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp"}

        def is_image(file_path: Path) -> bool:
            return file_path.suffix.lower() in IMAGE_EXTENSIONS

        target_path = Path(repository_path or ".")
        if target_path.is_file():
            target_path = target_path.parent

        try:
            repository = Repo(target_path, search_parent_directories=True)
        except InvalidGitRepositoryError as e:
            raise InvalidGitRepositoryError(f"No Git repository found for: {target_path.resolve()}") from e

        repository_root = Path(repository.working_tree_dir)
        repository_directory = SNAPSHOT_BASE_DIRECTORY / _compute_repository_id(repository)
        latest_snapshot_symlink = repository_directory / "latest"

        if not latest_snapshot_symlink.exists():
            print("No previous snapshot found. Run commit first.")
            return

        ignored_files = _list_ignored_files(repository)
        if not ignored_files:
            print("No ignored files found in the repository.")
            return

        diffs_directory = repository_directory / "diffs"
        diffs_directory.mkdir(exist_ok=True)

        for relative_file_path in ignored_files:
            previous_file_path = latest_snapshot_symlink / relative_file_path
            current_file_path = repository_root / relative_file_path

            previous_exists = previous_file_path.exists()
            current_exists = current_file_path.exists()

            diff_snapshot_directory = diffs_directory / hashlib.sha256(
                (str(previous_file_path) + str(current_file_path)).encode()
            ).hexdigest()
            diff_snapshot_directory.mkdir(parents=True, exist_ok=True)

            path_to_open = None

            try:
                if not previous_exists and current_exists:
                    # New ignored file
                    print(f"New ignored file: {relative_file_path}")
                    path_to_open = current_file_path

                elif previous_exists and not current_exists:
                    # Deleted ignored file
                    print(f"Ignored file deleted: {relative_file_path}")
                    path_to_open = previous_file_path

                elif previous_exists and current_exists:
                    # Both exist: show diff
                    if is_image(previous_file_path):
                        diff_image_path = diff_snapshot_directory / f"{relative_file_path.name}.diff.png"
                        subprocess.run(
                            [
                                "magick",
                                "compare",
                                "-metric",
                                "AE",
                                str(previous_file_path),
                                str(current_file_path),
                                str(diff_image_path),
                            ],
                            check=False,
                            capture_output=True
                        )
                        if diff_image_path.exists():
                            path_to_open = diff_image_path
                        else:
                            print(f"No image diff generated for {relative_file_path}")
                            continue
                    else:
                        subprocess.run(
                            [
                                "diffoscope",
                                str(previous_file_path),
                                str(current_file_path),
                                "--html-dir",
                                str(diff_snapshot_directory),
                            ],
                            check=False
                        )
                        index_html_path = diff_snapshot_directory / "index.html"
                        if index_html_path.exists():
                            path_to_open = index_html_path
                        else:
                            print(f"No HTML diff generated for {relative_file_path}")
                            continue

                # Open the file/HTML diff if available
                if path_to_open and path_to_open.exists():
                    current_platform = platform.system()
                    if current_platform == "Darwin":
                        subprocess.run(["open", str(path_to_open)], check=False)
                    elif current_platform == "Windows":
                        os.startfile(str(path_to_open))
                    else:
                        subprocess.run(["xdg-open", str(path_to_open)], check=False)

            except Exception as e:
                print(f"Failed to generate diff for {relative_file_path}: {e}")

if __name__ == "__main__":
    fire.Fire(GitIgnore)
