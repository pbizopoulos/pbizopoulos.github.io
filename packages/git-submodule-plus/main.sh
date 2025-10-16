#!/bin/sh
set -e

subcommand_arg="${1:-}"
repo_arg="${2:-}"

if [ "$subcommand_arg" = "bootstrap" ]; then
  repository_domain=github.com
  git init "$HOME"
  printf '*\n!.gitignore\n' >"$HOME/.gitignore"
  gh auth status --hostname "$repository_domain" || gh auth login --git-protocol ssh --hostname "$repository_domain" --skip-ssh-key --web
  gh repo list | while read -r repo _; do
    git -C "$HOME" submodule add --force git@"$repository_domain:$repo" "$repository_domain/$repo"
  done
  gh org list | while read -r org _; do
    gh repo list "$org" | while read -r repo _; do
      git -C "$HOME" submodule add --force git@"$repository_domain:$repo" "$repository_domain/$repo"
    done
  done

elif [ "$subcommand_arg" = "add" ]; then
  repository_domain=github.com
  [ -z "$repo_arg" ] && echo "usage: git-submodule-plus $subcommand_arg <repo_arg>" && exit 1
  git -C "$HOME" submodule add --force git@"$repository_domain:$repo_arg" "$HOME/$repository_domain/$repo_arg"

else
  echo "usage: git-submodule-plus {bootstrap|add}"
  exit 1
fi
