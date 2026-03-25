# Aim ON

에임 온 교사용 대시보드 MVP입니다.

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## 현재 구현 범위

- 교사용 대시보드 홈 화면
- 계획 / 커리큘럼 화면
- 전체 학생 리스트 화면
- 학생 상세 화면
- 공통 레이아웃
- 사이드바
- 상단 헤더
- 요약 카드
- 오늘 일정
- 최근 학생 활동
- 빠른 실행
- 시험일 임박 학생 하이라이트

## 구조 요약

| 영역 | 핵심 파일 | 역할 |
| --- | --- | --- |
| `src/app` | `layout.tsx`, `page.tsx`, `dashboard/page.tsx`, `dashboard/curriculum/page.tsx`, `dashboard/students/page.tsx`, `dashboard/students/[id]/page.tsx` | 공통 레이아웃과 대시보드 / 계획 / 학생 페이지 라우트 |
| `src/components/layout` | `sidebar.tsx`, `header.tsx`, `app-header.tsx` | 전체 화면의 공통 상단 / 좌측 레이아웃 |
| `src/components/dashboard` | `summary-card.tsx`, `today-schedule.tsx`, `recent-activity.tsx`, `quick-actions.tsx`, `insight-panel.tsx`, `exam-alert.tsx` | 대시보드 홈 전용 카드와 영역 |
| `src/components/curriculum` | `curriculum-*.tsx` | 계획 / 커리큘럼 화면 전용 카드와 섹션 |
| `src/components/students` | `student-overview.tsx`, `student-filters.tsx`, `student-table.tsx`, `student-directory.tsx`, `student-detail-*.tsx` | 학생 관리와 학생 상세 전용 UI |
| `src/lib/mock-data` | `core.ts`, `dashboard.ts`, `students.ts`, `today-lessons.ts`, `student-report-mock-data.ts`, `index.ts` | 공통 mock data 재수출과 페이지별 mock data |
| `src/lib` | `curriculum-mock-data.ts`, `student-detail-mock-data.ts` | 페이지 계산용 상세 mock data |
| `src/lib/student-detail-mock-data.ts` | 학생 상세 생성 로직 | 학생 상세용 계산과 조합 데이터 |
| `public` | `aim-on-logo.png` | 브랜드 로고 자산 |

## 구조 문서

- [`docs/FILE_STRUCTURE.md`](/Users/kyunglim/에임%20온/docs/FILE_STRUCTURE.md)
- [`docs/aim_on_dev_note.md`](/Users/kyunglim/에임%20온/docs/aim_on_dev_note.md)
- [`docs/MOCK_DATA.md`](/Users/kyunglim/에임%20온/docs/MOCK_DATA.md)
- [`docs/DASHBOARD_DATA.md`](/Users/kyunglim/에임%20온/docs/DASHBOARD_DATA.md)

이 파일들에 구조, 개발 기록, mock data 설명을 나눠서 적어두고 있습니다.

## 로컬 실행 방법

1. Node.js LTS를 설치합니다.
2. 프로젝트 루트에서 의존성을 설치합니다.

```bash
npm install
```

3. 안정 실행 스크립트로 개발 서버를 실행합니다. 기본은 `3007`부터 시작하고, 실패하면 다음 포트로 자동 재시도합니다.

```bash
bash scripts/dev-safe.sh
```

4. 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000
```

## 참고

- 현재는 백엔드가 없습니다.
- 로그인 페이지는 아직 만들지 않았습니다.
- 학생 관리 리스트와 학생 상세 페이지가 먼저 구현되어 있습니다.
- 루트 경로는 `/dashboard`로 자동 이동합니다.
- 개발 서버가 꼬이면 먼저 `bash scripts/dev-safe.sh`를 쓰면 `.next` 캐시와 기존 dev 서버를 함께 정리합니다.
