#!/bin/bash

set -euo pipefail

# Usage:
#   ./scripts/diff-openapi.sh --before openapi/openapi.before.json --after openapi/openapi.after.json
#
# Defaults:
#   before: openapi/openapi.before.json
#   after:  openapi/openapi.after.json

BEFORE="openapi/openapi.v6.json"
AFTER="openapi/openapi.v7.json"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --before)
      BEFORE="$2"
      shift 2
      ;;
    --after)
      AFTER="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--before <path>] [--after <path>]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

echo "🔎 Diffing OpenAPI specs"
echo "   before: $BEFORE"
echo "   after:  $AFTER"
echo ""

node ./scripts/diff-openapi.js --before "$BEFORE" --after "$AFTER"


