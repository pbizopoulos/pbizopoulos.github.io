#!/usr/bin/env bash
set -e

DOMAIN="${1:-}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: $0 <domain>"
  exit 1
fi

# shellcheck disable=SC2046
curl -s "https://crt.sh/?q=${DOMAIN}&output=json" |
  jq '[.[] | select(.entry_timestamp > "'$(date -u -d "7 days ago" +%Y-%m-%dT%H:%M:%S)'")] | length as $n | {issued: $n, remaining: 50 - $n}'
