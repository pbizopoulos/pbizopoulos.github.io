#!/usr/bin/env python3
"""Git ignore."""

import hashlib
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


def compute_hash(repo: Repo) -> str:
    root = Path(repo.working_tree_dir)
    h = hashlib.sha256()
    for p in ignored_files(repo):
        fp = root / p
        if fp.is_file():
            h.update(fp.read_bytes())
        h.update(str(p).encode())
    return h.hexdigest()


def is_binary(path: Path) -> bool:
    try:
        with open(path, "rb") as f:
            return b"\0" in f.read(1024)
    except Exception:
        return True


def open_file(path: Path) -> None:
    system = platform.system()
    if system == "Darwin":
        subprocess.run(["open", str(path)], check=False)
    elif system == "Windows":
        import os

        os.startfile(str(path))
    else:
        subprocess.run(["xdg-open", str(path)], check=False)


def commit(repo: Repo) -> None:
    root = Path(repo.working_tree_dir)
    repo_dir = BASE_DIR / repo_id(repo)
    repo_dir.mkdir(parents=True, exist_ok=True)
    files = ignored_files(repo)
    if not files:
        return
    snap_hash = compute_hash(repo)
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
    file_args = [f"./{p}" for p in files]
    proc = subprocess.run(
        [
            "rsync",
            "-a",
            "--relative",
            "--dry-run",
            "--itemize-changes",
            *file_args,
            str(root),
        ],
        cwd=latest,
        capture_output=True,
        text=True,
        check=False,
    )
    for line in proc.stdout.splitlines():
        if not line.strip():
            continue
        code = line[:11]
        path = Path(line[12:])
        pf = latest / path
        cf = root / path
        if code.startswith("<"):
            continue
        if code.startswith((">", "c")) and cf.is_file():
            h = hashlib.sha256()
            h.update(pf.read_bytes())
            h.update(cf.read_bytes())
            h.update(str(path).encode())
            file_hash = h.hexdigest()
            diff_dir = repo_dir / "diffs"
            diff_dir.mkdir(exist_ok=True)
            if cf.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif"}:
                orig_img = diff_dir / f"{file_hash}_original{cf.suffix}"
                new_img = diff_dir / f"{file_hash}_new{cf.suffix}"
                diff_img = diff_dir / f"{file_hash}_diff.png"
                subprocess.run(["cp", str(pf), str(orig_img)], check=True)
                subprocess.run(["cp", str(cf), str(new_img)], check=True)
                subprocess.run(
                    [
                        "compare",
                        "-highlight-color",
                        "red",
                        "-compose",
                        "src",
                        str(pf),
                        str(cf),
                        str(diff_img),
                    ],
                    check=False,
                )
                diff_html = diff_dir / f"{file_hash}.html"
                with open(diff_html, "w") as f:
                    f.write(f"""
                    <html>
                    <head><title>Diff for {path}</title></head>
                    <body>
                        <h2>{path}</h2>
                        <table>
                        <tr>
                            <th>Original</th><th>New</th><th>Diff</th>
                        </tr>
                        <tr>
                            <td><img src="{orig_img.name}" alt="Original" style="max-width:400px;"/></td>
                            <td><img src="{new_img.name}" alt="New" style="max-width:400px;"/></td>
                            <td><img src="{diff_img.name}" alt="Diff" style="max-width:400px;"/></td>
                        </tr>
                        </table>
                    </body>
                    </html>
                    """)
                open_file(diff_html)
            elif is_binary(cf):
                diff_html = diff_dir / f"{file_hash}.html"
                subprocess.run(
                    ["diffoscope", str(pf), str(cf), "--html", str(diff_html)],
                    check=False,
                )
                open_file(diff_html)
            else:
                subprocess.run(["diff", "-u", str(pf), str(cf)], check=False)


class GitIgnore:
    def commit(self, repo: str | None = None) -> None:
        commit(get_repo(repo))

    def diff(self, repo: str | None = None) -> None:
        diff(get_repo(repo))


if __name__ == "__main__":
    fire.Fire(GitIgnore)
