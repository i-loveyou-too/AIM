# Aim ON 파일 구조 정리

이 문서는 Aim ON 프론트엔드 코드의 현재 구조와 각 파일의 역할을 빠르게 확인하기 위한 기준 문서입니다.

## 정리 원칙

- 파일은 기능 기준으로 나눈다.
- 페이지가 다르면 파일도 분리한다.
- 공통 레이아웃과 페이지 전용 코드는 섞지 않는다.
- mock data는 기능별로 분리한다.
- 작업할 때마다 중요한 변경과 이유를 이 문서에 남긴다.
- 코드 안에서는 역할이 보이도록 짧은 주석을 남긴다.

## 현재 폴더 구조

```text
src/
  app/
    layout.tsx
    globals.css
    page.tsx
    dashboard/
      page.tsx
      students/
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
    students/
      student-overview.tsx
      student-filters.tsx
      student-table.tsx
      student-directory.tsx
  lib/
    mock-data/
      index.ts
      core.ts
      dashboard.ts
      students.ts
```

## 파일 역할

### `src/app`

- `src/app/layout.tsx`: 전체 페이지를 감싸는 공통 레이아웃
- `src/app/globals.css`: 전역 스타일, 색상 토큰, 폰트 설정
- `src/app/page.tsx`: 루트 진입점, 현재는 대시보드로 이동
- `src/app/dashboard/page.tsx`: 교사용 대시보드 홈 화면
- `src/app/dashboard/students/page.tsx`: 학생 관리 페이지

### `src/components/layout`

- `sidebar.tsx`: 좌측 사이드바 메뉴와 브랜드 영역
- `header.tsx`: 대시보드 공통 헤더
- `app-header.tsx`: 경로에 따라 헤더를 분기하는 상단 바

### `src/components/dashboard`

- `summary-card.tsx`: 대시보드 상단 요약 카드
- `today-schedule.tsx`: 오늘 수업 일정 섹션
- `recent-activity.tsx`: 최근 학생 활동 알림
- `quick-actions.tsx`: 빠른 실행 카드
- `insight-panel.tsx`: 반별 인사이트 / 학생 인사이트 영역
- `exam-alert.tsx`: 학교 선택형 시험 알림 카드

### `src/components/students`

- `student-overview.tsx`: 학생 관리 상단 요약 카드
- `student-filters.tsx`: 학교 / 학년 / 과목 / 상태 / 정렬 필터
- `student-table.tsx`: 학생 표형 리스트와 페이지네이션
- `student-directory.tsx`: 학생 목록의 상태, 필터, 정렬, 페이지 계산을 총괄

### `src/lib/mock-data`

- `index.ts`: mock data 재수출 진입점
- `core.ts`: 교사용 기본 정보, 사이드바 메뉴, 공통 문구
- `dashboard.ts`: 대시보드 관련 mock data
- `students.ts`: 학생 리스트 관련 mock data

## 작업 기록

> 형식: 날짜 / 작업 내용 / 수정 파일 / 결과 / 다음 할 일

#### 2026-03-24

- 작업 내용: 파일 구조 정리 문서를 새로 만들고, 역할별로 현재 구조를 기록함
- 수정 파일: `FILE_STRUCTURE.md`, `README.md`, `aim_on_dev_note.md`
- 결과: 각 파일이 무엇을 담당하는지 한눈에 확인할 수 있게 됨
- 다음 할 일: 앞으로 구조 변경이 생기면 이 문서부터 같이 갱신하기

#### 2026-03-24

- 작업 내용: 학생 관리 페이지를 표형 리스트와 상세 필터 구조로 정리함
- 수정 파일: `src/components/students/student-directory.tsx`, `src/components/students/student-overview.tsx`, `src/components/students/student-filters.tsx`, `src/components/students/student-table.tsx`, `src/lib/mock-data/students.ts`
- 결과: 학생 목록을 학교 / 학년 / 과목 / 상태별로 좁혀 보고, 페이지네이션까지 확인할 수 있게 됨
- 다음 할 일: 학생 상세 페이지로 이어질 때 이 구조를 유지하기

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

## 업데이트 기준

- 파일을 새로 만들거나 분리하면 이 문서에 먼저 적는다.
- 파일 역할이 바뀌면 설명도 같이 바꾼다.
- 임시 파일과 확정 파일은 구분해서 기록한다.
- 삭제한 파일이 있으면 이유를 남긴다.
