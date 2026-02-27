#!/usr/bin/env bash
set -e

cd "$(dirname "$(readlink -f "$0")")"

rm -rf packages/default/node_modules/ packages/default/.next/
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#remove-empty-lines {} + || true
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#uncomment -- --remove-doc {} +
nix fmt
