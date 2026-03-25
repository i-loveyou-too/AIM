#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="$ROOT/.tooling/node/bin"

if [ -x "$NODE_BIN/node" ]; then
  export PATH="$NODE_BIN:$PATH"
  exec "$NODE_BIN/node" "$ROOT/scripts/dev-safe.mjs"
fi

exec node "$ROOT/scripts/dev-safe.mjs"
