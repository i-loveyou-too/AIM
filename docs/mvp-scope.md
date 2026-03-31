# Aim ON MVP 범위 확정

## 교사용 웹 MVP (must)

| 기능 | 경로 | 상태 |
|------|------|------|
| 대시보드 | `/dashboard` | 완료 |
| 학생 목록 | `/dashboard/students` | 완료 |
| 학생 상세 | `/dashboard/students/[id]` | 완료 |
| 과제/제출 확인 | `/dashboard/assignments` | 완료 |
| 리포트 요약 | `/dashboard/reports` | 완료 |
| 시험일 기반 계획 | `/dashboard/curriculum` | 완료 |

## 학생용 웹앱 MVP (must)

| 기능 | 경로 | 상태 |
|------|------|------|
| 로그인 | `/login` | 미구현 |
| 오늘 할 일 | `/student` | 골격 완료 |
| 숙제 제출 | `/student/submissions` | 골격 완료 |
| 시험일/목표 입력 | `/student/profile` | 골격 완료 |
| 리포트 보기 | `/student/reports` | 골격 완료 |
| AI 코치 기본형 | `/student/coach` | 골격 완료 |

## MVP 제외 (later)

- 결제/구독 관리
- 권한 세분화 (교장/원장/강사 구분)
- 학부모 전용 화면
- 정교한 푸시 알림
- 완벽 OCR (stub으로 대체)
- 완벽 AI 채팅 (템플릿 기반으로 대체)
- 프랜차이즈 관리자 화면

## 기능 우선순위 태그

- `must`: 데모/배포 전 반드시 동작해야 하는 기능
- `later`: MVP 이후 단계에서 구현

## 기능 요청 수용 기준

1. 위 must 목록에 있는가? → 진행
2. 위 later/제외 목록에 있는가? → MVP 이후로 미룸
3. 목록에 없는가? → 팀 논의 후 must/later 결정, 결정 전 착수 금지
