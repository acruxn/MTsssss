#!/bin/bash
# Source cloud credentials from keys/ directory
# Usage: source scripts/source-creds.sh

KEYS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../keys" && pwd)"

# AWS — parse export lines from markdown
if [ -f "$KEYS_DIR/aws_access_key.md" ]; then
  eval "$(grep '^export AWS_' "$KEYS_DIR/aws_access_key.md")"
  echo "✅ AWS creds loaded (${AWS_ACCESS_KEY_ID:0:10}...)"
fi

# Alibaba — line-based format: label on one line, value on next
if [ -f "$KEYS_DIR/alibaba_access_key.md" ]; then
  export ALICLOUD_ACCESS_KEY="$(grep -A1 'AccessKey ID' "$KEYS_DIR/alibaba_access_key.md" | tail -1 | sed 's/Copy$//' | tr -d '[:space:]')"
  export ALICLOUD_SECRET_KEY="$(grep -A1 'AccessKey Secret' "$KEYS_DIR/alibaba_access_key.md" | tail -1 | sed 's/Copy$//' | tr -d '[:space:]')"
  export ALICLOUD_SECURITY_TOKEN="$(grep -A1 'SecurityToken' "$KEYS_DIR/alibaba_access_key.md" | tail -1 | sed 's/Copy$//' | tr -d '[:space:]')"
  if [ -n "$ALICLOUD_ACCESS_KEY" ]; then
    echo "✅ Alibaba creds loaded (${ALICLOUD_ACCESS_KEY:0:10}...)"
  else
    echo "⚠️  Alibaba creds file found but couldn't parse"
  fi
fi
