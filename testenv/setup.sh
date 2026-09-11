#!/usr/bin/env bash
# Bootstrap the test virtual environments.
# Idempotent: safe to re-run.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> [1/4] unit venv (no modules — node:test is built-in)"
npm install --prefix testenv/unit --no-audit --no-fund

echo "==> [2/4] integration venv"
npm install --prefix testenv/integration --no-audit --no-fund

echo "==> [3/4] e2e venv"
npm install --prefix testenv/e2e --no-audit --no-fund

echo "==> [4/4] Chromium into shared testenv/browsers sandbox"
PLAYWRIGHT_BROWSERS_PATH="$REPO_ROOT/testenv/browsers" \
  npm --prefix testenv/integration exec -- playwright install chromium

echo "==> Done. Run: npm test / npm run test:integration / npm run test:e2e"