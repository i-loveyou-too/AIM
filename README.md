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

- 현재는 mock data 기반 프론트엔드 MVP입니다.
- 루트 경로(`/`)는 `/dashboard`로 이동합니다.
