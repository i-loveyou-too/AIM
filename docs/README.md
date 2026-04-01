# Docs Index

## 목적
이 문서 묶음은 현재 프로젝트의 인증/로그인/라우팅 구조를 실무 기준으로 정리한 가이드입니다.
코드 변경 전에 설계 원칙과 구현 우선순위를 빠르게 확인하는 용도로 사용합니다.

## 문서 구성
- [auth-flow.md](/Users/kyunglim/에임 온/docs/auth-flow.md)
  - 로그인 진입 흐름
  - 비로그인/로그인 상태 처리
  - 현재 버전(V1)과 확장 버전(V2) 비교

- [role-routing.md](/Users/kyunglim/에임 온/docs/role-routing.md)
  - `teacher` / `student` role 기준 라우팅 구조
  - 권장 URL 설계
  - 보호 라우트 정책 및 확장 예시

- [implementation-plan.md](/Users/kyunglim/에임 온/docs/implementation-plan.md)
  - 단계별 구현 계획
  - 우선순위 및 이유
  - 완료 체크리스트

## 권장 읽기 순서
1. `auth-flow.md`
2. `role-routing.md`
3. `implementation-plan.md`
