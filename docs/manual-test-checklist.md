# Manual Test Checklist (MVP)

기준일: 2026-04-03

## 목적
- 배포 전 최소 수동 검증 항목을 빠르게 확인한다.
- 최근 수정된 로그인 후 프로필 반환, 교사 설정 화면, DB 연결 상태를 함께 점검한다.

## 사전 준비
- [x] 프런트 실행 확인 (`http://127.0.0.1:3007`)
- [x] 백엔드 실행 확인 (`http://127.0.0.1:8000`)
- [x] 로그인/CSRF API 호출 확인 (`/api/auth/csrf`)
- [x] 교사용 계정 `lim` 로그인 가능 확인
- [x] `lim` 계정이 `users`, `academy_members`, `teacher_profiles`에 연결됨

## A. 인증/세션
- [ ] 비로그인 상태에서 `/dashboard` 접근 시 `/login?next=...`로 이동
- [x] 로그인 성공 시 `/dashboard` 이동
- [ ] 로그인 실패 시 에러 문구 표시
- [ ] 새로고침 후 세션 유지
- [ ] 로그아웃 후 보호 페이지 재접근 차단

## B. 로그인 후 프로필 표시
- [x] `lim` 로그인 시 표시 이름이 `test`로 반환되는지 확인
- [x] `teacher_profiles.display_name`이 있으면 그 값이 우선 사용되는지 확인
- [x] `teacher_profiles`가 없어도 `users.name` fallback이 가능하도록 코드 수정
- [ ] `/api/auth/me` 응답의 `display_name`, `header_name`, `greeting_name` 브라우저 기준 확인
- [ ] `/api/teacher/profile` 응답이 화면 상단 이름과 일치하는지 확인

## C. 교사용 대시보드
- [ ] `/dashboard` 메인 카드/인사이트 로딩 확인
- [ ] `/dashboard/students` 목록 로딩 확인
- [ ] 학생 이름 클릭 시 상세 페이지 이동
- [ ] 리포트 보기 클릭 시 리포트 페이지 이동
- [ ] `/dashboard/assignments` 데이터 로딩 또는 에러 안내 문구 확인
- [ ] `/dashboard/reports` 데이터 로딩 또는 에러 안내 문구 확인
- [ ] `/dashboard/settings` 데이터 로딩 확인

## D. 교사용 설정 화면
- [x] 프로필 카드에 `test`, `Default Academy`, `teacher`가 표시되도록 백엔드 연결 수정
- [x] DB에 아직 없는 설정성 값은 `"<db 데이터필요>"` 안내가 보이도록 수정
- [ ] `/dashboard/settings`에서 `"<db 데이터필요>"` 배너가 실제로 보이는지 확인
- [ ] 프로필 카드의 이메일/연락처/가입일 표기가 기대대로 보이는지 확인
- [ ] 반/과목 정보 카드가 새 구조(`class_groups`) 기준으로 보이는지 확인

## E. 학생용 경로
- [ ] `/student` 오늘 할 일 로딩/빈상태/에러 처리 확인
- [ ] `/student/tasks` 과제 목록 로딩/빈상태/에러 처리 확인
- [ ] `/student/submissions` 제출 이력 로딩/빈상태/에러 처리 확인
- [ ] `/student/reports` 최신 리포트 로딩/빈상태/에러 처리 확인
- [ ] `/student/profile` 목표 저장(PATCH) 동작 확인
- [ ] `/student/coach` 질문 응답(POST) 동작 확인

## F. API 보호/권한
- [ ] 비로그인으로 `/api/teacher/*` 호출 시 401 확인
- [ ] 비교사 계정으로 `/api/teacher/*` 호출 시 403 확인
- [ ] 비로그인으로 `/api/student/*` 호출 시 401 확인
- [ ] 교사 계정으로 `/api/student/*` 호출 시 403 확인

## G. UI/문구
- [ ] 모바일 화면에서 핵심 라우트 깨짐 없는지 확인
- [ ] 에러 시 "기능 준비중" 대신 실제 안내 문구가 보이는지 확인
- [ ] placeholder가 실데이터처럼 보이지 않는지 확인
- [ ] `"<db 데이터필요>"`가 필요한 곳에만 표시되는지 확인

## 최근 반영 메모
- 로그인 인증은 `auth_user` 기준이다.
- 로그인 후 프로필 반환은 `users -> academy_members -> teacher_profiles` 연결 기준으로 정리했다.
- `lim/test` 계정은 실제 DB에 연결 완료했다.
- 교사 설정 화면은 DB에 연결되지 않은 설정성 값에 대해 `"<db 데이터필요>"`를 노출한다.

## 실패 시 기록 규칙
- [ ] 재현 경로(URL)
- [ ] 계정 유형(teacher/student/비로그인)
- [ ] 기대 결과 vs 실제 결과
- [ ] 콘솔/네트워크 에러 캡처
