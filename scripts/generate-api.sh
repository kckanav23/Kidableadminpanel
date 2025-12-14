#!/bin/bash

# Script to generate TypeScript types and API client from OpenAPI spec
# Usage: ./scripts/generate-api.sh

API_URL="https://parent.kidable.in/api/v3/api-docs"
OUTPUT_DIR="src/lib/generated"

echo "🚀 Generating API client from OpenAPI spec..."
echo "📡 Fetching spec from: $API_URL"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate API client and types
npx openapi-typescript-codegen \
  --input "$API_URL" \
  --output "$OUTPUT_DIR" \
  --client fetch \
  --useOptions \
  --exportCore true \
  --exportServices true \
  --exportModels true \
  --exportSchemas false \
  --name ApiClient

echo ""
echo "✅ API client generated successfully!"
echo "📁 Output directory: $OUTPUT_DIR"
echo ""
echo "📝 Next steps:"
echo "   1. Review generated files in $OUTPUT_DIR"
echo "   2. Update imports to use generated types"
echo "   3. Use generated API services"

