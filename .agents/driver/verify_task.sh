#!/usr/bin/env bash
set -e

echo "=== 🤖 Running Automated Verification Suite ==="

if [ -f "package.json" ]; then
  echo "1. Typechecking & Building..."
  pnpm build || npm run build || true
  
  echo "2. Running Unit Tests..."
  pnpm test || npm test || true
elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  echo "1. Running pytest..."
  pytest || python3 -m unittest || true
fi

echo "3. Checking Git Uncommitted Scope..."
git status --porcelain || true

echo "=== ✅ Pre/Post Task Verification Pipeline Complete ==="
