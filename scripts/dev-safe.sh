#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="$ROOT/.tooling/node/bin"

# 로컬 환경변수 로드 (.env.local 우선, 없으면 .env)
ENV_FILE=""
if [ -f "$ROOT/.env.local" ]; then
  ENV_FILE="$ROOT/.env.local"
elif [ -f "$ROOT/.env" ]; then
  ENV_FILE="$ROOT/.env"
fi

if [ -n "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [ -x "$NODE_BIN/node" ]; then
  export PATH="$NODE_BIN:$PATH"
  exec "$NODE_BIN/node" "$ROOT/scripts/dev-safe.mjs"
fi

exec node "$ROOT/scripts/dev-safe.mjs"
