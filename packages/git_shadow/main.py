#!/usr/bin/env python3
import subprocess
import shutil
from pathlib import Path
import fire

def run(cmd, cwd=None, check=True):
    return subprocess.run(cmd, cwd=cwd, check=check, text=True)

def find_git_root(start: Path) -> Path:
    """Find the root of the current Git repository."""
    p = start.resolve()
    for parent in [p] + list(p.parents):
        if (parent / ".git").exists():
            return parent
    raise RuntimeError("Not inside a Git repository.")

def expand_targets(repo_root: Path, targets, cwd: Path) -> list[Path]:
    """
    Expand files and directories recursively.
    - `targets` are relative to the current working directory.
    - Returns a list of absolute Paths inside the real repo.
    """
    files = []
    for t in targets:
        path = (cwd / t).resolve()  # Resolve relative to current working directory
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
        """Return repo_root and shadow repo path."""
        repo_root = find_git_root(Path.cwd())
        tmp_repo = self.TMP_BASE / repo_root.name
        tmp_repo.mkdir(parents=True, exist_ok=True)
        return repo_root, tmp_repo

    def init(self):
        """Initialize the shadow Git repo in /tmp/<repository>."""
        repo_root, tmp_repo = self._tmp_repo()
        if (tmp_repo / ".git").exists():
            print(f"Shadow repo already exists: {tmp_repo}")
            return
        run(["git", "init"], cwd=tmp_repo)
        run(["git", "commit", "--allow-empty", "-m", "initial"], cwd=tmp_repo)
        print(f"Shadow repo initialized at: {tmp_repo}")

    def add(self, *paths: str):
        """Copy specified files/directories into the shadow repo and stage them."""
        if not paths:
            print("Usage: gitshadow add <paths...>")
            return
        repo_root, tmp_repo = self._tmp_repo()
        if not (tmp_repo / ".git").exists():
            print("Shadow repo missing. Run `gitshadow init` first.")
            return

        cwd = Path.cwd()  # current working directory
        files = expand_targets(repo_root, paths, cwd)
        if not files:
            print("Nothing to add.")
            return

        print(f"→ Adding {len(files)} files into shadow repo: {tmp_repo}")
        print("  From repo root:", repo_root)
        print("  Paths:", ", ".join(paths))

        for src in files:
            rel = src.relative_to(repo_root)  # relative to repo root
            dest = tmp_repo / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
            run(["git", "add", str(rel)], cwd=tmp_repo)

        print("✓ Files staged. Now run `gitshadow commit -m 'message'` to commit.")

    def __getattr__(self, command):
        """Passthrough all other git commands into shadow repo."""
        def git_passthrough(*args):
            repo_root, tmp_repo = self._tmp_repo()
            if not (tmp_repo / ".git").exists():
                print("Shadow repo missing. Run `gitshadow init` first.")
                return
            cmd = ["git", command, *args]
            print(f"→ Running in shadow repo: {' '.join(cmd)}")
            run(cmd, cwd=tmp_repo, check=False)
        return git_passthrough

if __name__ == "__main__":
    fire.Fire(GitShadow)

