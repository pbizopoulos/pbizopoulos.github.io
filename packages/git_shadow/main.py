#!/usr/bin/env python3
import subprocess
import shutil
from pathlib import Path
import fire


def run(cmd, cwd=None, check=True):
    return subprocess.run(cmd, cwd=cwd, check=check, text=True)


def find_git_root(start: Path) -> Path:
    """Walk upward to locate the Git repository root."""
    p = start.resolve()
    for parent in [p] + list(p.parents):
        if (parent / ".git").exists():
            return parent
    raise RuntimeError("Not inside a Git repository.")


def ensure_tmp_repo(tmp_repo: Path):
    """Initialize the shadow Git repo if missing."""
    if not (tmp_repo / ".git").exists():
        run(["git", "init"], cwd=tmp_repo)
        # Required to allow HEAD~1 diffs
        run(["git", "commit", "--allow-empty", "-m", "initial"], cwd=tmp_repo)


def expand_targets(repo_root: Path, targets):
    """Expand files + directories recursively, repo-root-relative."""
    files = []
    for t in targets:
        p = (repo_root / t).resolve()
        if not p.exists():
            print(f"Warning: does not exist: {p}")
            continue

        if p.is_file():
            files.append(p)
        else:
            for sub in p.rglob("*"):
                if sub.is_file():
                    files.append(sub)
    return files


class GitShadow:
    TMP_BASE = Path("/tmp/gitshadow")

    def _tmp_repo_for_current_repo(self):
        repo_root = find_git_root(Path.cwd())
        tmp_repo = self.TMP_BASE / repo_root.name
        return repo_root, tmp_repo

    #
    # gitshadow add path1 path2 ...
    #
    def add(self, *paths: str):
        """Add ignored files/directories to the shadow repo."""
        if not paths:
            print("Usage: gitshadow add <paths...>")
            return

        repo_root, tmp_repo = self._tmp_repo_for_current_repo()
        tmp_repo.mkdir(parents=True, exist_ok=True)

        ensure_tmp_repo(tmp_repo)

        files = expand_targets(repo_root, list(paths))
        if not files:
            print("Nothing to add.")
            return

        print(f"→ Adding {len(files)} files into shadow repo: {tmp_repo}")
        print("  From repo:", repo_root)
        print("  Paths:", ", ".join(paths))

        for src in files:
            rel = src.relative_to(repo_root)
            dest = tmp_repo / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
            run(["git", "add", str(rel)], cwd=tmp_repo)

        print("✓ Staged. Now run:")
        print("  gitshadow commit -m 'your message'")

    #
    # PASSTHROUGH: treat any unknown attribute as a git subcommand
    #
    def __getattr__(self, command):
        """
        Allows:
            gitshadow commit -m "msg"
            gitshadow diff
            gitshadow log
            gitshadow show HEAD:file
            gitshadow status
        """

        def git_passthrough(*args):
            repo_root, tmp_repo = self._tmp_repo_for_current_repo()

            if not (tmp_repo / ".git").exists():
                print("Shadow repo missing. Run `gitshadow add` first.")
                return

            cmd = ["git", command, *args]
            print(f"→ Running in shadow repo: {' '.join(cmd)}")
            run(cmd, cwd=tmp_repo, check=False)

        return git_passthrough


if __name__ == "__main__":
    fire.Fire(GitShadow)

