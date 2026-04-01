# Role Routing

## 목적
- 사용자 role(`teacher` / `student`) 기반 라우팅 구조를 표준화한다.
- 현재 공통 대시보드 구조를 유지하면서도, 이후 분리 구조로 쉽게 확장한다.

## 권장 role 모델
- `teacher`: 교사용 운영 화면 접근 권한
- `student`: 학생용 학습 화면 접근 권한
- role 저장 위치:
  - Django User 확장 필드 또는 Profile/Group 매핑
- 권장안:
  - 로그인 화면에서 role 선택 금지
  - 계정에 저장된 role을 기준으로 라우팅

## 권장 URL 구조

### 현재 (V1)
- `/login`
- `/dashboard` (공통 메인)

### 확장 (V2)
- `/teacher/dashboard`
- `/student/dashboard`
- 공통 진입 라우트:
  - `/dashboard`는 role 판별 후 각 대시보드로 리다이렉트

## 라우팅 결정 흐름
1. 로그인 성공
2. `/api/auth/me` 호출
3. 응답의 `user.role` 확인
4. 분기:
   - `teacher` → `/teacher/dashboard`
   - `student` → `/student/dashboard`
5. role 미정/오류 시:
   - 안전한 fallback(`/login` 또는 `/dashboard`)으로 이동

## 보호 라우트 정책
- 교사 전용 페이지는 `teacher`만 허용
- 학생 전용 페이지는 `student`만 허용
- 권한 불일치 시:
  - 기본: 본인 role 대시보드로 리다이렉트
  - 보조: 403 페이지 제공 가능

## 페이지 구조 예시

```text
src/app
  /login
  /dashboard            # role 체크 후 분기용
  /teacher
    /dashboard
    /students
    /reports
  /student
    /dashboard
    /tasks
    /reports
```

## 구현 시 주의점
- 프론트 role 하드코딩 금지
- 서버 응답(`me`) 기반 단일 판별
- 라우팅 가드는 페이지 단위와 API 단위 둘 다 적용
