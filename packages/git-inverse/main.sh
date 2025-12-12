#!/bin/sh
set -e

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

if [ -d .gitinverse ]; then
  echo "*" >.gitinverse/.gitignore
fi
if [ -f .gitignore ]; then
  mv .gitignore .gitignore.orig
  restore_cmd='mv .gitignore.orig .gitignore'
else
  restore_cmd='rm -f .gitignore'
fi
# shellcheck disable=SC2064
trap "$restore_cmd" EXIT
{
  echo "*"
  if [ -f .gitignore.orig ]; then
    grep -v '^[[:space:]]*$' .gitignore.orig |
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
} >.gitignore
git --git-dir=.gitinverse --work-tree=. "$@"
if [ -d .gitinverse ]; then
  echo "*" >.gitinverse/.gitignore
fi
