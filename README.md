# Aim ON

에임 온 교사용 대시보드 MVP입니다.

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## 현재 구현 범위

- 교사용 대시보드 홈 화면
- 전체 학생 리스트 화면
- 공통 레이아웃
- 사이드바
- 상단 헤더
- 요약 카드
- 오늘 일정
- 최근 학생 활동
- 빠른 실행
- 시험일 임박 학생 하이라이트

## 폴더 구조

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

## 구조 문서

- [`FILE_STRUCTURE.md`](/Users/kyunglim/에임%20온/FILE_STRUCTURE.md)

이 파일에 각 폴더와 파일의 역할, 그리고 구조 변경 기록을 같이 적어두고 있습니다.

## 로컬 실행 방법

1. Node.js LTS를 설치합니다.
2. 프로젝트 루트에서 의존성을 설치합니다.

```bash
npm install
```

3. 개발 서버를 실행합니다.

```bash
npm run dev
```

4. 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000
```

## 참고

- 현재는 백엔드가 없습니다.
- 로그인과 학생 관리 페이지는 아직 만들지 않았습니다.
- 루트 경로는 `/dashboard`로 자동 이동합니다.
