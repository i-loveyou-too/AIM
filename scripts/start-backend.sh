#!/bin/bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

PORT="${DJANGO_RUNSERVER_PORT:-8000}"

# 로컬 환경변수 로드 (.env.local 우선, 없으면 .env)
ENV_FILE=""
if [ -f ".env.local" ]; then
  ENV_FILE=".env.local"
elif [ -f ".env" ]; then
  ENV_FILE=".env"
fi

if [ -n "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# 가상환경 활성화
if [ -d ".venv" ]; then
  source .venv/bin/activate
elif [ -d "venv" ]; then
  source venv/bin/activate
else
  echo "가상환경을 찾을 수 없습니다. (.venv 또는 venv)"
  exit 1
fi

cd backend

# 이미 같은 포트를 점유 중인 이전 runserver 프로세스가 있으면 정리
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -tiTCP:"$PORT" -sTCP:LISTEN || true)
  if [ -n "$PIDS" ]; then
    echo "Port $PORT already in use. Cleaning stale process(es): $PIDS"
    kill $PIDS >/dev/null 2>&1 || true
    sleep 1

    # 종료되지 않은 PID는 강제 종료
    REMAINING=$(lsof -tiTCP:"$PORT" -sTCP:LISTEN || true)
    if [ -n "$REMAINING" ]; then
      kill -9 $REMAINING >/dev/null 2>&1 || true
      sleep 0.5
    fi
  fi
fi

echo "Starting Django on 127.0.0.1:$PORT"
python manage.py runserver "$PORT"
