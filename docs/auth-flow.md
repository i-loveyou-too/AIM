# Auth Flow

## 목적
- 현재 프로젝트의 로그인/인증 흐름을 일관된 기준으로 정리한다.
- 1차 버전(공통 대시보드 진입)과 확장 버전(role 분기)을 분리해 관리한다.

## 현재 기준 흐름 (V1)
1. 사용자가 사이트 접속
2. 비로그인 상태면 로그인 페이지로 이동 (`/login`)
3. 로그인 성공 시 공통 대시보드로 이동 (`/dashboard`)
4. 로그인 세션 유지 상태에서는 보호 페이지 접근 허용

## 상태별 처리 원칙
- 비로그인 사용자:
  - 보호 라우트 접근 시 `/login`으로 리다이렉트
- 로그인 사용자:
  - `/login` 접근 시 `/dashboard`로 리다이렉트(중복 로그인 방지)
- 세션 만료 사용자:
  - API `401` 응답 시 세션 무효화 처리 후 `/login` 이동

## 인증 처리 기준
- 인증 방식: Session/Cookie 기반(Django auth 권장)
- 로그인 API: `POST /api/auth/login`
- 로그아웃 API: `POST /api/auth/logout`
- 사용자 확인 API: `GET /api/auth/me`
- CSRF 사전 획득: `GET /api/auth/csrf` (unsafe method 호출 전)

## 현재 버전 vs 확장 버전

### V1 (지금)
- 로그인 성공 후 고정 이동: `/dashboard`
- 교사/학생 공통 대시보드 진입 구조

### V2 (확장)
- 로그인 성공 후 `/api/auth/me`로 사용자 role 확인
- role 기반 라우팅:
  - `teacher` → `/teacher/dashboard`
  - `student` → `/student/dashboard`

## 권장 체크리스트
- [x] 로그인 전 보호 페이지 접근 차단 (`/dashboard*`)
- [x] 로그인 성공 시 세션 쿠키 저장 확인
- [x] `/api/auth/me`로 로그인 상태/사용자 정보 확인
- [x] 로그아웃 시 세션 삭제 및 보호 페이지 재접근 차단
- [ ] 세션 만료 시 자동 로그인 페이지 복귀(고도화 예정)

## 권장 설계 원칙
- 로그인 화면에서 교사/학생을 직접 선택하지 않는다.
- 계정(User) 자체에 저장된 role을 단일 진실 소스로 사용한다.
- 프론트 라우팅은 role 판별 결과만 사용하고 role 판별 로직을 중복하지 않는다.

## 현재 구현 상태 (2026-04-01)
- 로그인 페이지: `/login`
- 기본 진입: `/` → `/login`
- 로그인 성공 후 이동: `/dashboard`
- 인증 상태 관리:
  - 앱 시작 시 `/api/auth/me` 호출
  - 클라이언트 `AuthProvider`에서 세션 상태 관리
- 보호 라우트:
  - `/dashboard` 하위 경로 비로그인 접근 시 `/login?next=...` 리다이렉트
- 로그아웃:
  - 사이드바 로그아웃 버튼에서 `POST /api/auth/logout` 호출 후 `/login` 이동
- 참고:
  - 현재는 공통 대시보드 고정 진입
  - role 기반 분기(`teacher`/`student`)는 다음 단계에서 확장
