#!/bin/sh
set -e

case "$1" in
-h | --help | help)
  cat <<'EOF'
git-inverse: Track files ignored by the main Git repository using an inverse repository

Usage:
  git-inverse <git-command> [args...]

Description:
  Runs Git commands in a separate repository (.gitinverse) that tracks
  only files ignored by the main repository. Temporarily inverts .gitignore
  rules so normally ignored files become trackable, while everything else
  remains ignored.

Examples:
  git-inverse status
      Show status of normally ignored files.

  git-inverse add build/output.log
      Stage ignored files for commit.

  git-inverse commit -m "Track ignored files"
      Commit ignored files to the inverse repository.

Notes:
  - The inverse repository (.gitinverse) must already exist.
  - The main repository's .gitignore is temporarily replaced and restored.
  - This plugin does not initialize the inverse repository automatically.
EOF
  exit 0
  ;;
esac

if [ ! -f .gitinverse/.gitignore ]; then
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
