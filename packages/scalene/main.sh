#!/bin/sh

main_py="$(realpath "${1%%#*}")/packages/${1##*#}/main.py"
scalene_dir="$(dirname "$main_py")/tmp/scalene"
mkdir -p "$scalene_dir"
nix develop "$1" --command nix-shell -p python312Packages.scalene --command '
  DEBUG=1 scalene --outfile "'"$scalene_dir"'/profile.html" "'"$main_py"'"
'
