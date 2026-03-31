#!/bin/bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

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
python manage.py runserver 8000
