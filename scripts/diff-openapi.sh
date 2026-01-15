#!/bin/bash

set -euo pipefail

# Usage:
#   ./scripts/diff-openapi.sh [--before <path>] [--after <path>]
#
# Defaults:
#   Automatically detects the two most recent snapshots in openapi/ folder
#   and compares second-latest (before) vs latest (after)

BEFORE=""
AFTER=""

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
      echo ""
      echo "If not provided, auto-detects the two most recent snapshots."
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

# Auto-detect snapshots if not provided
if [ -z "$BEFORE" ] || [ -z "$AFTER" ]; then
  # Find the two most recent versioned snapshots (by modification time)
  SNAPSHOTS=($(ls -t openapi/openapi.v*.json 2>/dev/null | head -2))

  if [ ${#SNAPSHOTS[@]} -lt 2 ]; then
    echo "❌ Error: Need at least 2 snapshots to compare."
    echo "   Found: ${#SNAPSHOTS[@]} snapshot(s) in openapi/"
    echo "   Run 'npm run api:snapshot' to create snapshots."
    exit 1
  fi

  # Latest (most recent) is AFTER, second-latest is BEFORE
  [ -z "$AFTER" ] && AFTER="${SNAPSHOTS[0]}"
  [ -z "$BEFORE" ] && BEFORE="${SNAPSHOTS[1]}"
fi

echo "🔎 Diffing OpenAPI specs"
echo "   before: $BEFORE"
echo "   after:  $AFTER"
echo ""

node ./scripts/diff-openapi.js --before "$BEFORE" --after "$AFTER"


