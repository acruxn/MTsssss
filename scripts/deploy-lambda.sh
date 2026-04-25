#!/bin/bash
# Deploy backend to AWS Lambda via S3 upload
# Direct zip upload fails for packages >50MB (connection closes)
set -e

FUNCTION_NAME="finhack-backend-dev"
S3_BUCKET="finhack-frontend-dev"
S3_KEY="lambda.zip"
REGION="ap-southeast-1"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../backend"
BUILD_DIR="/tmp/formbuddy-lambda"

echo "📦 Packaging Lambda..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Install deps into build dir (targeting Lambda's Linux x86_64)
pip install -r "$BACKEND_DIR/requirements.txt" -t "$BUILD_DIR" --quiet \
    --platform manylinux2014_x86_64 --only-binary=:all: --implementation cp --python-version 3.12

# Copy app code
cp -r "$BACKEND_DIR"/*.py "$BUILD_DIR/" 2>/dev/null || true
cp -r "$BACKEND_DIR/core" "$BUILD_DIR/"
cp -r "$BACKEND_DIR/models" "$BUILD_DIR/"
cp -r "$BACKEND_DIR/schemas" "$BUILD_DIR/"
cp -r "$BACKEND_DIR/api" "$BUILD_DIR/"
cp -r "$BACKEND_DIR/services" "$BUILD_DIR/"

# Zip
cd "$BUILD_DIR"
zip -r "$BACKEND_DIR/lambda.zip" . -q

SIZE=$(du -h "$BACKEND_DIR/lambda.zip" | cut -f1)
echo "✅ lambda.zip created ($SIZE)"

# Deploy via S3 (primary — required for packages >50MB)
echo "🚀 Uploading to S3..."
aws s3 cp "$BACKEND_DIR/lambda.zip" "s3://$S3_BUCKET/$S3_KEY" --region "$REGION"

echo "🚀 Updating Lambda..."
aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --s3-bucket "$S3_BUCKET" \
    --s3-key "$S3_KEY" \
    --region "$REGION"

echo "✅ Deployed $FUNCTION_NAME ($SIZE via S3)"
