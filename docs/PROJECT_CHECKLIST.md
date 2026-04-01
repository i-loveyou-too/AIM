# Aim ON MVP 상세 개발 체크리스트

현재 기준 상태: 교사용 웹 목업(대시보드/학생목록/학생상세/과제/리포트/계획/설정)과 DB 스키마/시드/VIEW는 준비되어 있고, API 계약/학생용 웹앱/실서비스 연동은 미착수~초기 단계.

한 줄 목표: "교사 화면 → 학생 오늘 할 일 → 학생 과제/제출 → 교사 확인 → 수동 리포트/계획 반영" 한 줄 플로우 완성

## 현재 우선순위 요약
- P0: DB/API/화면이 실제 데이터로 안정적으로 도는지 확인
- P1: 학생용/교사용 핵심 화면에서 mock 제거 및 CRUD 흐름 완성
- P2: 업로드/제출/수동 리포트/수동 계획 반영
- P3: AI/OCR/자동화 기능, 배포/데모 정리

## 우선순위 기준 실행 순서(빠른 진입)
- P0: PostgreSQL 실연결 재확인, teacher/student API 실제 응답 확인, 학생용/교사용 주요 화면 DB 데이터 표시 확인, mock-data 남은 화면 목록 정리
- P1: 학생/반/과제/제출/목표/리포트/계획 데이터 구조 고정, 학생용 API 연결 안정화, 교사용 실데이터 검증, 목표 수정/제출 등록 등 기본 수정 흐름 구현
- P2: 파일 업로드 구현, 제출 이력 화면 개선, 리포트 값 수동 갱신 구조, 계획 값 수동 갱신 구조
- P3: OCR stub, AI 코치, 자동 계획 재생성, 자동 리포트 생성, 배포 준비, 데모 시나리오 정리

## [P3] 1. MVP 범위 고정
완료 기준: 이번 MVP 포함/제외 범위가 문서로 확정되고, 신규 기능 요청을 범위표 기준으로 즉시 판단할 수 있다.

- [x] `docs/mvp-scope.md` 파일 생성
- [x] 교사용 웹 MVP 포함 기능 6개 확정: 대시보드, 학생목록, 학생상세, 과제/제출 확인, 리포트 요약, 시험일 기반 계획
- [x] 학생용 웹앱 MVP 포함 기능 6개 확정: 로그인, 오늘 할 일, 숙제 제출, 시험일/목표 입력, 리포트 보기, AI 코치 기본형
- [x] MVP 제외 기능 확정: 결제, 권한 세분화, 학부모 전용 화면, 정교한 푸시, 완벽 OCR, 완벽 AI 채팅, 프랜차이즈 관리자
- [x] 기능별 우선순위 태그 정의(`must`/`later`)
- [x] 기능 요청 수용 기준 1페이지 작성(범위 내/범위 외 판단 규칙)
- [ ] 확인할 것: 범위표에 없는 기능 개발 이슈가 생성되지 않는지 확인
- [ ] 산출물: `docs/mvp-scope.md`, 팀 공유용 요약 메시지

## [P0] 2. DB 최종 안정화
완료 기준: 01~07 SQL을 신규 DB에 순서대로 실행했을 때 에러 없이 완료되고, 핵심 VIEW 조회 결과가 정상 반환된다.

- [x] `database/01_create_schema.sql` 재실행 시 에러 여부 확인
- [x] `database/02_seed_reference.sql` 실행 및 기준 데이터 건수 확인
- [x] `database/03_seed_students.sql` 실행 및 학생 데이터 건수 확인
- [x] `database/04_seed_academics.sql` 실행 및 성취/시험 데이터 건수 확인
- [x] `database/05_seed_assignments.sql` 실행 및 과제/제출 데이터 건수 확인
- [x] `database/06_seed_issues.sql` 실행 및 이슈 데이터 건수 확인
- [x] `database/07_views_and_queries.sql` 실행 및 VIEW 생성 여부 확인
- [x] `database/08_seed_demo_updates.sql` 실행으로 데모 데이터 보강 완료
- [x] `v_student_list` 결과 건수/컬럼 확인 쿼리 작성
- [x] `v_class_list` 결과 건수/컬럼 확인 쿼리 작성
- [x] `v_student_detail` 특정 student_id 조회 확인 쿼리 작성
- [x] `v_today_lessons` 결과 건수/정렬 확인 쿼리 작성
- [x] 인덱스 생성 확인(`pg_indexes`) 쿼리로 핵심 인덱스 존재 확인
- [x] 스키마 재생성 절차 문서화(`docs/db-reset.md`)
- [ ] 확인할 것: PostgreSQL 15+ 환경에서 동일하게 동작하는지
- [ ] 산출물: 실행 로그 스크린샷 1세트, `docs/db-reset.md`

## [P0] 3. API 최소 계약 정의
완료 기준: 교사용/학생용 MVP 엔드포인트가 요청/응답/에러 포맷까지 문서로 고정되고, Swagger 또는 OpenAPI로 확인 가능하다.

- [x] `docs/api-contract.yaml`(OpenAPI 3.0) 파일 생성
- [x] 공통 응답 규칙 정의(`success`, `detail`, HTTP status)
- [x] 교사용 조회 API 4개 스펙 작성
- [x] 학생용 API(오늘 할 일/과제 목록/제출/리포트/시험일 목표 수정) 스펙 작성
- [ ] 공통 API(이미지 업로드/OCR 요청/계획 재생성 요청) 스펙 작성
- [x] 학생 상세 404 응답 스펙(`{"detail":"not found"}`) 명시
- [x] 날짜/시간 포맷 표준(ISO8601) 명시
- [x] 필드명 표기 규칙(snake_case) 명시
- [x] 페이지네이션 정책(현재 LIMIT 100 고정, 추후 확장 계획) 문서화
- [x] API 변경 이력 섹션 추가(v0.1)
- [ ] 확인할 것: 프론트에서 필요한 필드가 누락되지 않았는지 페이지 단위 대조
- [ ] 산출물: `docs/api-contract.yaml`, Swagger 렌더링 캡처

## [P1] 4. 페이지별 데이터 요구사항 정리
완료 기준: 각 화면이 어떤 API 필드를 사용하는지 매핑표가 완성되어, 프론트 연결 시 재해석 없이 바로 구현 가능하다.

- [x] `docs/page-data-map.md` 파일 생성
- [x] 교사용 대시보드 카드별 데이터 소스 매핑
- [x] 학생목록 테이블 컬럼 ↔ `v_student_list` 필드 매핑
- [x] 학생상세 섹션별 필드 ↔ `v_student_detail` 필드 매핑
- [x] 과제/제출 화면 필드 ↔ 제출 API 응답 매핑
- [x] 리포트 화면 카드/차트 필드 매핑
- [ ] 계획 화면(시험일 역산 기반) 필드 매핑
- [x] 학생용 오늘 할 일 카드 필드 정의
- [x] 학생용 숙제 제출 화면 입력/응답 필드 정의
- [x] 학생용 리포트 화면 필드 정의
- [x] AI 코치 탭 기본형 입력/응답 필드 정의
- [x] 확인할 것: 현재 mock-data 키와 API 키 차이 목록 작성
- [x] 산출물: `docs/page-data-map.md`, 필드 갭 리스트

## [P0] 5. mock API 또는 임시 API 구현
완료 기준: 실제 DB 조회가 없는 화면도 동일한 API 형태로 호출 가능해 프론트를 API 기반으로 전환할 수 있다.

- [x] Django 백엔드 앱 구조 확정(`backend/config`, `backend/teacher_api`)
- [x] `backend/teacher_api/views.py`의 raw SQL helper(`fetch_all_dict`, `fetch_one_dict`) 유지
- [x] 교사용 조회 API 4개 동작 확인(`/api/teacher/students`, `/classes`, `/students/<id>`, `/today-lessons`)
- [x] DB 미연결 기능용 임시 엔드포인트 목록 작성 (`backend/config/views.py`에 통합 구현)
- [x] 임시 엔드포인트 네임스페이스 분리 (현재 `backend/config/urls.py`를 통해 `/api/student/...` 대응 완료)
- [x] JSON 샘플을 `docs/api-samples/` 하위 파일로 저장
- [x] 상태코드 규칙 통일 (200, 400, 404 규격 적용 완료)
- [x] CORS 필요 시 최소 설정 추가
- [x] Postman 대신 브라우저/프론트 호출로 응답 확인 완료
- [x] 백엔드 runserver 실행 시 PostgreSQL(`localhost:5432`) 실연결 정상화 확인 (DB: `aimon_Teacher`)
- [ ] 확인할 것: 프론트에서 호출 시 CORS/직렬화 에러 없는지
- [ ] 산출물: 테스트 가능한 임시 API 목록, 샘플 응답 파일

## [P1] 6. 교사용 웹 실데이터 연결
완료 기준: 교사용 주요 페이지가 mock-data 대신 API 응답으로 렌더링되고, 새로고침 시 DB 기준 데이터가 보인다.

- [x] `src/lib/api/teacher.ts` 생성(교사용 API fetch 함수 모음)
- [ ] `src/lib/mock-data/*`에서 페이지별 사용처 목록 추출
- [x] 대시보드(`src/app/dashboard/page.tsx`)를 API 기반으로 전환
- [x] 학생목록(`src/app/dashboard/students/page.tsx`)을 `/api/teacher/students` 연결
- [x] 학생상세(`src/app/dashboard/students/[id]/page.tsx`)를 `/api/teacher/students/<id>` 연결
- [x] 오늘 수업(`src/app/dashboard/today-lessons/page.tsx`)를 `/api/teacher/today-lessons` 연결
- [x] 반 목록이 필요한 컴포넌트를 `/api/teacher/classes` 연결
- [x] 로딩 상태 UI(스켈레톤 또는 로딩 텍스트) 추가
- [x] 에러 상태 UI(재시도 버튼) 추가
- [x] 빈 데이터 상태 메시지 추가
- [x] 필터/정렬 동작이 API 데이터 기준으로 유지되는지 확인
- [ ] 백엔드/DB 연결 복구 후 `/dashboard` 런타임 API 응답(200) 재검증
- [x] 확인할 것: 기존 mock 타입과 API 응답 타입 불일치 해결
- [ ] 산출물: mock import 제거 PR, 실데이터 화면 캡처

## [P1] 7. 학생용 웹앱 라우트 생성
완료 기준: 학생용 웹앱 기본 라우트가 생성되고, 모바일 우선 레이아웃에서 각 페이지 진입이 가능하다.

- [x] `src/app/student/layout.tsx` 생성
- [x] `src/app/student/page.tsx` 생성(학생 메인/오늘 할 일)
- [x] `src/app/student/tasks/page.tsx` 생성
- [x] `src/app/student/submissions/page.tsx` 생성
- [x] `src/app/student/reports/page.tsx` 생성
- [x] `src/app/student/profile/page.tsx` 생성(시험일/목표 입력 포함)
- [x] `src/app/student/coach/page.tsx` 생성(AI 코치 기본형)
- [x] 학생용 하단 네비게이션 컴포넌트 생성
- [x] 학생용 공통 헤더 컴포넌트 생성
- [ ] 모바일 viewport 기준 간격/타이포 토큰 적용
- [x] 빈 화면/오류 화면 컴포넌트 추가
- [ ] 확인할 것: 교사용 레이아웃과 URL 충돌 없는지
- [ ] 산출물: 학생용 라우트 맵 문서, 기본 화면 캡처

## [P1] 8. 학생용 웹앱 API 연결
완료 기준: 학생용 주요 화면이 임시 또는 실제 API로 동작하며, 입력/조회 흐름이 끊김 없이 연결된다.

- [x] `src/lib/api/student.ts` 생성(학생 API 클라이언트)
- [x] 오늘 할 일 화면을 `GET /api/student/today-tasks`에 연결
- [x] 내 과제 목록 화면을 `GET /api/student/assignments`에 연결
- [/] 제출 이력 화면 API 준비 완료 (UI 연결 진행 중)
- [/] 리포트 화면 API 준비 완료 (UI 연결 진행 중)
- [x] 프로필 화면을 `PATCH /api/student/goals`에 연결(시험일/목표)
- [x] AI 코치 화면을 `POST /api/student/coach`에 연결
- [ ] 로딩 중 중복 요청 방지 처리
- [ ] 날짜 선택값과 서버 포맷 변환 로직 추가
- [ ] 확인할 것: 학생 계정 기준 데이터만 노출되는지
- [ ] 산출물: 학생용 API 연동 체크 캡처, 오류 케이스 기록

## [P1] 8-1. 남은 mock/미연결 화면 정리 (현재 코드 기준)
완료 기준: "mock 파일은 제거되었지만 실제로는 미연결/고정 fallback으로 보이는 화면"을 정리하고, DB/API 기준으로 치환할 남은 범위를 확정한다.

- [ ] 학생 제출 페이지 API 연결: `src/app/student/submissions/page.tsx` (`GET /api/student/submissions` + 업로드 후 이력 갱신)
- [ ] 학생 리포트 페이지 API 연결: `src/app/student/reports/page.tsx` (`GET /api/student/reports/latest` 기반 섹션 렌더)
- [ ] 교사 설정 페이지 fallback 축소: `src/app/dashboard/settings/page.tsx`의 `safeData` 하드코딩을 API 응답 우선 렌더로 정리
- [ ] 교사 커리큘럼 페이지 빈 배열 fallback 검증: `src/app/dashboard/curriculum/page.tsx` (`overview?.classes ?? []` 구간 에러/빈상태 구분)
- [ ] 미사용 mock 파일 정리 여부 결정: `src/lib/curriculum-mock-data.ts` (삭제 또는 docs 참고용 이동)
- [ ] 확인할 것: "API 실패 fallback"과 "실제 mock 데이터"를 문서에서 구분 표기
- [ ] 산출물: 남은 전환 항목 체크 캡처 + 완료 후 `docs/MOCK_DATA.md` 동기화

## [P2] 9. 파일 업로드 구현
완료 기준: 학생이 이미지 파일을 업로드하면 서버 저장소에 파일이 저장되고, submission 레코드와 연결된다.

- [ ] Django 업로드 엔드포인트 생성(`POST /api/student/submissions/upload`)
- [ ] multipart/form-data 파싱 처리
- [ ] 파일 크기 제한(예: 10MB) 검증 추가
- [ ] 허용 확장자 검증(jpg/jpeg/png/heic)
- [ ] 저장 경로 규칙 정의(`uploads/submissions/{student_id}/{date}/...`)
- [ ] 로컬 저장 또는 S3 저장 드라이버 선택 플래그 추가
- [ ] 업로드 결과 JSON에 `file_url`, `submission_id` 반환
- [ ] 업로드 실패 시 표준 에러 응답 반환
- [ ] 학생용 웹앱 제출 페이지 파일 선택/미리보기 UI 연결
- [ ] 업로드 진행률 표시 UI 추가
- [ ] 확인할 것: 같은 과제 재업로드 시 갱신 정책(덮어쓰기/버전) 확정
- [ ] 산출물: 업로드 성공/실패 샘플 응답, 저장 경로 확인 로그

## [P3] 10. OCR stub 및 실제 연결 준비
완료 기준: OCR API를 아직 붙이지 않아도 stub으로 전체 플로우가 동작하고, 실제 OCR 교체 지점이 분리되어 있다.

- [x] `POST /api/ocr/request` 엔드포인트 생성
- [x] OCR stub 서비스 함수 생성(고정 JSON 반환)
- [x] stub 반환 필드 정의(텍스트, 문항 수, 취약 단원 후보)
- [ ] OCR 결과를 `student_submissions`/`submission_ocr_reviews`와 연결 저장
- [x] OCR 실패 상태 필드 정의(`pending`, `done`, `failed`)
- [ ] OCR 재요청 엔드포인트 정의
- [ ] 실제 OCR 공급자 연동용 인터페이스 파일 분리
- [x] 환경변수 키 자리만 선반영(`OCR_PROVIDER`, `OCR_API_KEY`)
- [ ] 교사용 제출 확인 화면에 OCR 결과 표시 연결
- [ ] 확인할 것: OCR 지연 시에도 제출 상태 조회가 깨지지 않는지
- [ ] 산출물: stub 응답 예시, 실제 OCR 교체 가이드 메모

## [P3] 11. 계획 재생성 기능
완료 기준: 시험일 역산 기준 계획을 생성/재생성하는 API가 동작하고, 학생/교사 화면에서 결과를 확인할 수 있다.

- [ ] 시험일 역산 규칙 문서화(남은 일수, 우선 단원, 하루 소요시간)
- [ ] `POST /api/plans/regenerate` 엔드포인트 생성
- [ ] 입력값 검증(student_id, exam_date, 목표 점수, 하루 가능 시간)
- [ ] 기존 계획 삭제/보존 정책 확정
- [ ] 계획 테이블 저장 구조 확정(기존 테이블 사용 또는 신규 생성)
- [ ] 미이행 과제/취약 단원 반영 로직 구현
- [ ] 생성 결과 요약(`생성건수`, `시작일`, `종료일`) 반환
- [ ] 학생 상세/계획 화면에 재생성 버튼 연결
- [ ] 재생성 실행 이력 로그 남기기
- [ ] 확인할 것: 시험일 변경 시 자동 재계산 트리거 정책
- [ ] 산출물: 계획 생성 전/후 비교 예시 2건

## [P3] 12. 리포트 계산/갱신 기능
완료 기준: 제출/성취/계획 데이터를 바탕으로 리포트가 갱신되고, 교사용/학생용에서 동일 수치가 보인다.

- [ ] 리포트 계산 입력 소스 목록 확정(제출률, 점수, 취약 단원, 계획 이행률)
- [ ] 리포트 계산 함수 파일 생성(`backend/services/report_service.py`)
- [ ] 학생별 리포트 갱신 API(`POST /api/reports/recalculate`) 구현
- [ ] 과제 제출 이벤트 후 리포트 갱신 트리거 연결
- [ ] 계획 재생성 이벤트 후 리포트 갱신 트리거 연결
- [ ] `reports_student`, `report_period_metrics` 저장 로직 구현
- [ ] 교사용 리포트 페이지 실데이터 연동
- [ ] 학생용 리포트 페이지 실데이터 연동
- [ ] 학부모용 요약 문구 자동 생성 기본 템플릿 구현
- [ ] 확인할 것: 동일 기간 재계산 시 중복 레코드 정책
- [ ] 산출물: 학생 1명 기준 리포트 재계산 로그와 화면 캡처

## [P3] 13. AI 코치 최소 버전
완료 기준: 학생용 AI 코치 탭에서 정해진 2~3개 질문에 대해 규칙 기반 또는 템플릿 기반 응답이 동작한다.

- [ ] AI 코치 MVP 질문 세트 확정(오늘 뭐 해야 해, 이 과제 왜 중요해, 시험까지 뭐부터)
- [ ] `POST /api/student/coach` 엔드포인트 생성
- [ ] 입력(question_type, student_id) 검증
- [ ] 응답 템플릿 생성(오늘 할 일/시험일 D-day/미제출 과제 반영)
- [ ] 데이터 없음 케이스 기본 답변 추가
- [ ] 학생용 코치 화면에서 질문 버튼 3개 연결
- [ ] 응답 로딩/오류 UI 처리
- [ ] 추후 LLM 교체를 위한 인터페이스 함수 분리
- [ ] 확인할 것: 허용 질문 외 입력 처리 방식(거절/기본응답)
- [ ] 산출물: 질문 3개에 대한 실제 응답 스냅샷

## [P2] 14. 인증/권한 최소 버전
완료 기준: 교사/학생 로그인 후 본인 역할 페이지만 접근 가능하고, 기본 세션 검증이 동작한다.

- [ ] 로그인 API(`POST /api/auth/login`) 구현
- [ ] 현재 사용자 API(`GET /api/auth/me`) 구현
- [ ] 로그아웃 API(`POST /api/auth/logout`) 구현
- [ ] 최소 사용자 테이블/인증 연동 정책 확정(Django auth 또는 별도)
- [ ] 교사/학생 역할 필드 기반 접근 미들웨어 구현
- [ ] 교사용 경로 접근 제한 적용
- [ ] 학생용 경로 접근 제한 적용
- [ ] 프론트 로그인 폼 생성(교사용/학생용)
- [ ] 인증 실패 메시지 표준화
- [ ] 토큰 또는 세션 만료 처리 UI 추가
- [ ] 확인할 것: 학생 계정으로 교사용 API 접근 차단되는지
- [ ] 산출물: 역할별 접근 테스트 로그

## [P3] 15. 수동 테스트 체크리스트
완료 기준: 교사/학생 핵심 시나리오를 수동으로 통과하고, 재현 가능한 버그 목록과 수정 상태가 정리된다.

- [ ] `docs/manual-test-checklist.md` 생성
- [ ] 시나리오 1: 학생 로그인 → 오늘 할 일 조회
- [ ] 시나리오 2: 학생 과제 이미지 업로드 → 제출 완료 확인
- [ ] 시나리오 3: OCR stub 결과 표시 확인
- [ ] 시나리오 4: 교사 로그인 → 학생목록/학생상세 조회
- [ ] 시나리오 5: 교사 제출 확인 → 피드백 등록
- [ ] 시나리오 6: 계획 재생성 실행 → 화면 반영 확인
- [ ] 시나리오 7: 리포트 재계산 → 교사/학생 화면 일치 확인
- [ ] 에러 시나리오: 없는 student_id 조회 404 확인
- [ ] 에러 시나리오: 업로드 확장자/용량 제한 확인
- [ ] 브라우저 2종 이상(Chrome/Safari) 기본 점검
- [ ] 모바일 화면(학생용) 기본 점검
- [ ] 확인할 것: 치명 버그 우선순위(P0/P1/P2) 라벨링
- [ ] 산출물: 테스트 결과표, 버그 리스트, 재테스트 결과

## [P3] 16. 시연/배포 준비
완료 기준: 데모 당일 교사/학생 계정으로 핵심 플로우를 안정적으로 시연할 수 있고, 환경변수/샘플데이터/실행 절차가 문서화되어 있다.

- [ ] 데모 계정 2종 준비(teacher, student)
- [ ] 데모 DB 시드 스크립트 확정
- [ ] 데모 시나리오 문서 작성(5~7분 버전)
- [ ] 시연 순서 고정(교사 화면 → 학생 제출 → 교사 반영)
- [x] `.env.example` 작성(DB, OCR, 스토리지 키)
- [x] 백엔드 실행 스크립트 정리
- [x] 프론트 실행 스크립트 정리
- [ ] 로컬/스테이징 URL 정리 문서 작성
- [ ] 장애 대비 플랜 작성(데이터 리셋, 로컬 대체 시연)
- [ ] 확인할 것: 데모 핵심 6개 기능이 1회 이상 연속 성공하는지
- [ ] 산출물: 데모 체크시트, 실행 가이드, 시연 캡처 영상

## [P0] 17. 오늘 바로 할 일(Top Priority)
완료 기준: 오늘 안에 교사용 실데이터 조회와 학생용 초기 골격까지 MVP 진행의 분기점을 만든다.

- [x] DB 실연결 확인 (PostgreSQL 연결/기본 쿼리 확인)
- [x] teacher/student API 실제 응답 확인 (200/필드/직렬화 점검 완료)
- [x] mock-data 남아 있는 화면 찾기 (교사용/학생용 전체 목록화)
- [x] 학생용/교사용 핵심 화면 실제 데이터 표시 확인 (로컬 개발 환경 기준)
- [x] 수동 수정 가능한 API 우선순위 정리 (목표 수정, 제출 등록 등)
- [ ] 하루 종료 전 작업 로그 기록

기존 진행 항목(체크 상태 유지):
- [x] DB에서 `01~07` 재실행 후 VIEW 4개 조회 성공 확인
- [x] `docs/api-contract.yaml` 초안 작성(교사용 조회 API 4개 우선)
- [x] 교사용 학생목록 페이지를 `/api/teacher/students`로 첫 연결
- [x] 교사용 학생상세 페이지를 `/api/teacher/students/<id>`로 첫 연결
- [x] 학생용 웹앱 라우트 6개 파일 생성(`src/app/student/*`)
- [x] (최우선) PostgreSQL `localhost:5432` 연결 및 `runserver` 기동 확인 (DB: `aimon_Teacher`)
- [x] (보류) 이슈함 페이지 라우트 생성 + API 연결 (대시보드 내 통합 확인)
- [ ] (보류) 학생용 `/student/*` 페이지 실데이터 API 연동(요청 시 진행)
- [x] 학생용 오늘 할 일 페이지에 임시 API 호출 코드 추가 (`src/lib/api/student.ts`)
- [x] 업로드 엔드포인트 경로/요청 형식 확정 문서 작성 (`docs/aim_on_dev_note.md`)
- [x] 프론트엔드 기동 안정성 확보 (`dev-safe.mjs` 타임아웃 10초 연장)
- [x] 하루 종료 전 진행 상태 업데이트 완료
- [ ] 확인할 것: 내일 바로 이어서 개발할 수 있게 막힌 이슈 3개 이내로 정리
- [ ] 산출물: 오늘 작업 로그 1페이지, 내일 우선순위 3개

## [P0->P3] 18. 현실적 개발 순서 (고정)
완료 기준: Step 1~8 순서대로 진행하고, 선행 단계가 완료되기 전 다음 단계를 착수하지 않는다.

- [x] Step 1: DB 실연결 확인
- [x] Step 2: 교사용/학생용 실데이터 표시 확인 (Stub 및 Local DB)
- [x] Step 3: mock-data 제거 (`src/lib/mock-data/*` 폴더 정리 완료)
- [ ] Step 4: 목표 수정/제출 등록 등 기본 CRUD 구현
- [ ] Step 5: 파일 업로드 구현
- [ ] Step 6: 수동 리포트/수동 계획 갱신
- [ ] Step 7: OCR/AI 기능
- [ ] Step 8: 배포 준비

기존 순서 기록(참고):
- [ ] Step 1: 로그인/인증 붙이기 (API 스펙 정의 중)
- [ ] Step 2: 교사 1명 기준 더미 계정으로 로그인 성공
- [ ] Step 3: 대시보드 요약 카드 API 연결
- [ ] Step 4: 학생 목록 API 연결
- [ ] Step 5: 학생 상세 API 연결
- [ ] Step 6: 반 목록/반 상세 연결
- [ ] Step 7: 배포

## [P3] 19. 배포 전 필수 점검
완료 기준: 아래 5개 검증이 모두 통과할 때만 배포를 진행한다.

- [ ] 로그인 후 새로고침해도 세션이 유지되는지 확인
- [ ] API 서버 주소가 localhost로 하드코딩되지 않았는지 확인
- [ ] API 에러 시 빈화면 대신 안내문이 표시되는지 확인
- [ ] mock 데이터가 실데이터처럼 보이지 않게 제거/분리되었는지 확인
- [ ] 모바일 최소 대응(핵심 화면 레이아웃/입력/조회)이 가능한지 확인

## [P3] 20. 지금 하지 말아야 할 것
- [ ] OCR 고도화
- [ ] AI 코치 고도화
- [ ] 자동 계획 재생성
- [ ] 자동 리포트 생성
- [ ] 결제
- [ ] 학부모 전용 화면
- [ ] 푸시/알림
- [ ] 과한 UI 리뉴얼
