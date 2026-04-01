#!/bin/bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

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
python manage.py runserver "${DJANGO_RUNSERVER_PORT:-8000}"
