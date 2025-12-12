#!/bin/sh
set -e

# Resolve the repository root
repo_root=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")

case "${1:-}" in
-h | --help | help)
  cat <<'EOF'
git-inverse: track files ignored by the main Git repository

Usage:
  git-inverse <git-command> [args...]

Runs Git commands in the inverse repository (.gitinverse), which tracks
only files ignored by the main repository. Temporarily inverts .gitignore
rules so normally ignored files become trackable.
EOF
  exit 0
  ;;
esac

# Ensure .gitinverse exists
if [ -d "$repo_root/.gitinverse" ]; then
  echo "*" >"$repo_root/.gitinverse/.gitignore"
fi

# Backup existing .gitignore if present
if [ -f "$repo_root/.gitignore" ]; then
  mv "$repo_root/.gitignore" "$repo_root/.gitignore.orig"
  # shellcheck disable=SC2016
  restore_cmd='mv "$repo_root/.gitignore.orig" "$repo_root/.gitignore"'
else
  # shellcheck disable=SC2016
  restore_cmd='rm -f "$repo_root/.gitignore"'
fi

# shellcheck disable=SC2064
trap "$restore_cmd" EXIT

# Create temporary inverted .gitignore
{
  echo "*"
  if [ -f "$repo_root/.gitignore.orig" ]; then
    grep -v '^[[:space:]]*$' "$repo_root/.gitignore.orig" |
      grep -v '^[[:space:]]*#' |
      while IFS= read -r line; do
        echo "!$line"
        case "$line" in
        */)
          echo "!${line}**"
          ;;
        esac
      done
  fi
} >"$repo_root/.gitignore"

# Run Git command in the inverse repository
git --git-dir="$repo_root/.gitinverse" --work-tree="$repo_root" "$@"

# Reset .gitinverse ignore to '*'
if [ -d "$repo_root/.gitinverse" ]; then
  echo "*" >"$repo_root/.gitinverse/.gitignore"
fi
