# Aim ON 파일 구조 정리

이 문서는 Aim ON 프론트엔드 코드의 현재 구조와 각 파일의 역할을 빠르게 확인하기 위한 기준 문서입니다.

## 정리 원칙

- 파일은 기능 기준으로 나눈다.
- 페이지가 다르면 파일도 분리한다.
- 공통 레이아웃과 페이지 전용 코드는 섞지 않는다.
- mock data는 기능별로 분리한다.
- 작업할 때마다 중요한 변경과 이유를 이 문서에 남긴다.
- 코드 안에서는 역할이 보이도록 짧은 주석을 남긴다.
- 개발 중에는 Next dev 서버를 하나만 유지한다.
- 서버 에러가 나면 `.next` 캐시와 기존 dev 서버 상태를 먼저 확인한다.
- dev 서버를 다시 띄울 때는 `.next`를 먼저 비우고 새로 시작한다.
- 작업 시작 전에는 라우트 / 에러부터 먼저 정리하고, 없는 페이지 이동 / 콘솔 에러 / 빌드 에러 / import 에러를 먼저 없앤다.
- 라우트나 파일을 바꾼 뒤에는 바로 실제 화면으로 확인한다.

## 한눈에 보기

| 영역 | 대표 파일 | 역할 |
| --- | --- | --- |
| 루트 설정 | `README.md`, `package.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `next-env.d.ts` | 프로젝트 기본 안내와 실행 / 설정 파일 |
| 문서 | `docs/FILE_STRUCTURE.md`, `docs/aim_on_dev_note.md`, `docs/MOCK_DATA.md`, `docs/DASHBOARD_DATA.md`, `docs/PROJECT_CHECKLIST.md`, `docs/deployment-plan.md`, `docs/api-contract.yaml` | 구조 정리, 개발 노트, mock data 설명, MVP 체크리스트, 배포 계획, API 계약 |
| DB 스키마 | `database/01_create_schema.sql` ~ `database/07_views_and_queries.sql` | PostgreSQL 스키마, seed 데이터, VIEW 정의 |
| 백엔드 | `backend/manage.py`, `backend/config/*`, `backend/teacher_api/*`, `backend/student_api/*` | Django raw SQL 기반 교사용 및 학생용 Stub API |
| 실행 스크립트 | `scripts/dev-safe.sh`, `scripts/dev-safe.mjs`, `scripts/build-safe.sh` | stale cache와 중복 dev 서버를 정리하고 `.next`를 비운 뒤 시작하는 안전 실행 명령 |
| 정적 자산 | `public/aim-on-logo.png` | Aim ON 브랜드 로고 |
| 앱 라우트 | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/dashboard/curriculum/page.tsx`, `src/app/dashboard/students/page.tsx`, `src/app/dashboard/students/[id]/page.tsx`, `src/app/dashboard/students/[id]/report/page.tsx`, `src/app/dashboard/today-lessons/page.tsx` | 공통 레이아웃과 화면 라우트 |
| 레이아웃 컴포넌트 | `src/components/layout/*` | 사이드바와 상단 헤더 |
| 대시보드 컴포넌트 | `src/components/dashboard/*` | 대시보드 홈 전용 카드와 섹션 |
| 커리큘럼 컴포넌트 | `src/components/curriculum/*` | 계획 / 커리큘럼 페이지 전용 카드와 섹션 |
| 학생 컴포넌트 | `src/components/students/*` | 학생 관리와 학생 상세 전용 UI |
| 오늘 수업 컴포넌트 | `src/components/today-lessons/*` | 오늘 수업 운영 페이지 전용 섹션 |
| 리포트 컴포넌트 | `src/components/reports/*` | 학생 리포트 페이지 전용 차트와 섹션 |
| mock data | `src/lib/mock-data/*`, `src/lib/curriculum-mock-data.ts`, `src/lib/student-detail-mock-data.ts` | 화면별 더미 데이터와 생성 로직 |

## 현재 폴더 구조

```text
project/
  README.md
  package.json
  package-lock.json
  next.config.mjs
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
  next-env.d.ts
  docs/
    FILE_STRUCTURE.md
    aim_on_dev_note.md
    MOCK_DATA.md
    DASHBOARD_DATA.md
    PROJECT_CHECKLIST.md
    deployment-plan.md
    api-contract.yaml
  database/
    01_create_schema.sql
    02_seed_reference.sql
    03_seed_students.sql
    04_seed_academics.sql
    05_seed_assignments.sql
    06_seed_issues.sql
    07_views_and_queries.sql
  backend/
    manage.py
    requirements.txt
    config/
      settings.py
      urls.py
      asgi.py
      wsgi.py
    teacher_api/
      views.py
      urls.py
      apps.py
    student_api/
      views.py
      urls.py
      apps.py
  scripts/
    dev-safe.sh
    dev-safe.mjs
    build-safe.sh
  public/
    aim-on-logo.png
  src/
    app/
      layout.tsx
      globals.css
      page.tsx
      dashboard/
        page.tsx
        assignments/
          page.tsx
        classes/
          page.tsx
          [id]/
            page.tsx
        curriculum/
          page.tsx
        reports/
          page.tsx
        settings/
          page.tsx
        today-lessons/
          page.tsx
        students/
          page.tsx
          [id]/
            page.tsx
            report/
              page.tsx
    components/
      layout/
        sidebar.tsx
        header.tsx
        app-header.tsx
      dashboard/
        summary-card.tsx
        today-schedule.tsx
        recent-activity.tsx
        quick-actions.tsx
        insight-panel.tsx
        exam-alert.tsx
      curriculum/
        curriculum-page-header.tsx
        curriculum-summary-cards.tsx
        curriculum-reverse-plan-section.tsx
        curriculum-exam-calendar.tsx
        curriculum-plan-vs-actual-section.tsx
        curriculum-roadmap-board.tsx
        curriculum-next-actions.tsx
        curriculum-risk-section.tsx
        curriculum-planning-notes-section.tsx
      students/
        student-overview.tsx
        student-filters.tsx
        student-table.tsx
        student-directory.tsx
        student-detail-header.tsx
        student-status-cards.tsx
        student-progress-section.tsx
        student-ai-insight-section.tsx
        student-exam-section.tsx
        student-assignment-section.tsx
        student-assignment-insight-section.tsx
        student-weakness-section.tsx
        student-feedback-section.tsx
        student-next-actions.tsx
      today-lessons/
        today-schedule-section.tsx
        lesson-prep-card.tsx
        weakness-overview-section.tsx
        homework-reflection-section.tsx
        materials-panel.tsx
        next-actions-section.tsx
      reports/
        report-summary-cards.tsx
        achievement-trend-chart.tsx
        homework-trend-chart.tsx
        progress-vs-plan-chart.tsx
        weakness-analysis-section.tsx
        exam-readiness-section.tsx
        teacher-report-comment.tsx
        next-direction-section.tsx
    lib/
      api/
        teacher.ts
      curriculum-mock-data.ts
      student-detail-mock-data.ts
      mock-data/
        index.ts
        core.ts
        dashboard.ts
        today-lessons.ts
        students.ts
        student-report-mock-data.ts
        report-hub-mock-data.ts
        assignment-mock-data.ts
        issue-mock-data.ts
        settings-mock-data.ts
    types/
      teacher.ts
```

## 파일 역할

### 프로젝트 루트

- `README.md`: 프로젝트 개요, 실행 방법, 현재 구조 요약
- `package.json`: 프로젝트 의존성과 실행 스크립트
- `package-lock.json`: npm 의존성 고정 파일
- `next.config.mjs`: Next.js 설정
- `postcss.config.mjs`: PostCSS 설정
- `tailwind.config.ts`: Tailwind 토큰과 theme 확장 설정
- `tsconfig.json`: TypeScript 설정
- `next-env.d.ts`: Next.js 타입 선언 보조 파일

### `docs`

- `docs/FILE_STRUCTURE.md`: 현재 파일 구조와 역할, 작업 기록을 관리하는 문서
- `docs/aim_on_dev_note.md`: 개발 대원칙, 의사결정 기록, 작업 로그를 모아두는 메인 노트
- `docs/MOCK_DATA.md`: mock data 전체 구조와 타입 기준을 표로 정리한 문서
- `docs/DASHBOARD_DATA.md`: dashboard.ts 안의 항목을 전부 풀어쓴 상세 문서
- `docs/PROJECT_CHECKLIST.md`: MVP 범위 기준 19개 섹션 체크리스트. 현재 진행 상태 추적용
- `docs/deployment-plan.md`: Vercel + Neon 배포 8단계 체크리스트와 파일럿 운영 계획
- `docs/api-contract.yaml`: 교사용 조회 API 5개 엔드포인트 OpenAPI 3.0 계약 문서

### `database`

- `01_create_schema.sql`: ENUM, 34개 테이블, 인덱스, 코멘트 정의. `class_name` GENERATED ALWAYS AS STORED 컬럼 포함
- `02_seed_reference.sql`: 교사 3명, 학교 10개, 반 그룹 21개 기준 데이터
- `03_seed_students.sql`: 학생 125명, 수강 등록, 프로필, 목표 데이터
- `04_seed_academics.sql`: 시험, 취약 단원, 피드백, 성취 추이, 수업 일정, 커리큘럼 데이터
- `05_seed_assignments.sql`: 과제 15개, 제출 현황, OMR/OCR, 오답 분석, 수업 성찰 데이터
- `06_seed_issues.sql`: 이슈 22개, JSONB 형태의 타입별 상세 데이터
- `07_views_and_queries.sql`: 11개 PostgreSQL VIEW 정의 (각 프론트 탭에 1:1 대응)

### `backend`

- `backend/manage.py`: Django 관리 진입점
- `backend/requirements.txt`: Django, psycopg2 등 의존성 목록
- `backend/config/settings.py`: DB 연결(Neon PostgreSQL), CORS, 앱 설정
- `backend/config/urls.py`: teacher_api 라우트 연결
- `backend/teacher_api/views.py`: raw SQL + VIEW 기반 교사용 조회 API 뷰 5개
- `backend/teacher_api/urls.py`: `/api/teacher/*` 라우트 5개 정의

### `scripts`

- `scripts/dev-safe.sh`: `dev-safe.mjs`를 호출하는 얇은 실행 래퍼
- `scripts/dev-safe.mjs`: 실행할 때마다 `.next`를 먼저 지우고, 중복 dev 서버를 정리한 뒤 안전하게 개발 서버를 띄우는 핵심 스크립트. 기본 `3007`부터 시작하고, 실패하면 다음 포트로 자동 재시도함
- `scripts/build-safe.sh`: `.next` 캐시를 지운 뒤 깨끗한 상태에서 production build를 다시 돌리는 스크립트

### `public`

- `public/aim-on-logo.png`: 사이드바와 브랜드 영역에서 쓰는 Aim ON 로고

### `src/app`

- `src/app/layout.tsx`: 전체 페이지를 감싸는 공통 레이아웃
- `src/app/globals.css`: 전역 스타일, 색상 토큰, 폰트 설정
- `src/app/page.tsx`: 루트 진입점, 현재는 대시보드로 이동
- `src/app/dashboard/page.tsx`: 교사용 대시보드 홈 화면
- `src/app/dashboard/assignments/page.tsx`: 과제 관리 페이지
- `src/app/dashboard/classes/page.tsx`: 반 목록 페이지
- `src/app/dashboard/classes/[id]/page.tsx`: 반 상세 페이지
- `src/app/dashboard/curriculum/page.tsx`: 시험일 역산 기반 계획 / 커리큘럼 화면
- `src/app/dashboard/reports/page.tsx`: 리포트 허브 페이지
- `src/app/dashboard/settings/page.tsx`: 설정 페이지
- `src/app/dashboard/today-lessons/page.tsx`: 오늘 수업 운영 페이지
- `src/app/dashboard/students/page.tsx`: 학생 관리 페이지
- `src/app/dashboard/students/[id]/page.tsx`: 학생 상세 페이지 (현재 상태·운영 중심)
- `src/app/dashboard/students/[id]/report/page.tsx`: 학생 리포트 페이지 (추이·분석 중심)

### `src/components/layout`

- `sidebar.tsx`: 좌측 사이드바 메뉴와 브랜드 영역
- `header.tsx`: 대시보드 공통 헤더
- `app-header.tsx`: 경로에 따라 헤더를 분기하는 상단 바. 대시보드 / 커리큘럼 / 학생 목록 / 학생 상세 / 리포트 / 오늘 수업 운영 각각 전용 헤더로 분기

### `src/components/dashboard`

- `summary-card.tsx`: 대시보드 상단 요약 카드
- `today-schedule.tsx`: 오늘 수업 일정 섹션
- `recent-activity.tsx`: 최근 학생 활동 알림
- `quick-actions.tsx`: 빠른 실행 카드
- `insight-panel.tsx`: 반별 인사이트 / 학생 인사이트 영역
- `exam-alert.tsx`: 학교 선택형 시험 알림 카드

### `src/components/curriculum`

- `curriculum-page-header.tsx`: 계획 / 커리큘럼 페이지 상단 소개와 CTA
- `curriculum-summary-cards.tsx`: 시험일, 남은 수업 수, 진도율, 위험 상태 요약 카드
- `curriculum-reverse-plan-section.tsx`: 시험일 역산 계획 요약 섹션
- `curriculum-exam-calendar.tsx`: 시험일까지의 흐름을 보여주는 캘린더 섹션
- `curriculum-plan-vs-actual-section.tsx`: 계획 대비 실제 진도 비교 섹션
- `curriculum-roadmap-board.tsx`: 대단원 / 중단원 / 세부 항목 로드맵 보드
- `curriculum-next-actions.tsx`: 다음 수업 액션과 수업 전 점검 섹션
- `curriculum-risk-section.tsx`: 지연 위험 / 시험 위험 섹션
- `curriculum-planning-notes-section.tsx`: 계획 조정과 운영 메모 섹션

### `src/components/students`

- `student-overview.tsx`: 학생 관리 상단 요약 카드 (클릭 시 빠른 필터 연결)
- `student-filters.tsx`: 학교 / 반 / 학년 / 과목 / 상태 / 정렬 필터 (반 필터 추가됨)
- `student-table.tsx`: 학생 표형 리스트와 페이지네이션. 각 학생 row에 "상세 보기" / "리포트 보기" 버튼 분리
- `student-directory.tsx`: 학생 목록의 상태, 필터, 정렬, 페이지 계산을 총괄. 반 필터 옵션을 학교 선택에 따라 동적으로 계산
- `student-detail-header.tsx`: 학생 상세 상단 요약과 빠른 액션
- `student-status-cards.tsx`: 학생 상세 핵심 상태 카드
- `student-progress-section.tsx`: 최근 진도, 학습 흐름, 해야 할 일 접기/펼치기 섹션
- `student-ai-insight-section.tsx`: AI 학습 진도 리포트와 취약 유형 분석 섹션
- `student-exam-section.tsx`: 시험일과 역산 계획 섹션
- `student-assignment-section.tsx`: 과제 관리 상태 섹션
- `student-assignment-insight-section.tsx`: 최근 과제 현황, 관찰 노트, 다음 액션 블록
- `student-weakness-section.tsx`: 취약 단원과 위험 요소 섹션
- `student-feedback-section.tsx`: 선생님 피드백 노트 섹션
- `student-next-actions.tsx`: 다음 액션과 최근 활동 흐름 섹션

### `src/components/today-lessons`

오늘 수업 운영 페이지 전용 컴포넌트입니다.

- `today-schedule-section.tsx`: 오늘 수업 일정 리스트. 각 row 클릭 시 준비 카드로 앵커 이동. 상태 뱃지는 채우기 pill 스타일
- `lesson-prep-card.tsx`: 수업별 상세 준비 카드. 기본 열림 상태, 접기/펼치기 토글. 진도·설명·자료·약점·숙제·메모 6개 블록 (Client Component)
- `weakness-overview-section.tsx`: 약점 집중 관리 학생 개요
- `homework-reflection-section.tsx`: 숙제 반영 이슈 요약
- `materials-panel.tsx`: 오늘 자료 준비 패널. 항목별 "준비 완료/준비 필요" 토글 (Client Component)
- `next-actions-section.tsx`: 수업별 탭으로 분리된 다음 액션 플랜. 수업 전/중/후/다음수업 준비 4개 영역 (Client Component)

### `src/components/reports`

학생 리포트 페이지 전용 컴포넌트입니다. 학생 상세와 달리 추이·분석·변화 흐름 중심입니다.

- `report-summary-cards.tsx`: 6개 KPI 요약 카드 (성취도, 진도율, 숙제율, 취약단원, 시험준비도, 계획안정성)
- `achievement-trend-chart.tsx`: 최근 8회차 성취도 SVG 라인 차트 (외부 라이브러리 없음)
- `homework-trend-chart.tsx`: 최근 4주 숙제 수행률 CSS 바 차트
- `progress-vs-plan-chart.tsx`: 계획 대비 실제 진도 비교 바 + 주간 breakdown
- `weakness-analysis-section.tsx`: 반복 오답 취약 단원 빈도 바 + 실수 패턴 목록
- `exam-readiness-section.tsx`: D-day 카운트다운, 준비도 게이지, 준비 체크리스트
- `teacher-report-comment.tsx`: 강점 / 우려사항 / 최근 변화 / 다음 집중 방향 4블록
- `next-direction-section.tsx`: 우선순위 배너, 보강 항목, 숙제 방향, 설명 집중 포인트

### `src/lib/api`

- `teacher.ts`: Django 백엔드 교사용 API 호출 함수 모음. fetch wrapper + 에러 처리

### `src/types`

- `teacher.ts`: API 응답 타입 정의 (StudentListItem, StudentDetailItem, ClassListItem, TodayLessonItem 등)

### `src/lib/mock-data`

- `index.ts`: mock data 재수출 진입점
- `core.ts`: 교사용 기본 정보, 사이드바 메뉴, 공통 문구
- `dashboard.ts`: 대시보드 관련 mock data
- `today-lessons.ts`: 오늘 수업 운영 페이지 관련 mock data (일정, 준비카드, 약점, 숙제, 자료, 수업별 액션)
- `curriculum-mock-data.ts`: 계획 / 커리큘럼 페이지 관련 mock data (역산 계획, 캘린더, 비교, 로드맵, 위험, 메모)
- `students.ts`: 학생 리스트 관련 mock data
- `student-detail-mock-data.ts`: 학생 상세 페이지용 mock data와 생성 로직 (현재 상태·운영 중심)
- `student-report-mock-data.ts`: 학생 리포트 페이지용 mock data (추이·분석·변화 흐름 중심)
- `report-hub-mock-data.ts`: 리포트 허브 페이지용 mock data
- `assignment-mock-data.ts`: 과제 관리 페이지용 mock data
- `issue-mock-data.ts`: 이슈 관리 관련 mock data
- `settings-mock-data.ts`: 설정 페이지용 mock data

## 작업 기록

> 형식: 날짜 / 작업 내용 / 수정 파일 / 결과 / 다음 할 일

#### 2026-03-24

- 작업 내용: `계획 / 커리큘럼` 페이지를 새로 만들고, 역산 계획 / 달력 / 계획 대비 실제 비교 / 로드맵 / 다음 액션 / 위험 / 메모 섹션으로 나눠 정리함
- 수정 파일: `src/app/dashboard/curriculum/page.tsx`, `src/components/curriculum/*`, `src/lib/curriculum-mock-data.ts`, `src/components/layout/app-header.tsx`, `src/lib/mock-data/core.ts`, `README.md`, `docs/FILE_STRUCTURE.md`, `docs/MOCK_DATA.md`, `docs/aim_on_dev_note.md`
- 결과: 시험일까지의 흐름을 통제하는 운영 화면이 생겼고, 사이드바에서도 바로 진입할 수 있게 됨
- 다음 할 일: 필요하면 학생 상세와 용어를 더 맞추고, 커리큘럼 데이터 문구를 운영 기준에 맞춰 세분화하기

#### 2026-03-24

- 작업 내용: mock data 구조를 따로 문서화하고, 대시보드 데이터 항목을 표로 전부 정리한 문서를 추가함
- 수정 파일: `docs/MOCK_DATA.md`, `docs/DASHBOARD_DATA.md`, `README.md`, `docs/FILE_STRUCTURE.md`, `docs/aim_on_dev_note.md`
- 결과: mock data를 찾을 때 구조 문서와 상세 문서를 분리해서 볼 수 있게 됨
- 다음 할 일: 학생 상세 데이터도 필요하면 별도 문서로 더 나눌 수 있음

#### 2026-03-24

- 작업 내용: 파일 구조 정리 문서를 새로 만들고, 역할별로 현재 구조를 기록함
- 수정 파일: `docs/FILE_STRUCTURE.md`, `README.md`, `docs/aim_on_dev_note.md`
- 결과: 각 파일이 무엇을 담당하는지 한눈에 확인할 수 있게 됨
- 다음 할 일: 앞으로 구조 변경이 생기면 이 문서부터 같이 갱신하기

#### 2026-03-24

- 작업 내용: 학생 관리 페이지를 표형 리스트와 상세 필터 구조로 정리함
- 수정 파일: `src/components/students/student-directory.tsx`, `src/components/students/student-overview.tsx`, `src/components/students/student-filters.tsx`, `src/components/students/student-table.tsx`, `src/lib/mock-data/students.ts`
- 결과: 학생 목록을 학교 / 학년 / 과목 / 상태별로 좁혀 보고, 페이지네이션까지 확인할 수 있게 됨
- 다음 할 일: 학생 상세 페이지로 이어질 때 이 구조를 유지하기

#### 2026-03-24

- 작업 내용: 학생 관리에서 학생 이름과 첫 번째 액션을 학생 상세 페이지로 연결하고, 학생 상세 페이지와 전용 섹션 컴포넌트를 추가함
- 수정 파일: `src/app/dashboard/students/[id]/page.tsx`, `src/components/students/student-detail-header.tsx`, `src/components/students/student-status-cards.tsx`, `src/components/students/student-progress-section.tsx`, `src/components/students/student-exam-section.tsx`, `src/components/students/student-assignment-section.tsx`, `src/components/students/student-weakness-section.tsx`, `src/components/students/student-feedback-section.tsx`, `src/components/students/student-next-actions.tsx`, `src/lib/student-detail-mock-data.ts`, `src/components/students/student-table.tsx`, `src/components/layout/app-header.tsx`, `README.md`
- 결과: 학생 리스트에서 개별 학생 상세로 자연스럽게 이동하고, 한 학생의 진도 / 시험 / 과제 / 취약 단원 / 피드백 / 다음 액션을 한 화면에서 확인할 수 있게 됨
- 다음 할 일: 필요하면 학생 상세의 버튼들 중 실제 동작이 필요한 항목부터 순서대로 연결하기

#### 2026-03-24

- 작업 내용: 학생 상세의 최근 과제 현황을 표형으로 다시 보여주고, 관찰 노트와 다음 액션을 묶은 관리 블록을 추가함
- 수정 파일: `src/app/dashboard/students/[id]/page.tsx`, `src/components/students/student-assignment-insight-section.tsx`, `src/lib/student-detail-mock-data.ts`
- 결과: 학생 상세에서 과제 점수 / 관찰 메모 / 바로 실행 항목이 한 화면에 더 선명하게 보이게 됨
- 다음 할 일: 필요하면 과제 표의 액션 버튼과 실제 데이터 연동을 차례대로 붙이기

#### 2026-03-24

- 작업 내용: 학생 관리의 `관리 필요` 요약 카드를 빠른 필터처럼 동작하도록 연결함
- 수정 파일: `src/components/students/student-directory.tsx`, `src/components/students/student-overview.tsx`, `src/components/students/student-filters.tsx`, `src/components/students/student-table.tsx`
- 결과: 관리 필요 / 시험 임박 / 미완료 과제 카드가 클릭 가능한 상태가 되었고, 필터 결과가 없을 때 빈 상태 안내가 보임
- 다음 할 일: 학생 상세 페이지에서도 요약 카드와 상세 필터의 상호작용을 일관되게 유지하기

#### 2026-03-24

- 작업 내용: `미완료 과제` 빠른 필터를 누르면 과제가 많은 학생부터 정렬되도록 연결함
- 수정 파일: `src/components/students/student-directory.tsx`
- 결과: 미완료 과제 탭에서 과제 수가 많은 학생이 먼저 보이게 되었고, 현재 보기 상태 문구도 더 분명해짐
- 다음 할 일: 필요하면 관리 필요 탭도 세부 기준별로 더 세분화하기

#### 2026-03-24

- 작업 내용: 학생 상세 상단에 학습 목표 블록을 추가해 이번 시험 목표, 목표 점수, 정시·수시 준비, 목표 대학을 바로 보이게 함
- 수정 파일: `src/components/students/student-detail-header.tsx`, `src/lib/student-detail-mock-data.ts`, `docs/aim_on_dev_note.md`
- 결과: 학생 상세가 프로필 화면이 아니라 운영 판단용 화면에 더 가까워짐
- 다음 할 일: 학습 목표 영역을 클릭했을 때의 상세 패널이 필요하면 이어서 붙이기

#### 2026-03-24

- 작업 내용: 학생 상세에 AI 학습 진도 리포트와 취약 유형 분석 블록을 추가함
- 수정 파일: `src/app/dashboard/students/[id]/page.tsx`, `src/components/students/student-ai-insight-section.tsx`, `src/lib/student-detail-mock-data.ts`, `docs/FILE_STRUCTURE.md`, `README.md`
- 결과: 학습 진도, 취약 유형, AI 스마트 인사이트가 한 화면에서 더 선명하게 보이게 됨
- 다음 할 일: AI 인사이트의 버튼이나 추천 영역을 실제 동작으로 연결할지 검토하기

#### 2026-03-24

- 작업 내용: 개발 서버 꼬임을 줄이기 위해 `.next`를 시작 전에 지우고 중복 포트를 정리한 안전 실행 스크립트를 추가함
- 수정 파일: `scripts/dev-safe.sh`, `scripts/dev-safe.mjs`, `scripts/build-safe.sh`, `package.json`, `README.md`, `docs/FILE_STRUCTURE.md`, `docs/aim_on_dev_note.md`
- 결과: 매번 같은 방식으로 깨끗한 dev / build를 시작할 수 있는 경로가 생김
- 다음 할 일: 앞으로는 가능하면 `dev-safe`와 `build-safe`를 먼저 쓰기

#### 2026-03-24

- 작업 내용: 파일 구조 문서에 프로젝트 루트 설정 파일과 `public` 정적 자산까지 포함해 누락을 줄이도록 정리함
- 수정 파일: `docs/FILE_STRUCTURE.md`
- 결과: 루트 설정 파일, 로고 자산, `src` 구조가 함께 보여서 처음 보는 사람도 전체 위치를 바로 파악할 수 있게 됨
- 다음 할 일: 새 파일이 생기면 루트 / public / src 구분을 유지하면서 이 문서에 같이 추가하기

#### 2026-03-24

- 작업 내용: 파일 구조 문서에 한눈에 보는 요약 표를 추가하고, README에는 짧은 구조 요약 표를 넣음
- 수정 파일: `docs/FILE_STRUCTURE.md`, `README.md`
- 결과: README는 빠른 안내판 역할, FILE_STRUCTURE는 상세 레퍼런스 역할이 더 분명해짐
- 다음 할 일: 새 파일이나 폴더가 생기면 요약 표와 상세 표를 같이 갱신하기

#### 2026-03-24

- 작업 내용: 오늘 수업 운영 페이지를 새로 만들고, 일정·준비카드·자료·약점·숙제·액션 섹션을 추가함. 일정 row 클릭 시 준비카드로 앵커 이동, 준비카드 접기/펼치기 토글, 자료 준비 완료 토글, 수업별 액션 탭 분리
- 수정/추가 파일: `src/app/dashboard/today-lessons/page.tsx`, `src/components/today-lessons/today-schedule-section.tsx`, `src/components/today-lessons/lesson-prep-card.tsx`, `src/components/today-lessons/weakness-overview-section.tsx`, `src/components/today-lessons/homework-reflection-section.tsx`, `src/components/today-lessons/materials-panel.tsx`, `src/components/today-lessons/next-actions-section.tsx`, `src/lib/mock-data/today-lessons.ts`, `src/lib/mock-data/core.ts`, `src/components/layout/app-header.tsx`
- 결과: 수업 운영 흐름(일정 → 준비카드 → 자료 → 다음 액션)을 한 페이지에서 볼 수 있게 됨. 인터랙티브 요소(접기, 토글, 탭)가 모두 동작함
- 다음 할 일: 준비카드 데이터를 실제 학생 상세 데이터와 연동하는 것 검토

#### 2026-03-24

- 작업 내용: 학생 관리 페이지에 반 필터를 추가하고, 학생 row 액션을 "상세 보기" / "리포트 보기" 두 버튼으로 분리함. 상태 뱃지 스타일을 채우기 pill 형태로 변경
- 수정 파일: `src/components/students/student-filters.tsx`, `src/components/students/student-directory.tsx`, `src/components/students/student-table.tsx`
- 결과: 학교 선택 시 그 학교의 반만 필터에 나타나고, 학생별 상세/리포트 두 경로가 분리됨
- 다음 할 일: 리포트 버튼이 연결된 리포트 페이지가 완성되면 실제 라우팅 테스트 확인

#### 2026-03-24

- 작업 내용: 학생 리포트 페이지를 새로 만들고, KPI 카드·SVG 라인 차트·바 차트·취약 단원·시험 준비도·선생님 코멘트·다음 방향 섹션을 추가함
- 수정/추가 파일: `src/app/dashboard/students/[id]/report/page.tsx`, `src/lib/mock-data/student-report-mock-data.ts`, `src/components/reports/report-summary-cards.tsx`, `src/components/reports/achievement-trend-chart.tsx`, `src/components/reports/homework-trend-chart.tsx`, `src/components/reports/progress-vs-plan-chart.tsx`, `src/components/reports/weakness-analysis-section.tsx`, `src/components/reports/exam-readiness-section.tsx`, `src/components/reports/teacher-report-comment.tsx`, `src/components/reports/next-direction-section.tsx`, `src/components/layout/app-header.tsx`
- 결과: 학생 상세(운영 중심)와 분리된 분석형 리포트 페이지가 완성됨. SVG 차트는 외부 라이브러리 없이 순수 SVG로 구현. `/report` 경로에서 전용 헤더 표시
- 다음 할 일: 필요하면 리포트 데이터를 실제 학생 ID 기반으로 동적으로 불러오는 구조로 전환

## 업데이트 기준

- 파일을 새로 만들거나 분리하면 이 문서에 먼저 적는다.
- 파일 역할이 바뀌면 설명도 같이 바꾼다.
- 임시 파일과 확정 파일은 구분해서 기록한다.
- 삭제한 파일이 있으면 이유를 남긴다.
