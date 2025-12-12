#!/bin/sh
set -e

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
git --git-dir=.gitignore_ --work-tree=. "$@"
