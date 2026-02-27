#!/usr/bin/env bash
set -e

ROOT_DIR="$(dirname "$(readlink -f "$0")")"
cd "$ROOT_DIR"

rm -rf packages/default/node_modules/ packages/default/.next/
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#remove-empty-lines {} + || true
find . -exec nix run github:pbizopoulos/pbizopoulos.github.io#uncomment -- --remove-doc {} +
nix fmt
nix build
nix develop -c bash -c "
set -e
supabase stop --workdir $ROOT_DIR/packages/default
supabase start --workdir $ROOT_DIR/packages/default
npm install --prefix $ROOT_DIR/packages/default
supabase db lint --fail-on warning --workdir $ROOT_DIR/packages/default
npm exec --prefix $ROOT_DIR/packages/default -- tsc -p $ROOT_DIR/packages/default
npm run build --prefix $ROOT_DIR/packages/default
npm test --prefix $ROOT_DIR/packages/default
npm run test:cpd --prefix $ROOT_DIR/packages/default
npm run test:deps --prefix $ROOT_DIR/packages/default
npm run test:mutation --prefix $ROOT_DIR/packages/default
npm run test:mutation:metrics --prefix $ROOT_DIR/packages/default
"
