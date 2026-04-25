#!/bin/bash
# Deploy backend to AWS Lambda
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../backend"
BUILD_DIR="/tmp/formbuddy-lambda"

echo "📦 Packaging Lambda..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Install deps into build dir
pip install -r "$BACKEND_DIR/requirements.txt" -t "$BUILD_DIR" --quiet

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

echo "✅ lambda.zip created ($(du -h "$BACKEND_DIR/lambda.zip" | cut -f1))"

# Deploy if function exists
if aws lambda get-function --function-name formbuddy-backend-dev 2>/dev/null; then
    echo "🚀 Deploying to Lambda..."
    aws lambda update-function-code \
        --function-name formbuddy-backend-dev \
        --zip-file "fileb://$BACKEND_DIR/lambda.zip" \
        --region ap-southeast-1
    echo "✅ Deployed!"
else
    echo "ℹ️  Lambda function doesn't exist yet. Run 'terraform apply' first, or create manually."
fi
