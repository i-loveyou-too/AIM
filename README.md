# Aim ON

에임 온 교사용 대시보드 MVP입니다.

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS

## 현재 구현 범위

- 교사용 대시보드 홈 화면
- 오늘 수업 운영 화면
- 과제 관리 화면
- 계획 / 커리큘럼 화면
- 리포트 허브 화면
- 설정 화면
- 전체 학생 리스트 화면
- 학생 상세 화면
- 학생 리포트 화면

## 구조 요약

| 영역 | 핵심 파일 | 역할 |
| --- | --- | --- |
| `src/app` | `layout.tsx`, `page.tsx`, `dashboard/*/page.tsx` | 공통 레이아웃과 각 대시보드 라우트 |
| `src/components/layout` | `sidebar.tsx`, `app-header.tsx` | 공통 상단/사이드바 레이아웃 |
| `src/components/dashboard` | `summary-card.tsx`, `today-schedule.tsx`, `insight-panel.tsx`, `exam-alert.tsx` | 대시보드 홈 UI |
| `src/components/today-lessons` | `today-schedule-section.tsx`, `lesson-prep-card.tsx`, `materials-panel.tsx` | 오늘 수업 운영 UI |
| `src/components/assignments` | `assignment-summary-cards.tsx`, `assignment-view-tabs.tsx`, `class-assignment-board.tsx` | 과제 관리 UI |
| `src/components/curriculum` | `curriculum-*.tsx` | 계획 / 커리큘럼 화면 전용 카드와 섹션 |
| `src/components/reports` | `report-hub-*.tsx`, `student-report-hub.tsx`, `exam-readiness-hub.tsx` | 리포트 허브 UI |
| `src/components/settings` | `*-settings.tsx` | 설정 화면 UI |
| `src/components/students` | `student-overview.tsx`, `student-filters.tsx`, `student-table.tsx`, `student-directory.tsx`, `student-detail-*.tsx` | 학생 관리와 학생 상세 전용 UI |
| `src/lib/mock-data` | `core.ts`, `dashboard.ts`, `students.ts`, `today-lessons.ts`, `report-hub-mock-data.ts`, `settings-mock-data.ts` | 페이지별 mock data |
| `src/lib` | `curriculum-mock-data.ts`, `student-detail-mock-data.ts` | 계산/조합 데이터 |
| `database` | `01_create_schema.sql` ~ `07_views_and_queries.sql` | DB 설계/시드/조회 예시 SQL |
| `public` | `aim-on-logo.png` | 브랜드 로고 자산 |

## 구조 문서

- [`docs/FILE_STRUCTURE.md`](docs/FILE_STRUCTURE.md)
- [`docs/aim_on_dev_note.md`](docs/aim_on_dev_note.md)
- [`docs/MOCK_DATA.md`](docs/MOCK_DATA.md)
- [`docs/DASHBOARD_DATA.md`](docs/DASHBOARD_DATA.md)

이 파일들에 구조, 개발 기록, mock data 설명을 나눠서 적어두고 있습니다.

## 로컬 실행 방법

### 0) 환경변수 파일 준비

`.env.example`를 복사해 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

DB는 메인 개발 DB와 테스트 DB를 반드시 분리해서 설정합니다.

- 메인 개발 DB: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- 테스트 DB: `TEST_DB_NAME`, `TEST_DB_USER`, `TEST_DB_PASSWORD`, `TEST_DB_HOST`, `TEST_DB_PORT`

주의: `TEST_DB_NAME`은 `DB_NAME`과 같으면 안 됩니다.

1. Node.js LTS 환경을 준비합니다.
2. 프로젝트 루트에서 의존성을 설치합니다.

```bash
npm install
```

3. 개발 서버를 실행합니다.

```bash
npm run dev:safe
```

`dev-safe`는 `.next`를 정리하고 `3007`부터 순차 포트로 실행합니다.

4. 브라우저에서 서버 로그에 표시된 주소를 엽니다. (기본 `127.0.0.1:3007`)

```text
http://127.0.0.1:3007
```

## 스크립트

- `npm run dev`: Next.js 기본 개발 서버
- `npm run dev:safe`: 캐시/포트 충돌 정리 후 안전 실행
- `npm run build`: 프로덕션 빌드
- `npm run build:safe`: `.next` 정리 후 클린 빌드
- `npm run start`: 빌드 결과 실행

## 기본 라우트

- `/dashboard`
- `/dashboard/today-lessons`
- `/dashboard/assignments`
- `/dashboard/curriculum`
- `/dashboard/reports`
- `/dashboard/settings`
- `/dashboard/students`
- `/dashboard/students/[id]`
- `/dashboard/students/[id]/report`

## 참고

- Django 설정은 `.env.local`/`.env`를 자동 로드합니다.
- 테스트 실행 시 Django는 `DATABASES.default.TEST` 설정(`TEST_DB_*`)을 사용합니다.
- 기존 `DJANGO_DB_*` 키는 호환용으로만 남아 있으며, 신규 설정은 `DB_*` 사용을 권장합니다.
- 루트 경로(`/`)는 `/dashboard`로 이동합니다.

## 백엔드 명령어

```bash
# 마이그레이션 적용 (메인 DB)
python backend/manage.py migrate

# 테스트 실행 (테스트 DB)
python backend/manage.py test
```
