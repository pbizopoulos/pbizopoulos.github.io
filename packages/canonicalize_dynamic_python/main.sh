#!/bin/sh

main_py="$(realpath "${1%%#*}")/packages/${1##*#}/main.py"
coverage_dir="$(dirname "$main_py")/tmp/coverage"
# shellcheck disable=SC2016
nix develop "$1" --command bash -c '
  set -eu
  DEBUG=1 coverage run --data-file="'"$coverage_dir"'/.coverage" "'"$main_py"'"
  coverage html --data-file="'"$coverage_dir"'/.coverage" --directory="'"$coverage_dir"'" --ignore-errors
'
scalene_dir="$(dirname "$main_py")/tmp/scalene"
mkdir -p "$scalene_dir"
nix develop "$1" --command nix-shell -p python312Packages.scalene --command '
  DEBUG=1 scalene --outfile "'"$scalene_dir"'/profile.html" "'"$main_py"'"
'
