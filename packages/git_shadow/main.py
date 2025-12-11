#!/usr/bin/env python3
import subprocess
import shutil
from pathlib import Path
import fire
import hashlib
import webbrowser
import mimetypes

def run(cmd, cwd=None):
    """Run a command and print output."""
    subprocess.run(cmd, cwd=cwd, check=False, text=True)

def find_git_root(start: Path) -> Path:
    """Find the root of the current Git repository."""
    p = start.resolve()
    for parent in [p] + list(p.parents):
        if (parent / ".git").exists():
            return parent
    raise RuntimeError("Not inside a Git repository.")

def expand_targets(repo_root: Path, targets, cwd: Path) -> list[Path]:
    """Expand files/directories relative to current working directory."""
    files = []
    for t in targets:
        path = (cwd / t).resolve()
        if not path.exists():
            print(f"Warning: {path} does not exist.")
            continue
        if path.is_file():
            files.append(path)
        else:
            for p in path.rglob("*"):
                if p.is_file():
                    files.append(p)
    return files

class GitShadow:
    TMP_BASE = Path("/tmp/gitshadow")

    def _tmp_repo(self):
        repo_root = find_git_root(Path.cwd())
        tmp_repo = self.TMP_BASE / repo_root.name
        tmp_repo.mkdir(parents=True, exist_ok=True)
        return repo_root, tmp_repo

    def init(self):
        """Initialize the shadow repo."""
        repo_root, tmp_repo = self._tmp_repo()
        if (tmp_repo / ".git").exists():
            print(f"Shadow repo already exists: {tmp_repo}")
            return
        run(["git", "init"], cwd=tmp_repo)
        run(["git", "commit", "--allow-empty", "-m", "initial"], cwd=tmp_repo)
        print(f"Shadow repo initialized at: {tmp_repo}")

    def add(self, *paths: str):
        """Add files/directories into the shadow repo."""
        if not paths:
            print("Usage: gitshadow add <paths...>")
            return
        repo_root, tmp_repo = self._tmp_repo()
        if not (tmp_repo / ".git").exists():
            print("Shadow repo missing. Run `gitshadow init` first.")
            return

        cwd = Path.cwd()
        files = expand_targets(repo_root, paths, cwd)
        if not files:
            print("Nothing to add.")
            return

        for src in files:
            rel = src.relative_to(repo_root)
            dest = tmp_repo / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
            run(["git", "add", str(rel)], cwd=tmp_repo)

        print(f"Staged {len(files)} files in shadow repo.")

    def commit(self):
        """Commit staged files with a fixed message."""
        _, tmp_repo = self._tmp_repo()
        if not (tmp_repo / ".git").exists():
            print("Shadow repo missing. Run `gitshadow init` first.")
            return
        run(["git", "commit", "-m", "gitshadow auto commit"], cwd=tmp_repo)
        print("Committed staged files with message: 'gitshadow auto commit'")

    def diff(self):
        """Show differences between shadow repo and original files."""
        repo_root, tmp_repo = self._tmp_repo()
        if not (tmp_repo / ".git").exists():
            print("Shadow repo missing. Run `gitshadow init` first.")
            return

        diffs_dir = tmp_repo / "diffs"
        diffs_dir.mkdir(exist_ok=True)

        # Get tracked files in shadow repo
        result = subprocess.run(
            ["git", "ls-files"],
            cwd=tmp_repo,
            capture_output=True,
            text=True,
            check=True
        )
        tracked_files = result.stdout.splitlines()

        for rel_path in tracked_files:
            shadow_file = tmp_repo / rel_path
            orig_file = repo_root / rel_path
            if not orig_file.exists():
                continue

            mime, _ = mimetypes.guess_type(shadow_file)
            if mime and mime.startswith("image/"):
                # Image file: generate visual diff
                diff_image_dir = diffs_dir / "images"
                diff_image_dir.mkdir(exist_ok=True)
                diff_image_path = diff_image_dir / f"{shadow_file.name}.diff.png"
                subprocess.run([
                    "compare",
                    str(shadow_file),
                    str(orig_file),
                    str(diff_image_path)
                ], check=False)
                if diff_image_path.exists():
                    print(f"Opening image diff for {rel_path}")
                    subprocess.run(["xdg-open", str(diff_image_path)], check=False)
            else:
                # Non-image: generate diffoscope HTML report
                hash_dir = hashlib.sha256(str(rel_path).encode()).hexdigest()
                html_dir = diffs_dir / hash_dir
                html_dir.mkdir(exist_ok=True)
                subprocess.run([
                    "diffoscope",
                    str(shadow_file),
                    str(orig_file),
                    "--html-dir",
                    str(html_dir)
                ], check=False)
                index_html = html_dir / "index.html"
                if index_html.exists():
                    print(f"Opening diffoscope report for {rel_path}")
                    webbrowser.open(index_html.as_uri())

    def status(self):
        """Show status in the shadow repo (read-only, no copying)."""
        _, tmp_repo = self._tmp_repo()
        if not (tmp_repo / ".git").exists():
            print("Shadow repo missing. Run `gitshadow init` first.")
            return
        run(["git", "status"], cwd=tmp_repo)

    def log(self):
        """Show log in the shadow repo."""
        _, tmp_repo = self._tmp_repo()
        if not (tmp_repo / ".git").exists():
            print("Shadow repo missing. Run `gitshadow init` first.")
            return
        run(["git", "log", "--oneline"], cwd=tmp_repo)


if __name__ == "__main__":
    fire.Fire(GitShadow)

