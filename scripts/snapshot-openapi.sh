#!/bin/bash

set -euo pipefail

# Usage:
#   ./scripts/snapshot-openapi.sh --out openapi/openapi.json [--url http://localhost:40417/v3/api-docs]
#
# Defaults:
# - URL: http://localhost:40417/v3/api-docs
# - OUT: openapi/openapi.json

DEFAULT_URL="http://127.0.0.1:40417/v3/api-docs"
URL="$DEFAULT_URL"
OUT="openapi/openapi.json"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)
      URL="$2"
      shift 2
      ;;
    --out)
      OUT="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--url <openapi_url>] [--out <output_path>]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

mkdir -p "$(dirname "$OUT")"

echo "📡 Fetching OpenAPI spec from: $URL"
echo "💾 Writing to: $OUT"

# Use node fetch for better portability than curl across environments.
SNAPSHOT_OPENAPI_URL="$URL" SNAPSHOT_OPENAPI_OUT="$OUT" node - <<'NODE'
const fs = require('fs');
const path = require('path');

async function main() {
  const url = process.env.SNAPSHOT_OPENAPI_URL;
  const out = process.env.SNAPSHOT_OPENAPI_OUT;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch spec: ${res.status} ${res.statusText}\n${text}`);
  }
  const json = await res.json();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(json, null, 2) + '\n', 'utf8');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
NODE

echo "✅ Snapshot saved."


