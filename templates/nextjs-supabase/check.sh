#!/usr/bin/env bash
set -e

cd "$(dirname "$(readlink -f "$0")")"/packages/default/

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
