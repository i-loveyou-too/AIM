# Aim ON Mock Data 문서

이 문서는 `Aim ON` 프론트엔드에서 쓰는 mock data의 전체 형태를 한눈에 보기 위한 문서입니다.

## 문서 목적

- mock data가 어디에 있는지 빠르게 찾기
- 각 파일이 어떤 역할을 하는지 표로 확인하기
- 실제 화면과 어떤 데이터가 연결되는지 이해하기
- 나중에 DB/API로 바꿀 때 기준점으로 쓰기

## 전체 구조

| 파일 | 역할 | 주요 사용처 |
| --- | --- | --- |
| `src/lib/mock-data/core.ts` | 공통 정보 | 사이드바, 공통 헤더, 기본 문구 |
| `src/lib/mock-data/dashboard.ts` | 대시보드 정보 | 대시보드 홈, 시험 알림, 인사이트, 일정 |
| `src/lib/curriculum-mock-data.ts` | 계획 / 커리큘럼 정보 | 커리큘럼 페이지 전체 |
| `src/lib/mock-data/today-lessons.ts` | 오늘 수업 운영 정보 | 오늘 수업 운영 페이지 |
| `src/lib/mock-data/students.ts` | 학생 목록 원본 | 학생 관리 리스트, 학생 수 집계 |
| `src/lib/student-detail-mock-data.ts` | 학생 상세 생성 로직 | 학생 상세 페이지 전체 |
| `src/lib/mock-data/student-report-mock-data.ts` | 학생 리포트 분석 데이터 | 학생 리포트 페이지 전체 |

## 데이터 흐름

| 흐름 | 설명 |
| --- | --- |
| 공통 정보 | 교사용 프로필, 사이드바 메뉴, 안내 문구를 먼저 제공함 |
| 대시보드 정보 | 상단 요약, 일정, 활동, 인사이트, 시험 알림을 구성함 |
| 커리큘럼 정보 | 시험일까지 역산한 계획, 달력, 계획 대비 실제 비교, 위험 구간을 구성함 |
| 학생 목록 | 학생 한 명 한 명의 기본 상태를 담은 원본 배열임 |
| 학생 상세 | 학생 목록 원본과 과목/상태 프로필을 합쳐 상세 화면용 데이터를 계산함 |

## 타입 기준

### `StudentRecord`

`src/lib/mock-data/students.ts`에 있는 학생 한 명의 기본 형태입니다.

| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `id` | `string` | 학생 고유 ID |
| `name` | `string` | 학생 이름 |
| `school` | `string` | 학교명 |
| `grade` | `string` | 학년 |
| `className` | `string` | 반 이름 |
| `subject` | `string` | 과목 |
| `recentProgress` | `string` | 최근 진도 |
| `recentTag` | `string` | 최근 진도 태그 |
| `score` | `number` | 최근 성취도 |
| `examDays` | `number` | 시험까지 남은 일수 |
| `overdueAssignments` | `number` | 미완료 과제 수 |
| `assignmentDone` | `number` | 완료 과제 수 |
| `assignmentTotal` | `number` | 전체 과제 수 |
| `weakTopic` | `string` | 취약 단원 |
| `status` | `상승 \| 주의 \| 시험 임박 \| 안정` | 운영 상태 |
| `note` | `string` | 짧은 학생 메모 |

### `StudentDetailData`

`src/lib/student-detail-mock-data.ts`에서 계산되는 학생 상세 화면용 형태입니다.

| 필드 | 역할 |
| --- | --- |
| `student` | 원본 학생 데이터 |
| `goalScore` | 목표 점수 계산값 |
| `currentLevel` | 현재 관리 수준 |
| `examDate` | 시험일 |
| `dDayLabel` | `D-5` 같은 표시 |
| `studyti` | 학생 성향 요약 |
| `learningGoal` | 이번 시험 목표와 대학/방향 정보 |
| `aiInsight` | AI 인사이트 블록 |
| `managementStatus` | 관리 상태 제목 |
| `managementTone` | 상태 톤 |
| `managementNote` | 운영 메모 |
| `sectionCards` | 핵심 상태 카드 배열 |
| `progress` | 진도/흐름 정보 |
| `exam` | 시험일/역산 계획 정보 |
| `assignments` | 과제 관리 정보 |
| `weaknesses` | 취약 단원/위험 요소 |
| `feedback` | 피드백 요약 |
| `nextActions` | 다음 액션 목록 |
| `timeline` | 최근 활동 타임라인 |

## 공통 데이터 상세

### `core.ts`

| 이름 | 값 형태 | 설명 |
| --- | --- | --- |
| `teacherProfile` | 객체 | 상단 프로필에 쓰는 교사 정보 |
| `sidebarMenu` | 배열 | 좌측 사이드바 메뉴 |
| `sidebarNotice` | 문자열 | 운영 메모 영역 문구 |

### `dashboard.ts`

| 이름 | 값 형태 | 설명 |
| --- | --- | --- |
| `summaryStats` | 배열 | 대시보드 상단 요약 카드 4개 |
| `dashboardHero` | 객체 | 대시보드 인사말 |
| `aiInsights` | 객체 | 반별 인사이트와 학생 인사이트 |
| `examAlert` | 객체 | 시험 알림 카드 기본값 |
| `examSchools` | 배열 | 학교 선택형 시험 데이터 |
| `todaySchedule` | 배열 | 오늘 수업 일정 |
| `recentActivity` | 배열 | 최근 활동 알림 |
| `quickActions` | 배열 | 빠른 실행 버튼 |
| `examHighlights` | 배열 | 시험 임박 학생 하이라이트 |

### `students.ts`

| 이름 | 값 형태 | 설명 |
| --- | --- | --- |
| `students` | 배열 | 학생 관리 리스트 원본 |
| `studentTotalCount` | 숫자 | 학생 총 인원 |

### `today-lessons.ts`

`today-lessons.ts`는 오늘 수업 운영 화면용으로, 수업 전/중/후 흐름을 한 번에 보려는 데이터 묶음입니다.

| 이름 | 값 형태 | 설명 |
| --- | --- | --- |
| `todayLessonsSummary` | 객체 | 오늘 전체 수업 운영 요약 |
| `todaySchedule` | 배열 | 오늘 수업 일정 리스트 |
| `todayLessonsPrep` | 배열 | 수업별 준비 카드 |
| `weaknessOverview` | 배열 | 약점 집중 관리 학생 개요 |
| `homeworkReflection` | 객체 | 숙제 반영 개요 |
| `todayMaterials` | 배열 | 오늘 사용할 자료 |
| `lessonNextActions` | 배열 | 수업별 다음 액션 |

### `curriculum-mock-data.ts`

`curriculum-mock-data.ts`는 시험일까지의 역산 계획과 실제 진도를 비교해 커리큘럼 운영을 돕는 데이터 묶음입니다.

| 이름 | 값 형태 | 설명 |
| --- | --- | --- |
| `curriculumPageData` | 객체 | 커리큘럼 페이지 전체 데이터 |

#### `curriculumPageData`

| 필드 | 설명 |
| --- | --- |
| `overview` | 학교, 반, 과목, 시험일, D-day, 남은 수업 수, 전체 진도율, 계획 대비 현재 상태 |
| `summaryCards` | 상단 요약 카드 8개 |
| `reversePlan` | 시험일 역산 계획 요약과 현재 목표 위치 |
| `calendar` | 시험일까지의 중요한 날짜와 체크포인트 |
| `comparison` | 계획 대비 실제 진도 비교와 마일스톤 |
| `roadmap` | 대단원 / 중단원 / 세부 학습항목 로드맵 |
| `nextActions` | 다음 수업 액션, 숙제 반영, 보강 대상, 수업 전 점검 |
| `risks` | 지연 위험 / 시험 위험 모듈 |
| `notes` | 계획 조정 이유와 운영 메모 |

## `today-lessons.ts` 항목별 개요

### `todayLessonsSummary`

| 필드 | 의미 |
| --- | --- |
| `totalLessons` | 오늘 전체 수업 수 |
| `focusStudents` | 집중 관리가 필요한 학생 수 |
| `homeworkIssues` | 숙제 이슈 수 |
| `teachingPoints` | 오늘 정리할 수업 포인트 수 |
| `examImminentStudents` | 시험 임박 학생 수 |

### `todaySchedule`

| 필드 | 의미 |
| --- | --- |
| `id` | 일정 고유 ID |
| `time` | 수업 시간 |
| `studentName` | 학생/그룹 이름 |
| `grade` | 학년 |
| `subject` | 과목 |
| `lessonType` | 수업 형태 |
| `todayGoal` | 오늘 수업 목표 |
| `examDate` | 시험일 |
| `dDay` | 남은 일수 |
| `status` | 상태 |

### `todayLessonsPrep`

| 필드 | 의미 |
| --- | --- |
| `studentName` | 학생 이름 |
| `grade` | 학년 |
| `subject` | 과목 |
| `time` | 수업 시간 |
| `examDate` | 시험일 |
| `dDay` | 남은 일수 |
| `recentAchievement` | 최근 성취도 수준 |
| `status` | 수업 상태 |
| `progress` | 진도 정보 |
| `explanation` | 오늘 설명할 내용 |
| `homework` | 숙제 점검 정보 |
| `weakness` | 약점 포인트 |
| `teacherNote` | 선생님 메모 |
| `lessonMemo` | 수업 메모 |

### `weaknessOverview`

| 필드 | 의미 |
| --- | --- |
| `studentName` | 학생 이름 |
| `grade` | 학년 |
| `subject` | 과목 |
| `focusReason` | 집중해야 하는 이유 |
| `overlappingWeakness` | 겹치는 약점 |
| `action` | 바로 할 행동 |
| `urgency` | 긴급도 |

### `homeworkReflection`

| 필드 | 의미 |
| --- | --- |
| `criticalItems` | 꼭 반영할 숙제 이슈 |
| `incompleteHomework` | 미완료 숙제 요약 |
| `commonReExplanation` | 공통 재설명 항목 |
| `reinforcementNeeded` | 추가 보강이 필요한 항목 |

### `todayMaterials`

| 필드 | 의미 |
| --- | --- |
| `id` | 자료 고유 ID |
| `title` | 자료명 |
| `type` | 자료 유형 |
| `subject` | 과목 |
| `student` | 대상 학생/그룹 |
| `priority` | 우선순위 |
| `note` | 비고 |

### `lessonNextActions`

| 필드 | 의미 |
| --- | --- |
| `lessonId` | 수업 ID |
| `studentName` | 학생 이름 |
| `beforeClass` | 수업 전 할 일 |
| `duringClass` | 수업 중 할 일 |
| `afterClass` | 수업 후 할 일 |
| `nextLessonPrep` | 다음 수업 준비 |

## 학생 상세 데이터 생성 방식

`student-detail-mock-data.ts`는 단순 배열이 아니라 계산 로직이 함께 들어 있습니다.

| 구분 | 설명 |
| --- | --- |
| `subjectProfiles` | 과목별 기본 흐름, 진도, 약점, 과제, 성향 요약 |
| `statusProfiles` | 상태별 관리 신호, 계획 상태, 톤 |
| `detailOverrides` | 학생 개별 예외값, 목표 대학, 목표 점수, 시험일 |
| `buildStudentDetail()` | 학생 기본값 + 과목 프로필 + 상태 프로필 + 예외값을 합쳐 상세 데이터 생성 |
| `getStudentDetailById()` | ID로 학생 상세 데이터를 꺼내는 함수 |

### `student-report-mock-data.ts`

학생 리포트 페이지 전용 분석 데이터입니다. 학생 상세(`student-detail-mock-data.ts`)가 현재 상태·운영 중심이라면, 리포트는 추이·변화·분석 중심입니다.

| 이름 | 값 형태 | 설명 |
| --- | --- | --- |
| `reportStudent` | 객체 | 리포트 헤더용 학생 정보 (기간, D-day, 종합 상태, 인사이트) |
| `reportKPIs` | 배열 | KPI 요약 카드 6개 (성취도, 진도율, 숙제율, 취약단원, 시험준비도, 계획안정성) |
| `achievementTrend` | 배열 | 최근 8회차 점수 추이 (`SessionScore[]`) |
| `homeworkTrend` | 배열 | 최근 4주 숙제 수행률 (`WeeklyHomework[]`) |
| `progressVsPlan` | 객체 | 계획 대비 실제 단원 완료 현황 + 주간 breakdown |
| `weakTopics` | 배열 | 반복 오답 취약 단원 (`WeakTopic[]`) |
| `repeatMistakePatterns` | 배열 | 반복 실수 패턴과 유형 |
| `examReadiness` | 객체 | D-day, 준비도 점수, 도달 가능 점수, 체크리스트 |
| `teacherComment` | 객체 | 강점, 우려사항, 최근 변화, 다음 집중 방향 |
| `nextDirection` | 객체 | 다음 수업 방향, 보강 항목, 숙제 방향, 설명 포인트 |
| `recentMilestones` | 배열 | 최근 주요 활동 타임라인 (수업/과제/피드백/시험) |

#### 주요 타입

| 타입 | 필드 | 의미 |
| --- | --- | --- |
| `SessionScore` | `session`, `date`, `score`, `note?` | 회차별 점수 데이터 |
| `WeeklyHomework` | `week`, `completionRate`, `submitted`, `total`, `note?` | 주간 숙제 수행률 |
| `WeakTopic` | `topic`, `category`, `severity`, `frequency`, `lastOccurred`, `riskBeforeExam` | 취약 단원 분석 |

## 작업 기준

- 학생 리스트 숫자는 `students.ts`를 기준으로 잡는다.
- 대시보드 숫자는 가능하면 같은 원천을 바라본다.
- 학생 상세는 원본 학생 데이터에서 계산해서 만든다.
- 화면에 필요한 값이 생기면 먼저 `mock data`에 추가하고 컴포넌트가 그 값을 읽게 한다.
