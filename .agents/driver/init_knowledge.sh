#!/usr/bin/env bash
set -e

echo "=== 🚀 Scrape & Initialize Codebase Skeletons ==="

DOCS_DIR="docs"
mkdir -p "$DOCS_DIR"

echo "1. Mapping Directory Structure..."
echo "# 📁 Directory Tree Map" > "$DOCS_DIR/TREE.md"
echo '```text' >> "$DOCS_DIR/TREE.md"
find src/ -maxdepth 3 -not -path '*/.*' 2>/dev/null | sort >> "$DOCS_DIR/TREE.md" || true
echo '```' >> "$DOCS_DIR/TREE.md"

echo "2. Extracting API Signatures..."
echo "# ⚡ Auto-Generated API & Type Skeleton" > "$DOCS_DIR/API_SKELETON.md"
echo '```typescript' >> "$DOCS_DIR/API_SKELETON.md"
rg -g '*.ts' -g '!*.test.ts' 'export (interface|type|function|class|const)' src/ >> "$DOCS_DIR/API_SKELETON.md" 2>/dev/null || true
echo '```' >> "$DOCS_DIR/API_SKELETON.md"

echo "=== ✅ Knowledge Skeletons Updated in /docs/ ==="
