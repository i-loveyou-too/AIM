# Aim ON Mock/Data 전환 현황 (운영형 MVP 기준)

기준일: 2026-04-0
## 문서 경계
- 이 문서: mock 제거 진행도/남은 전환 작업
- [DASHBOARD_DATA.md](./DASHBOARD_DATA.md): 대시보드 데이터 스펙 문서

## 한 줄 요약
- `src/lib/mock-data/*` 디렉토리 및 파일 완전 제거됨 (확인 완료)
- 학생용 `제출`/`리포트` 페이지는 API 실연결 완료
- 남은 이슈는 `페이지 내부 fallback 하드코딩` + `일부 도메인 데이터 밀도`

---

## 1) 점검 범위 및 방법

점검 기준:
- 실제 코드 검색: `src`, `docs`, `backend`
- 학생/교사 주요 라우트 파일 직접 확인
- 백엔드 응답 확인(200/바이트/리스트 길이)
- DB 테이블 건수 확인

---

## 2) mock-data 사용처 점검 결과

### 2-1. `src/lib/mock-data/*`
- 현재 디렉터리 없음
- `mock-data` import 없음

### 2-2. 현재 남은 mock 성격 파일/구조

| 구분 | 파일 | 상태 | 설명 |
|---|---|---|---|
| 참고/타입용 파일 | `src/lib/curriculum-mock-data.ts` | 보존 | 운영 데이터 source로는 미사용, 커리큘럼 타입/샘플 참고용 |
| 정적 UI 설정 | `src/lib/layout-config.ts` | 사용 중 | 사이드바 메뉴/공지 설정. 운영 데이터 mock은 아님 |
| fallback 하드코딩 | `src/app/layout.tsx` | 사용 중 | 프로필 API 실패 시 기본 프로필 유지 |
| fallback 하드코딩 | `src/app/dashboard/today-lessons/page.tsx` | 사용 중 | overview null일 때 summary/schedule/preps 기본값 사용 |
| fallback 하드코딩 | `src/components/assignments/assignments-page-content.tsx` | 사용 중 | summary/insights 기본 객체 사용 |
| fallback 하드코딩 | `src/app/dashboard/reports/page.tsx` | 사용 중 | `safeData` 빈 배열/객체로 대체 |
| fallback 하드코딩 | `src/components/reports/period-report-hub.tsx` | 사용 중 | 기간 데이터 없으면 빈 차트 데이터 사용 |
| fallback 하드코딩 | `src/app/dashboard/settings/page.tsx` | 사용 중 | 설정값 기본 하드코딩 다수. DB 미연결 필드는 `"<db 데이터필요>"`로 표시 (2026-04-03) |

---

## 3) 페이지별 전환 상태 (현재 코드 기준)

### 3-1. 교사용

| 페이지 | 상태 | 현재 데이터 소스 | 메모 |
|---|---|---|---|
| `src/app/dashboard/page.tsx` | API 기반 | `students/classes/today-lessons` | `today-lessons` 빈 배열 시 일정 섹션 비어 보임 |
| `src/app/dashboard/students/page.tsx` | API 기반 | `GET /api/teacher/students` | 학생 리스트 실데이터 표시 |
| `src/app/dashboard/students/[id]/page.tsx` | API 기반 | `GET /api/teacher/students/{id}` | 상세 실데이터 표시 |
| `src/app/dashboard/classes/page.tsx` | API 기반 | `GET /api/teacher/classes` | 실데이터 표시 |
| `src/app/dashboard/today-lessons/page.tsx` | API+fallback | `GET /api/teacher/today-lessons/overview` | API 실패/누락시 fallback 노출 |
| `src/app/dashboard/assignments/page.tsx` | API+fallback | `GET /api/teacher/assignments/overview` | 일부 섹션 fallback 기본값 사용 |
| `src/app/dashboard/reports/page.tsx` | API+fallback | `GET /api/teacher/reports/overview` | `safeData` fallback 존재 |
| `src/app/dashboard/curriculum/page.tsx` | API 기반 | `GET /api/teacher/curriculum/overview` | API 실패 vs 데이터 없음 상태를 분리 표시 |
| `src/app/dashboard/settings/page.tsx` | API+fallback | `GET /api/teacher/settings/overview` | fallback 하드코딩 큼 |

### 3-2. 학생용

| 페이지 | 상태 | 현재 데이터 소스 | 메모 |
|---|---|---|---|
| `src/app/student/page.tsx` | API 기반 (Stub) | `GET /api/student/today-tasks` | `src/lib/api/student.ts` 호출 중 |
| `src/app/student/tasks/page.tsx` | API 기반 (Stub) | `GET /api/student/assignments` | `src/lib/api/student.ts` 호출 중 |
| `src/app/student/profile/page.tsx` | API 기반 (Stub) | `PATCH /api/student/goals` | `src/lib/api/student.ts` 호출 중 |
| `src/app/student/coach/page.tsx` | API 기반 (Stub) | `POST /api/student/coach` | `src/lib/api/student.ts` 호출 중 |
| `src/app/student/submissions/page.tsx` | API 기반 (Stub) | `GET /api/student/submissions` | 제출 이력/상태/파일/점수 렌더링, 새로고침 재조회 가능 |
| `src/app/student/reports/page.tsx` | API 기반 (Stub) | `GET /api/student/reports/latest` | 최신 리포트(기간/성취도/제출률/취약단원/AI요약) 렌더링 |

---

## 4) 실데이터 부족/빈 화면 가능 지점

### 4-1. API 확인 결과(현재)

- `GET /api/teacher/students`: 200, 응답 큼(학생 목록 정상)
- `GET /api/teacher/classes`: 200, 응답 큼(반 목록 정상)
- `GET /api/teacher/today-lessons`: 200, 응답 바이트 `2` (빈 배열 `[]`)
- `GET /api/teacher/reports/overview`: 200, 응답 존재
- `GET /api/student/today-tasks`: 200, `tasks` 2건
- `GET /api/student/assignments`: 200, `assignments` 2건
- `GET /api/student/submissions`: 200, `submissions` 2건
- `GET /api/student/reports/latest`: 200, `report` 존재

### 4-2. 화면에서 비어 보일 가능성이 높은 위치

1. 교사용 대시보드 메인 `오늘 수업 일정`
- 원인: `/api/teacher/today-lessons` 결과가 빈 배열
- 코드 위치: `src/app/dashboard/page.tsx`

2. 교사용 리포트/설정/과제 일부 카드
- 원인: API 실패/부분 누락 시 fallback 객체로 내려감
- 코드 위치:
  - `src/app/dashboard/reports/page.tsx`
  - `src/app/dashboard/settings/page.tsx`
  - `src/components/assignments/assignments-page-content.tsx`

### 4-3. DB 건수 기준으로 밀도 낮은 영역

- `reports_student`: 19
- `reports_class`: 3
- `class_curriculums`: 13
- `lesson_schedules`: 14 (오늘 일정 조건에 안 맞으면 메인 대시보드 일정 0건 가능)

(참고: `students 137`, `assignments 27`, `student_submissions 52`는 기본 조회용으로는 충분)

---

## 5) mock 대체 우선 작업 (실행 순서)

1. `src/app/dashboard/page.tsx`의 today-lessons 빈 데이터 원인 점검
2. fallback 비중 큰 화면(`reports/settings/assignments`)을 API 응답 우선 렌더로 정리
3. `src/lib/curriculum-mock-data.ts`는 현재 참고/타입용으로 유지(운영 데이터 source로 사용 금지)

---

## 6) 추가 SQL 보강 후보

1. `lesson_schedules` 오늘자 데이터 보강
- 대상: 교사용 메인 대시보드 오늘 수업 일정

2. `reports_student`, `reports_class` 데이터 보강
- 대상: 교사용 리포트/학생 리포트 카드 밀도

3. `class_curriculums`, `curriculum_roadmap_items` 보강
- 대상: 커리큘럼/계획 화면

4. 학생별 `today_tasks/assignments/submissions` 분포 보강
- 대상: 학생용 홈/과제/제출 화면 다양성

---

## 7) 결론

- "mock 파일" 자체는 대부분 정리됨
- 학생용 미연결 페이지(제출/리포트)는 실연결 완료됨
- 현재 핵심 문제는 `fallback 하드코딩` + `일부 도메인 데이터 밀도`
- 운영형 MVP 기준 다음 액션은 기능 추가보다 `실데이터 밀도 보강 + fallback 축소`가 맞음
