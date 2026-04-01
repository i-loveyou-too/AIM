# AIM Docs Guide

## 목적
`docs/`는 Aim ON 프로젝트의 설계 기준, 실행 계획, 데이터/구조 문서, 운영 기록을 한 곳에서 관리하기 위한 폴더입니다.

- 원칙: 기존 문서 유지 + 역할 분리
- 원칙: 새 문서 추가보다 기존 문서 갱신 우선
- 원칙: 중복 내용은 한 문서를 기준 문서로 정하고 나머지는 링크

## 권장 읽기 순서
1. [aim_on_dev_note.md](./aim_on_dev_note.md) - 프로젝트 전체 맥락(마스터 노트)
2. [mvp-scope.md](./mvp-scope.md) - 범위/포함 기능 기준
3. [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) - 현재 실행 체크리스트
4. [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) - 코드/폴더 구조
5. [auth-flow.md](./auth-flow.md) + [role-routing.md](./role-routing.md) - 인증/라우팅 기준

## 문서 맵 (역할 기준)

### 1) 제품/범위
- [aim_on_dev_note.md](./aim_on_dev_note.md)
  - 프로젝트 마스터 개발 노트 (원본 유지)
- [mvp-scope.md](./mvp-scope.md)
  - MVP 포함/제외 범위 기준

### 2) 실행 계획/체크리스트
- [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)
  - 기능 개발 체크리스트(무엇을 구현할지)
- [implementation-plan.md](./implementation-plan.md)
  - 인증/라우팅 구현 단계 계획(어떤 순서로 할지)
- [deployment-plan.md](./deployment-plan.md)
  - 배포 방식/인프라 계획(어디에 배포할지)

### 3) 구조/데이터/API
- [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
  - 프로젝트 폴더/레이어 구조
- [api-contract.yaml](./api-contract.yaml)
  - API 계약(OpenAPI)
- [DASHBOARD_DATA.md](./DASHBOARD_DATA.md)
  - 대시보드 화면 데이터 스펙/필드 기준
- [MOCK_DATA.md](./MOCK_DATA.md)
  - mock 제거/실데이터 전환 상태 문서
- [db-reset.md](./db-reset.md)
  - 개발용 DB 재생성 절차
- `api-samples/*`
  - 샘플 API 응답 JSON

### 4) 품질/기록
- [CODE_REVIEW_ISSUES.md](./CODE_REVIEW_ISSUES.md)
  - 코드리뷰 이슈/기술부채 목록
- [manual-test-checklist.md](./manual-test-checklist.md)
  - 배포 전 최소 수동 테스트 체크리스트
- [DAILY_LOG_2026-03-31.md](./DAILY_LOG_2026-03-31.md)
  - 특정 날짜 작업 로그

## 자주 보는 문서
- 기능 작업 시작: [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)
- 로그인/권한 이슈: [auth-flow.md](./auth-flow.md), [role-routing.md](./role-routing.md)
- API/응답 기준: [api-contract.yaml](./api-contract.yaml), `api-samples/*`
- 구조 파악: [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
- 배포 전 검증: [manual-test-checklist.md](./manual-test-checklist.md)

## 무엇을 어디에 쓸지 (간단 규칙)
- 기능 범위 변경: `mvp-scope.md`
- 구현 진행 상태/체크 항목: `PROJECT_CHECKLIST.md`
- 인증/로그인/권한 라우팅: `auth-flow.md`, `role-routing.md`, `implementation-plan.md`
- 배포/서버 운영 계획: `deployment-plan.md`
- 데이터 필드/목업 전환: `DASHBOARD_DATA.md`, `MOCK_DATA.md`
- 리뷰 이슈/리스크: `CODE_REVIEW_ISSUES.md`
- 하루 작업 기록: `DAILY_LOG_YYYY-MM-DD.md` 형식 문서

## 정리 상태 (2026-04-01)
- 파일 삭제 없음
- 문서 아카이브 이동 없음
- 중복 주제는 README에서 역할 경계와 기준 문서로 정리
- 학생용 `submissions`/`reports` 페이지 API 실연결 상태를 `MOCK_DATA.md`, `PROJECT_CHECKLIST.md`에 반영
