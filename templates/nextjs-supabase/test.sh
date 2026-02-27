#!/usr/bin/env bash
set -e

ROOT_DIR="$(dirname "$(readlink -f "$0")")"
cd "$ROOT_DIR"

# Clean
rm -rf packages/default/node_modules/ packages/default/.next/
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#remove-empty-lines {} + || true
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#uncomment -- --remove-doc {} +
nix fmt

# Check
nix develop -c bash -c "
set -e
cd "$ROOT_DIR/packages/default/"
supabase stop
supabase start
npm install
supabase db lint --fail-on warning
npx tsc
npm run build
npm test
npm run test:cpd
npm run test:deps
npm run test:mutation
npm run test:mutation:metrics
"

# Build
nix build
