#!/bin/bash

set -euo pipefail

# Usage:
#   ./scripts/snapshot-openapi.sh [--url <openapi_url>] [--out <output_path>]
#
# Defaults:
# - URL: https://backend.kidable.in/v3/api-docs
# - OUT: Auto-generated as openapi/openapi.v{N}_{YYYY-MM-DD_HH-MM-IST}.json

DEFAULT_URL="https://backend.kidable.in/v3/api-docs"
URL="$DEFAULT_URL"
OUT=""

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
      echo ""
      echo "If --out is not provided, auto-generates versioned filename with IST timestamp."
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

# Auto-generate output path if not provided
if [ -z "$OUT" ]; then
  # Find highest existing version number (supports both old vN.json and new vN_datetime.json formats)
  LATEST_VERSION=$(ls openapi/openapi.v*.json 2>/dev/null | sed 's/.*openapi\.v\([0-9]*\).*/\1/' | sort -n | tail -1)
  NEXT_VERSION=$((${LATEST_VERSION:-0} + 1))

  # Generate IST timestamp
  IST_DATETIME=$(TZ='Asia/Kolkata' date '+%Y-%m-%d_%H-%M-IST')

  OUT="openapi/openapi.v${NEXT_VERSION}_${IST_DATETIME}.json"
fi

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


