#!/usr/bin/env python3
import hashlib
import subprocess
import shutil
from pathlib import Path
import platform
import os
import fire

BASE_SNAPSHOT_DIR = Path("/tmp/snapdiff_snapshots")

def _hash_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def _get_snapshot_paths(dir_path: Path):
    dir_abs = dir_path.resolve()
    safe_dir = str(dir_abs).replace("/", "_")
    cur_snapshot = BASE_SNAPSHOT_DIR / f"{safe_dir}.snapshot"
    prev_snapshot = BASE_SNAPSHOT_DIR / f"{safe_dir}.snapshot.prev"
    prev_dir = BASE_SNAPSHOT_DIR / f"{safe_dir}.prev_dir"
    cur_snapshot.parent.mkdir(parents=True, exist_ok=True)
    prev_dir.mkdir(parents=True, exist_ok=True)
    return cur_snapshot, prev_snapshot, prev_dir, dir_abs

def _save_snapshot(dir_abs: Path, snapshot_path: Path):
    with open(snapshot_path, "w") as f:
        for file in sorted(dir_abs.rglob("*")):
            if file.is_file():
                rel = file.relative_to(dir_abs)
                f.write(f"{_hash_file(file)} {rel}\n")

def _copy_dir(src: Path, dst: Path):
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)

def _open_image(img: Path):
    if platform.system() == "Darwin":
        subprocess.run(["open", str(img)], check=False)
    elif platform.system() == "Windows":
        os.startfile(str(img))
    else:  # Linux / Unix
        subprocess.run(["xdg-open", str(img)], check=False)

class SnapDiff:
    """Directory snapshot and diff CLI."""

    def snapshot(self, dir_path: str):
        """Take a snapshot of the directory."""
        dir_path = Path(dir_path)
        cur_snapshot, prev_snapshot, prev_dir, dir_abs = _get_snapshot_paths(dir_path)
        _save_snapshot(dir_abs, cur_snapshot)
        _copy_dir(dir_abs, prev_dir)
        shutil.copy(cur_snapshot, prev_snapshot)
        print(f"Snapshot saved for {dir_abs}")

    def diff(self, dir_path: str):
        """Compare current directory with previous snapshot (does NOT create a snapshot)."""
        dir_path = Path(dir_path)
        cur_snapshot, prev_snapshot, prev_dir, dir_abs = _get_snapshot_paths(dir_path)

        if not prev_snapshot.exists():
            print("No previous snapshot found. Cannot perform diff.")
            return

        # Load previous snapshot
        prev_files = {line.split(maxsplit=1)[1]: line.split(maxsplit=1)[0] for line in prev_snapshot.read_text().splitlines()}

        # Load current directory state (hash on the fly)
        cur_files = {}
        for file in dir_abs.rglob("*"):
            if file.is_file():
                rel = file.relative_to(dir_abs)
                cur_files[str(rel)] = _hash_file(file)

        changed_files = [f for f in set(prev_files) | set(cur_files) if prev_files.get(f) != cur_files.get(f)]
        if not changed_files:
            print("No changes detected.")
            return

        for file in changed_files:
            prev_file = prev_dir / file
            cur_file = dir_abs / file
            if file.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
                diff_file = prev_dir / f"{file}.diff.png"
                diff_file.parent.mkdir(parents=True, exist_ok=True)
                if prev_file.exists() and cur_file.exists():
                    subprocess.run(["compare", str(prev_file), str(cur_file), str(diff_file)], check=False)
                    _open_image(diff_file)
                elif not prev_file.exists() and cur_file.exists():
                    shutil.copy(cur_file, diff_file)
                    _open_image(diff_file)
            else:
                if prev_file.exists() and cur_file.exists():
                    subprocess.run(["diffoscope", str(prev_file), str(cur_file)])
                elif not prev_file.exists() and cur_file.exists():
                    subprocess.run(["diffoscope", "/dev/null", str(cur_file)])
                else:
                    subprocess.run(["diffoscope", str(prev_file), "/dev/null"])

if __name__ == "__main__":
    fire.Fire(SnapDiff)
