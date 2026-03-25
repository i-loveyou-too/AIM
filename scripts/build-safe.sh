#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="$ROOT/.tooling/node/bin"

if [ -x "$NODE_BIN/node" ]; then
  export PATH="$NODE_BIN:$PATH"
fi

# 이전 빌드 산출물이 꼬였을 때를 대비해 생산 빌드도 항상 깨끗하게 시작합니다.
rm -rf "$ROOT/.next"

if [ -x "$NODE_BIN/npm" ]; then
  exec "$NODE_BIN/npm" run build
fi

exec npm run build
