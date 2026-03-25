// 이슈함 페이지 목업 데이터
// 이슈 확인 → 우선순위 판단 → 관련 화면 이동 → 수업 반영 흐름

// ─── 타입 정의 ────────────────────────────────────────────────
export type IssueType =
  | "미제출"
  | "시험 임박"
  | "진도 지연"
  | "계획 조정 필요"
  | "질문 있음"
  | "OCR 검토 필요"
  | "OMR 오답 다수"
  | "공통 오답 반영"
  | "집중 관리";

export type IssueUrgency = "긴급" | "높음" | "중간" | "낮음";
export type IssueStatus  = "미확인" | "확인됨" | "처리 완료";

export type IssueAction = {
  label: string;
  href:  string;
  style: "primary" | "secondary";
};

export type Issue = {
  id:          string;
  type:        IssueType;
  urgency:     IssueUrgency;
  status:      IssueStatus;
  studentName?: string;
  className:   string;
  subject:     string;
  title:       string;
  description: string;
  occurredAt:  string;
  actions:     IssueAction[];
  detail:      IssueDetail;
};

// ── 이슈 상세 유니언 ─────────────────────────────────────────
export type IssueDetail =
  | UnsubmittedDetail
  | ExamImmimentDetail
  | ProgressDelayDetail
  | QuestionDetail
  | OcrReviewDetail
  | CommonMistakeDetail
  | FocusMgmtDetail;

export type UnsubmittedDetail = {
  kind: "unsubmitted";
  assignmentTitle: string;
  dueDate: string;
  missedCount: number;
  teacherMemo: string;
  nextAction: string;
};

export type ExamImmimentDetail = {
  kind: "exam";
  examDate: string;
  dDay: string;
  progressStatus: string;
  needsReinforcement: boolean;
  needsPlanAdjust: boolean;
  note: string;
};

export type ProgressDelayDetail = {
  kind: "progress";
  plannedUnit: string;
  actualUnit: string;
  delayWeeks: number;
  reason: string;
  adjustmentNeeded: string;
};

export type QuestionDetail = {
  kind: "question";
  questionText: string;
  relatedUnit: string;
  assignmentTitle?: string;
  needsInClassExplanation: boolean;
};

export type OcrReviewDetail = {
  kind: "ocr";
  assignmentTitle: string;
  submittedAt: string;
  ocrSummary: string;
  reviewReason: string;
};

export type CommonMistakeDetail = {
  kind: "commonMistake";
  topMistakeQuestion: string;
  mistakeType: string;
  conceptToReExplain: string[];
  todayLessonRecommendation: string;
};

export type FocusMgmtDetail = {
  kind: "focus";
  reasons: string[];
  recentTrend: string;
  teacherNote: string;
};

// ─── 상단 요약 KPI ────────────────────────────────────────────
export const issueSummary = {
  unreadCount:         9,
  urgentTodayCount:    4,
  examImminentCount:   3,
  assignmentIssueCount: 5,
  lessonReflectionCount: 4,
  focusStudentCount:   3,
};

// ─── 이슈 목록 ───────────────────────────────────────────────
export const issues: Issue[] = [
  // ── 긴급 이슈
  {
    id: "issue-1",
    type: "시험 임박",
    urgency: "긴급",
    status: "미확인",
    studentName: "박서연",
    className: "수학 A반",
    subject: "수학",
    title: "수학 A반 시험 D-19 — 진도 미달 위험",
    description: "시험까지 19일 남았으나 극한 기초 단원 이제 진입. 보강 없이는 목표 점수 달성 어려움.",
    occurredAt: "3/25",
    actions: [
      { label: "학생 상세 보기", href: "/dashboard/students/AIM_24005",        style: "primary"   },
      { label: "리포트 보기",   href: "/dashboard/students/AIM_24005/report", style: "secondary" },
    ],
    detail: {
      kind: "exam",
      examDate: "2024-04-12",
      dDay: "D-19",
      progressStatus: "극한 기초 진입 (예정 대비 1.5단원 지연)",
      needsReinforcement: true,
      needsPlanAdjust: true,
      note: "유리화 계산 반복 오답 지속. 다음 수업에서 재설명 필수.",
    },
  },
  {
    id: "issue-2",
    type: "공통 오답 반영",
    urgency: "긴급",
    status: "미확인",
    className: "수학 A반",
    subject: "수학",
    title: "수학 A반 — ∞ - ∞ 유리화 오답률 83%",
    description: "6명 중 5명이 7번 문제 오답. 다음 수업에서 재설명하지 않으면 같은 실수 반복됨.",
    occurredAt: "3/25",
    actions: [
      { label: "과제 보기",       href: "/dashboard/assignments", style: "primary"   },
      { label: "수업 반영 확인",  href: "/dashboard/today-lessons", style: "secondary" },
    ],
    detail: {
      kind: "commonMistake",
      topMistakeQuestion: "7번 — ∞ - ∞ 꼴 유리화",
      mistakeType: "계산 실수 (분모 유리화 단계 생략)",
      conceptToReExplain: [
        "∞ - ∞ 꼴 유리화 절차 4단계",
        "최고차항 분리법 순서 카드",
        "부등식 방향 전환 음수 곱셈 개념 교정",
      ],
      todayLessonRecommendation: "수업 초반 7번 기반 재풀이 10분 배치. 칠판 서술 연습 병행.",
    },
  },
  {
    id: "issue-3",
    type: "미제출",
    urgency: "긴급",
    status: "미확인",
    studentName: "박재현",
    className: "수학 A반",
    subject: "수학",
    title: "박재현 — 3회 연속 과제 미제출",
    description: "최근 3회 연속 미제출. 마감일 경과 후에도 제출 없음. 학부모 연락 또는 직접 면담 필요.",
    occurredAt: "3/25",
    actions: [
      { label: "학생 상세 보기", href: "/dashboard/students", style: "primary"   },
      { label: "과제 보기",      href: "/dashboard/assignments", style: "secondary" },
    ],
    detail: {
      kind: "unsubmitted",
      assignmentTitle: "수열의 극한 — 기본 계산 20문항",
      dueDate: "3/25",
      missedCount: 3,
      teacherMemo: "지난 주부터 수업 참여도도 낮아짐. 외부 요인 파악 필요.",
      nextAction: "다음 수업 전 개별 면담 또는 학부모 연락",
    },
  },
  {
    id: "issue-4",
    type: "OCR 검토 필요",
    urgency: "긴급",
    status: "미확인",
    studentName: "강태윤",
    className: "수학 A반",
    subject: "수학",
    title: "강태윤 — OCR 인식 불가, 직접 검토 필요",
    description: "사진 3장 제출했으나 손글씨 흐릿. OCR 결과 신뢰 불가. 직접 채점 또는 재제출 요청 필요.",
    occurredAt: "3/25",
    actions: [
      { label: "과제 보기",      href: "/dashboard/assignments", style: "primary"   },
      { label: "학생 상세 보기", href: "/dashboard/students",    style: "secondary" },
    ],
    detail: {
      kind: "ocr",
      assignmentTitle: "수열의 극한 — 기본 계산 20문항",
      submittedAt: "3/26 08:30",
      ocrSummary: "사진 3장 제출 — 손글씨 인식률 30% 미만. 답안 추출 실패.",
      reviewReason: "직접 검토 또는 재제출 요청 필요. 점수 미반영 상태.",
    },
  },

  // ── 높음 이슈
  {
    id: "issue-5",
    type: "질문 있음",
    urgency: "높음",
    status: "미확인",
    studentName: "박서연",
    className: "수학 A반",
    subject: "수학",
    title: "박서연 — ∞ - ∞ 유리화 방향 질문",
    description: "7번 문제에서 유리화할 때 부호 방향을 헷갈린다는 질문. 다음 수업 초반에 반드시 다뤄야 함.",
    occurredAt: "3/25",
    actions: [
      { label: "수업 반영 보기", href: "/dashboard/today-lessons", style: "primary"   },
      { label: "과제 보기",     href: "/dashboard/assignments",    style: "secondary" },
    ],
    detail: {
      kind: "question",
      questionText: "7번 문제에서 ∞ - ∞ 형태를 유리화할 때 부호 방향이 헷갈려요. 다음 수업에서 다시 한번 풀어주실 수 있을까요?",
      relatedUnit: "수열의 극한 — ∞ - ∞ 꼴",
      assignmentTitle: "수열의 극한 — 기본 계산 20문항",
      needsInClassExplanation: true,
    },
  },
  {
    id: "issue-6",
    type: "질문 있음",
    urgency: "높음",
    status: "미확인",
    studentName: "최다은",
    className: "수학 A반",
    subject: "수학",
    title: "최다은 — 분자·분모 나누기 순서 질문",
    description: "5번 OMR 오답 후 질문 남김. 분자 분모를 나누는 순서에 대한 개념 혼동.",
    occurredAt: "3/25",
    actions: [
      { label: "수업 반영 보기", href: "/dashboard/today-lessons", style: "primary"   },
      { label: "학생 상세 보기", href: "/dashboard/students",       style: "secondary" },
    ],
    detail: {
      kind: "question",
      questionText: "5번이 왜 ①이 아닌지 이해가 안 돼요. 분자 분모를 같이 나누는 거 아닌가요?",
      relatedUnit: "분수형 극한값 계산",
      assignmentTitle: "수열의 극한 — 기본 계산 20문항",
      needsInClassExplanation: true,
    },
  },
  {
    id: "issue-7",
    type: "미제출",
    urgency: "높음",
    status: "미확인",
    studentName: "한지은",
    className: "수학 C반",
    subject: "수학",
    title: "한지은 — 2회 연속 과제 미제출",
    description: "수학 C반 이번 과제 미제출. 지난 주에도 미제출. 개별 확인 필요.",
    occurredAt: "3/24",
    actions: [
      { label: "학생 상세 보기", href: "/dashboard/students",    style: "primary"   },
      { label: "과제 보기",     href: "/dashboard/assignments", style: "secondary" },
    ],
    detail: {
      kind: "unsubmitted",
      assignmentTitle: "등비수열 심화 + 점화식 — 15문항",
      dueDate: "3/27",
      missedCount: 2,
      teacherMemo: "지난 주 이유 미파악. 다음 수업 전 확인 요망.",
      nextAction: "다음 수업 전 개별 연락",
    },
  },
  {
    id: "issue-8",
    type: "OMR 오답 다수",
    urgency: "높음",
    status: "미확인",
    studentName: "이민준",
    className: "수학 A반",
    subject: "수학",
    title: "이민준 — OMR 정답률 60% (10문항 중 6개)",
    description: "3번, 5번, 7번, 10번 오답. 극한값 계산 유형에서 반복 오류 패턴.",
    occurredAt: "3/25",
    actions: [
      { label: "과제 보기",      href: "/dashboard/assignments", style: "primary"   },
      { label: "학생 상세 보기", href: "/dashboard/students",    style: "secondary" },
    ],
    detail: {
      kind: "unsubmitted",
      assignmentTitle: "수열의 극한 — 기본 계산 20문항",
      dueDate: "3/25",
      missedCount: 0,
      teacherMemo: "3번·5번·7번·10번 오답 집중. 개념 이해보다 절차 혼동 가능성.",
      nextAction: "다음 수업에서 해당 유형 개별 확인",
    },
  },

  // ── 중간 이슈
  {
    id: "issue-9",
    type: "진도 지연",
    urgency: "중간",
    status: "확인됨",
    studentName: "박서연",
    className: "수학 A반",
    subject: "수학",
    title: "박서연 — 진도 계획 대비 1.5단원 지연",
    description: "등비수열 심화에서 1회 추가 소요. 현재 예정보다 1.5단원 뒤처진 상태.",
    occurredAt: "3/22",
    actions: [
      { label: "리포트 보기",    href: "/dashboard/students/AIM_24005/report", style: "primary"   },
      { label: "학생 상세 보기", href: "/dashboard/students/AIM_24005",        style: "secondary" },
    ],
    detail: {
      kind: "progress",
      plannedUnit: "수열의 극한 심화 (3/22 완료 예정)",
      actualUnit:  "수열의 극한 기초 진입 중",
      delayWeeks:  1,
      reason: "등비수열 심화에서 추가 1회 소요",
      adjustmentNeeded: "계획 1주 재조정 필요. 시험 전 핵심 범위 우선순위 재설정 권장.",
    },
  },
  {
    id: "issue-10",
    type: "질문 있음",
    urgency: "중간",
    status: "미확인",
    studentName: "황준서",
    className: "수학 C반",
    subject: "수학",
    title: "황준서 — 점화식 공비 찾기 질문",
    description: "9번 점화식에서 공비를 어떻게 찾는지 모르겠다는 질문. 다음 수업에서 설명 필요.",
    occurredAt: "3/24",
    actions: [
      { label: "수업 반영 보기", href: "/dashboard/today-lessons", style: "primary"   },
      { label: "과제 보기",     href: "/dashboard/assignments",    style: "secondary" },
    ],
    detail: {
      kind: "question",
      questionText: "9번 점화식에서 공비를 어떻게 찾는 건지 모르겠어요.",
      relatedUnit: "등비수열 — 공비 계산",
      assignmentTitle: "등비수열 심화 + 점화식 — 15문항",
      needsInClassExplanation: true,
    },
  },
  {
    id: "issue-11",
    type: "집중 관리",
    urgency: "중간",
    status: "확인됨",
    studentName: "이서아",
    className: "수학 A반",
    subject: "수학",
    title: "이서아 — 부분 제출 + 개념 미흡",
    description: "13번 이후 시간 부족으로 부분 제출. 심화 파트 개념 미흡. 개별 설명 1회 필요.",
    occurredAt: "3/25",
    actions: [
      { label: "학생 상세 보기", href: "/dashboard/students",    style: "primary"   },
      { label: "과제 보기",     href: "/dashboard/assignments", style: "secondary" },
    ],
    detail: {
      kind: "focus",
      reasons: [
        "부분 제출 — 13번 이후 미완성",
        "풀이 속도 부족 — 타이머 훈련 권장",
        "심화 파트 개념 이해 미흡",
      ],
      recentTrend: "최근 2주 완성도 점차 낮아지는 추세",
      teacherNote: "다음 수업에서 13번 이후 유형 개별 설명 필요. 분량 조절도 고려.",
    },
  },
  {
    id: "issue-12",
    type: "시험 임박",
    urgency: "중간",
    status: "미확인",
    studentName: "이준혁",
    className: "영어 B반",
    subject: "영어",
    title: "이준혁 — 영어 시험 D-32, 빈칸 추론 점수 저조",
    description: "최근 빈칸 추론 유형 정답률 55%. 연결사 선택 오류 반복. 시험 전 집중 보강 필요.",
    occurredAt: "3/24",
    actions: [
      { label: "학생 상세 보기", href: "/dashboard/students",      style: "primary"   },
      { label: "수업 반영 보기", href: "/dashboard/today-lessons",  style: "secondary" },
    ],
    detail: {
      kind: "exam",
      examDate: "2024-04-25",
      dDay: "D-32",
      progressStatus: "빈칸 추론 A유형 완료, B유형 진입 중",
      needsReinforcement: true,
      needsPlanAdjust: false,
      note: "연결사 선택 오류 반복. 어휘·문맥 동시 적용 훈련 필요.",
    },
  },

  // ── 낮음 이슈
  {
    id: "issue-13",
    type: "계획 조정 필요",
    urgency: "낮음",
    status: "확인됨",
    className: "수학 C반",
    subject: "수학",
    title: "수학 C반 — 미제출 2명으로 진도 조율 필요",
    description: "류서준·한지은 미제출로 다음 수업 진도 진행 전 제출 완료 확인 필요.",
    occurredAt: "3/24",
    actions: [
      { label: "과제 보기",        href: "/dashboard/assignments",    style: "primary"   },
      { label: "수업 운영 보기",   href: "/dashboard/today-lessons", style: "secondary" },
    ],
    detail: {
      kind: "progress",
      plannedUnit: "점화식 → 극한 연결 (3/27 시작 예정)",
      actualUnit:  "점화식 심화 중",
      delayWeeks:  0,
      reason: "미제출 2명 처리 후 다음 단원 진입",
      adjustmentNeeded: "다음 수업 전 미제출 완료 확인 후 진도 진행 여부 결정",
    },
  },
];

// ─── 다음 수업 반영 이슈 ──────────────────────────────────────
export const lessonReflectionIssues = {
  reExplainNow: [
    "∞ - ∞ 꼴 유리화 절차 — 수학 A반 7번 기반 재풀이 (5명 오답)",
    "최고차항 분리법 4단계 순서 — 칠판 연습",
    "점화식 → 일반항 유도 절차 — 수학 C반 황준서 질문 기반",
  ],
  questionItems: [
    "박서연 질문: 7번 유리화 부호 방향 → 수업 초반 반드시 다루기",
    "최다은 질문: 5번 분자·분모 나누기 순서 → 개념 카드 활용",
    "황준서 질문: 9번 점화식 공비 찾기 → 수학 C반 초반 설명",
  ],
  individualNeed: [
    { studentName: "박재현", reason: "3회 연속 미제출 — 면담 또는 학부모 연락 필수" },
    { studentName: "강태윤", reason: "OCR 인식 불가 — 직접 검토 또는 재제출 요청" },
    { studentName: "이서아", reason: "부분 제출 + 속도 부족 — 심화 개별 설명 1회" },
  ],
  homeworkPriority: "이번 주 수학 A반 숙제는 유리화 집중 5문항으로 조정 권장 (분량 줄이고 핵심 유형 집중)",
};

// ─── 보조 인사이트 ────────────────────────────────────────────
export const issueInsights = {
  repeatNonSubmit: [
    { name: "박재현", className: "수학 A반", count: 3, lastNote: "면담 필요" },
    { name: "한지은", className: "수학 C반", count: 2, lastNote: "개별 확인" },
    { name: "류서준", className: "수학 C반", count: 2, lastNote: "개별 확인" },
  ],
  frequentQuestions: [
    { name: "박서연",  className: "수학 A반", count: 4, topic: "극한 계산" },
    { name: "황준서",  className: "수학 C반", count: 3, topic: "점화식 풀이" },
    { name: "이서아",  className: "수학 A반", count: 2, topic: "심화 파트" },
  ],
  examImminent: [
    { name: "박서연",  className: "수학 A반",  dDay: "D-19", subject: "수학",  urgency: "긴급" as const },
    { name: "이준혁",  className: "영어 B반",  dDay: "D-32", subject: "영어",  urgency: "중간" as const },
    { name: "수능대비반 A", className: "수능대비반", dDay: "D-15", subject: "수학", urgency: "높음" as const },
  ],
  delayRisk: [
    { name: "박서연", className: "수학 A반", delayUnit: "수열 극한 심화", weeks: 1 },
    { name: "수학 C반 전체", className: "수학 C반", delayUnit: "점화식 → 극한 연결", weeks: 0 },
  ],
  commonReinforcement: [
    { className: "수학 A반", concept: "∞ - ∞ 유리화",   urgency: "긴급" as const },
    { className: "수학 C반", concept: "점화식 → 일반항", urgency: "높음" as const },
    { className: "영어 B반", concept: "연결사 선택 오류", urgency: "중간" as const },
  ],
};
