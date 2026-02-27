#!/usr/bin/env bash
set -e

cd "$(dirname "$(readlink -f "$0")")"
./clean.sh
nix develop -c ./check.sh
nix build
