# AIM Docs Guide

## 목적
`docs/`는 Aim ON 프로젝트의 기준 문서, 진행 상태, 데이터 구조, 테스트 기록을 모아두는 폴더다.

문서 운영 원칙:
- 새 문서를 무한히 늘리기보다 기존 기준 문서를 먼저 갱신한다.
- 구현 상태가 크게 바뀌면 날짜가 있는 업데이트 문서를 추가한다.
- 인증/DB/화면 fallback 같이 실제 동작이 바뀌는 내용은 반드시 문서에 반영한다.

## 먼저 볼 문서
1. [UPDATE_2026-04-03.md](./UPDATE_2026-04-03.md) - 최근 반영 사항 요약
2. [auth-flow.md](./auth-flow.md) - 로그인/세션/프로필 반환 기준
3. [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) - 작업 체크리스트
4. [db-data-requirements.md](./db-data-requirements.md) - DB 설계 전 요구사항
5. [manual-test-checklist.md](./manual-test-checklist.md) - 수동 테스트 항목

## 문서 역할

### 기준 문서
- [auth-flow.md](./auth-flow.md)
  - 인증 방식, 세션, 로그인 후 사용자 정보 반환 규칙
- [role-routing.md](./role-routing.md)
  - 역할별 라우팅 기준
- [db-data-requirements.md](./db-data-requirements.md)
  - DB 설계 전 요구사항 문서
- [api-contract.yaml](./api-contract.yaml)
  - API 계약 문서

### 진행/상태 문서
- [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)
  - 구현 체크리스트
- [MOCK_DATA.md](./MOCK_DATA.md)
  - mock 제거 및 fallback 현황
- [manual-test-checklist.md](./manual-test-checklist.md)
  - 수동 검증 체크리스트
- [UPDATE_2026-04-03.md](./UPDATE_2026-04-03.md)
  - 최근 반영된 로그인/프로필/설정/DB 연결 상태

### 참고 문서
- [implementation-plan.md](./implementation-plan.md)
- [deployment-plan.md](./deployment-plan.md)
- [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
- [aim_on_dev_note.md](./aim_on_dev_note.md)
- [CODE_REVIEW_ISSUES.md](./CODE_REVIEW_ISSUES.md)

## 2026-04-03 기준 핵심 변경점
- 로그인 인증은 `auth_user` 기준으로 유지
- 로그인 후 프로필 표시는 `users -> academy_members -> teacher_profiles` 연결 기준으로 정리
- `lim` 계정을 새 구조에 연결
  - `users.name = test`
  - `teacher_profiles.display_name = test`
  - `academy_members.academy_role = teacher`
  - `academies.name = Default Academy`
- 교사 설정 화면에서 DB가 아직 없는 값은 `"<db 데이터필요>"`로 표시

## 자주 보는 조합
- 로그인/권한 이슈:
  - [auth-flow.md](./auth-flow.md)
  - [role-routing.md](./role-routing.md)
- DB 구조/계정 연결:
  - [db-data-requirements.md](./db-data-requirements.md)
  - [UPDATE_2026-04-03.md](./UPDATE_2026-04-03.md)
- fallback/mock 상태:
  - [MOCK_DATA.md](./MOCK_DATA.md)
- 배포 전 검증:
  - [manual-test-checklist.md](./manual-test-checklist.md)
