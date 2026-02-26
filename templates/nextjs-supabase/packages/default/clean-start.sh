#!/usr/bin/env bash
set -e

rm -rf node_modules/ .next/
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#remove-empty-lines {} + || true
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#uncomment -- --remove-doc {} +
nix fmt
nix develop -c npm install
nix develop -c supabase db lint --fail-on warning
nix develop -c npx tsc
nix develop -c npm run build
nix develop -c npm test
nix build
