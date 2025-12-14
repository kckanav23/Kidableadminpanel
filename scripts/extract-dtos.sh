#!/bin/bash

# Script to extract all DTOs from Spring Boot OpenAPI spec
# Usage: ./extract-dtos.sh [output-file]

API_URL="https://parent.kidable.in/api/v3/api-docs"
OUTPUT_FILE="${1:-dtos.json}"

echo "Fetching OpenAPI spec from $API_URL..."
curl -s "$API_URL" | jq '.components.schemas' > "$OUTPUT_FILE"

echo "✅ DTOs extracted to $OUTPUT_FILE"
echo ""
echo "Total DTOs found: $(jq 'length' "$OUTPUT_FILE")"
echo ""
echo "DTO Names:"
jq 'keys[]' "$OUTPUT_FILE" | sort

