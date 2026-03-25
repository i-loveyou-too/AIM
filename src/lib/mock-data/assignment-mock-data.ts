// 과제 관리 페이지 목업 데이터
// 반별 과제 운영 → 학생별 제출 상태 → 분석 → 다음 수업 반영 흐름

// ─── 보기 탭 타입 ─────────────────────────────────────────────
export type ViewTab = "class" | "student" | "unsubmitted" | "dueToday";

// ─── 상단 요약 KPI ────────────────────────────────────────────
export const assignmentSummary = {
  activeAssignments: 8,
  dueTodayCount: 3,
  unsubmittedStudents: 11,
  studentsWithQuestions: 6,
  avgSubmissionRate: 74,
  reinforcementNeeded: 4,
};

// ─── 반/수업 목록 ──────────────────────────────────────────────
export type AssignmentStatus = "진행 중" | "마감 임박" | "검토 완료" | "보강 필요";
export type SubmissionType = "사진 제출" | "OMR 제출" | null;

export type ClassAssignment = {
  id: string;
  className: string;
  subject: string;
  studentCount: number;
  assignmentTitle: string;
  issuedDate: string;
  dueDate: string;
  submittedCount: number;
  photoSubmissions: number;
  omrSubmissions: number;
  questionsCount: number;
  status: AssignmentStatus;
  topMistakeTopic: string;
  repeatUnsubmitCount: number;
};

export const classAssignments: ClassAssignment[] = [
  {
    id: "ca-1",
    className: "수학 A반",
    subject: "수학",
    studentCount: 8,
    assignmentTitle: "수열의 극한 — 기본 계산 20문항",
    issuedDate: "3/22",
    dueDate: "3/25",
    submittedCount: 6,
    photoSubmissions: 4,
    omrSubmissions: 2,
    questionsCount: 3,
    status: "보강 필요",
    topMistakeTopic: "∞ - ∞ 꼴 유리화",
    repeatUnsubmitCount: 1,
  },
  {
    id: "ca-2",
    className: "영어 B반",
    subject: "영어",
    studentCount: 6,
    assignmentTitle: "빈칸 추론 유형 A — 12지문",
    issuedDate: "3/23",
    dueDate: "3/26",
    submittedCount: 5,
    photoSubmissions: 2,
    omrSubmissions: 3,
    questionsCount: 2,
    status: "진행 중",
    topMistakeTopic: "연결사 선택 오류",
    repeatUnsubmitCount: 0,
  },
  {
    id: "ca-3",
    className: "수능대비반 A",
    subject: "수학",
    studentCount: 5,
    assignmentTitle: "미적분 실전 모의 — 15문항",
    issuedDate: "3/20",
    dueDate: "3/24",
    submittedCount: 5,
    photoSubmissions: 1,
    omrSubmissions: 4,
    questionsCount: 1,
    status: "검토 완료",
    topMistakeTopic: "치환 적분 범위 재설정",
    repeatUnsubmitCount: 0,
  },
  {
    id: "ca-4",
    className: "수학 C반",
    subject: "수학",
    studentCount: 7,
    assignmentTitle: "등비수열 심화 + 점화식 — 15문항",
    issuedDate: "3/24",
    dueDate: "3/27",
    submittedCount: 3,
    photoSubmissions: 3,
    omrSubmissions: 0,
    questionsCount: 4,
    status: "마감 임박",
    topMistakeTopic: "점화식 → 일반항 유도",
    repeatUnsubmitCount: 2,
  },
];

// ─── 학생별 제출 상태 ─────────────────────────────────────────
export type SubmitStatus = "완료" | "미완료" | "부분 완료";

export type OmrItem = {
  questionNum: number;
  studentAnswer: string;
  correctAnswer: string;
  correct: boolean;
};

export type StudentSubmission = {
  id: string;
  classId: string;
  studentName: string;
  status: SubmitStatus;
  submittedAt?: string;
  submissionType: SubmissionType;
  ocrSummary?: string;
  omrResult?: OmrItem[];
  correctCount?: number;
  totalQuestions?: number;
  question?: string;
  isRepeatNonSubmit: boolean;
  needsReview: boolean;
};

export const studentSubmissions: StudentSubmission[] = [
  // ── 수학 A반 (ca-1)
  {
    id: "ss-1",
    classId: "ca-1",
    studentName: "박서연",
    status: "완료",
    submittedAt: "3/25 14:32",
    submissionType: "사진 제출",
    ocrSummary: "20문항 중 14문항 풀이 확인. 분수형 극한 계산 3문항 오답, 유리화 과정 생략 패턴.",
    question: "7번 문제에서 ∞ - ∞ 형태를 유리화할 때 부호 방향이 헷갈려요. 다음 수업에서 다시 한번 풀어주실 수 있을까요?",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-2",
    classId: "ca-1",
    studentName: "이민준",
    status: "완료",
    submittedAt: "3/25 16:10",
    submissionType: "OMR 제출",
    omrResult: [
      { questionNum: 1,  studentAnswer: "②", correctAnswer: "②", correct: true  },
      { questionNum: 2,  studentAnswer: "③", correctAnswer: "③", correct: true  },
      { questionNum: 3,  studentAnswer: "①", correctAnswer: "④", correct: false },
      { questionNum: 4,  studentAnswer: "②", correctAnswer: "②", correct: true  },
      { questionNum: 5,  studentAnswer: "⑤", correctAnswer: "③", correct: false },
      { questionNum: 6,  studentAnswer: "③", correctAnswer: "③", correct: true  },
      { questionNum: 7,  studentAnswer: "②", correctAnswer: "④", correct: false },
      { questionNum: 8,  studentAnswer: "①", correctAnswer: "①", correct: true  },
      { questionNum: 9,  studentAnswer: "④", correctAnswer: "④", correct: true  },
      { questionNum: 10, studentAnswer: "③", correctAnswer: "②", correct: false },
    ],
    correctCount: 6,
    totalQuestions: 10,
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-3",
    classId: "ca-1",
    studentName: "김지원",
    status: "완료",
    submittedAt: "3/25 20:15",
    submissionType: "사진 제출",
    ocrSummary: "20문항 전체 제출. 풀이 과정 깔끔. 14~17번 극한값 계산 오답 집중.",
    isRepeatNonSubmit: false,
    needsReview: false,
  },
  {
    id: "ss-4",
    classId: "ca-1",
    studentName: "최다은",
    status: "완료",
    submittedAt: "3/25 22:08",
    submissionType: "OMR 제출",
    omrResult: [
      { questionNum: 1,  studentAnswer: "②", correctAnswer: "②", correct: true  },
      { questionNum: 2,  studentAnswer: "①", correctAnswer: "③", correct: false },
      { questionNum: 3,  studentAnswer: "④", correctAnswer: "④", correct: true  },
      { questionNum: 4,  studentAnswer: "③", correctAnswer: "②", correct: false },
      { questionNum: 5,  studentAnswer: "①", correctAnswer: "③", correct: false },
    ],
    correctCount: 2,
    totalQuestions: 5,
    question: "5번이 왜 ①이 아닌지 이해가 안 돼요. 분자 분모를 같이 나누는 거 아닌가요?",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-5",
    classId: "ca-1",
    studentName: "강태윤",
    status: "완료",
    submittedAt: "3/26 08:30",
    submissionType: "사진 제출",
    ocrSummary: "20문항 사진 3장 제출. OCR 인식률 낮음 — 손글씨 흐릿. 직접 검토 필요.",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-6",
    classId: "ca-1",
    studentName: "오하린",
    status: "완료",
    submittedAt: "3/25 19:00",
    submissionType: "사진 제출",
    ocrSummary: "풀이 전반 안정적. 10번, 15번 부등식 방향 전환 오답.",
    isRepeatNonSubmit: false,
    needsReview: false,
  },
  {
    id: "ss-7",
    classId: "ca-1",
    studentName: "박재현",
    status: "미완료",
    submissionType: null,
    isRepeatNonSubmit: true,
    needsReview: false,
  },
  {
    id: "ss-8",
    classId: "ca-1",
    studentName: "이서아",
    status: "부분 완료",
    submittedAt: "3/25 23:50",
    submissionType: "사진 제출",
    ocrSummary: "20문항 중 12문항만 사진 제출. 나머지 미완성 상태로 제출.",
    question: "13번부터 시간이 부족해서 못 풀었어요. 이 유형 따로 설명 가능한가요?",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  // ── 수학 C반 (ca-4)
  {
    id: "ss-9",
    classId: "ca-4",
    studentName: "신유진",
    status: "완료",
    submittedAt: "3/24 21:00",
    submissionType: "사진 제출",
    ocrSummary: "점화식 유도 파트 오답 3개. 등비수열 적용은 안정적.",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-10",
    classId: "ca-4",
    studentName: "황준서",
    status: "완료",
    submittedAt: "3/24 18:40",
    submissionType: "사진 제출",
    ocrSummary: "전체 15문항 제출. 심화 문제 오답 집중.",
    question: "9번 점화식에서 공비를 어떻게 찾는 건지 모르겠어요.",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-11",
    classId: "ca-4",
    studentName: "임채원",
    status: "완료",
    submittedAt: "3/24 20:00",
    submissionType: "사진 제출",
    ocrSummary: "전반 무난. 14번 응용 문제 오답.",
    isRepeatNonSubmit: false,
    needsReview: false,
  },
  {
    id: "ss-12",
    classId: "ca-4",
    studentName: "한지은",
    status: "미완료",
    submissionType: null,
    isRepeatNonSubmit: true,
    needsReview: false,
  },
  {
    id: "ss-13",
    classId: "ca-4",
    studentName: "류서준",
    status: "미완료",
    submissionType: null,
    isRepeatNonSubmit: true,
    needsReview: false,
  },
  {
    id: "ss-14",
    classId: "ca-4",
    studentName: "정다연",
    status: "부분 완료",
    submittedAt: "3/25 01:00",
    submissionType: "사진 제출",
    ocrSummary: "10문항까지만 제출.",
    question: "11번 이후 심화 파트 어디서부터 공부해야 할지 모르겠어요.",
    isRepeatNonSubmit: false,
    needsReview: true,
  },
  {
    id: "ss-15",
    classId: "ca-4",
    studentName: "권민혁",
    status: "미완료",
    submissionType: null,
    isRepeatNonSubmit: false,
    needsReview: false,
  },
];

// ─── 공통 오답 분석 ───────────────────────────────────────────
export type TopMistake = {
  rank: number;
  questionNum: number;
  topic: string;
  mistakeType: string;
  incorrectCount: number;
  totalStudents: number;
};

export type CommonMistakeAnalysis = {
  classId: string;
  topMistakes: TopMistake[];
  weakConceptSummary: string[];
  repeatMistakePatterns: string[];
  explanationNeeded: string[];
  topQuestions: string[];
};

export const commonMistakeAnalyses: CommonMistakeAnalysis[] = [
  {
    classId: "ca-1",
    topMistakes: [
      { rank: 1, questionNum: 7,  topic: "∞ - ∞ 꼴 유리화",           mistakeType: "계산 실수",  incorrectCount: 5, totalStudents: 6 },
      { rank: 2, questionNum: 3,  topic: "분수형 극한값 계산",          mistakeType: "절차 누락",  incorrectCount: 4, totalStudents: 6 },
      { rank: 3, questionNum: 10, topic: "최고차항 분리 극한",          mistakeType: "개념 혼동",  incorrectCount: 3, totalStudents: 6 },
      { rank: 4, questionNum: 15, topic: "부등식 방향 전환 (음수 곱셈)", mistakeType: "개념 혼동",  incorrectCount: 3, totalStudents: 6 },
      { rank: 5, questionNum: 5,  topic: "수렴·발산 판별",             mistakeType: "서술 오류",  incorrectCount: 2, totalStudents: 6 },
    ],
    weakConceptSummary: [
      "유리화 절차 — 분자·분모 동시 곱셈 후 약분 과정 자동화 필요",
      "최고차항 분리 — 분모 최고차항으로 나누는 순서 이해 부족",
      "부등식 음수 곱셈 시 방향 전환 — 반복 실수",
    ],
    repeatMistakePatterns: [
      "분모 유리화 단계 생략",
      "부등식 방향 전환 누락 (음수 곱셈)",
      "치환 후 범위 재설정 빠뜨림",
    ],
    explanationNeeded: [
      "∞ - ∞ 꼴 유리화 절차 — 칠판 직접 서술 반복",
      "최고차항 분리법 4단계 — 순서 카드 활용 권장",
      "부등식 방향 전환 규칙 — 개념 교정 후 재확인 문제 풀기",
    ],
    topQuestions: [
      "7번: ∞ - ∞ 유리화할 때 부호 방향",
      "5번: 분자 분모를 같이 나누는 순서",
      "13번 이후 시간 부족 — 속도 훈련 필요",
    ],
  },
  {
    classId: "ca-4",
    topMistakes: [
      { rank: 1, questionNum: 9,  topic: "점화식 → 일반항 유도",    mistakeType: "절차 누락",  incorrectCount: 4, totalStudents: 3 },
      { rank: 2, questionNum: 12, topic: "등비수열 공비 계산",       mistakeType: "계산 실수",  incorrectCount: 3, totalStudents: 3 },
      { rank: 3, questionNum: 14, topic: "수열 심화 응용",           mistakeType: "개념 혼동",  incorrectCount: 2, totalStudents: 3 },
      { rank: 4, questionNum: 6,  topic: "점화식 초기 조건 설정",    mistakeType: "개념 혼동",  incorrectCount: 2, totalStudents: 3 },
      { rank: 5, questionNum: 15, topic: "극한값 연결 응용",         mistakeType: "서술 오류",  incorrectCount: 2, totalStudents: 3 },
    ],
    weakConceptSummary: [
      "점화식 풀이 절차 — 초기 조건 설정부터 일반항까지 흐름 이해 부족",
      "등비수열 공비 계산 — 기계적 적용 수준 미달",
    ],
    repeatMistakePatterns: [
      "점화식 → 일반항 변환 절차 혼동",
      "등비수열 공비를 분수로 표현할 때 부호 오류",
    ],
    explanationNeeded: [
      "점화식 풀이 3단계 절차 — 순서대로 칠판 연습",
      "등비수열 공비 계산 반복 훈련",
    ],
    topQuestions: [
      "9번: 점화식에서 공비 찾는 법",
      "11번 이후 심화 파트 접근 방법",
    ],
  },
];

// ─── 다음 수업 반영 포인트 ────────────────────────────────────
export type LessonReflection = {
  classId: string;
  urgency: "높음" | "중간" | "낮음";
  reExplainTopics: string[];
  reinforcementItems: string[];
  individualFeedbackNeeded: { studentName: string; reason: string }[];
  questionReflectionItems: string[];
  homeworkFollowUp: string;
};

export const lessonReflections: LessonReflection[] = [
  {
    classId: "ca-1",
    urgency: "높음",
    reExplainTopics: [
      "∞ - ∞ 꼴 유리화 절차 — 7번 기반 재풀이",
      "최고차항 분리법 4단계 — 칠판 순서 연습",
      "수렴·발산 서술형 논리 흐름",
    ],
    reinforcementItems: [
      "분수형 극한 5문항 추가 — 유형별 반복",
      "부등식 방향 전환 집중 3문제",
      "풀이 속도 훈련 — 마지막 5문항 타이머 적용",
    ],
    individualFeedbackNeeded: [
      { studentName: "박재현",  reason: "반복 미제출 — 제출 독려 + 이유 확인 필요" },
      { studentName: "이서아",  reason: "부분 제출 — 13번 이후 개념 미흡, 개별 설명 필요" },
      { studentName: "강태윤",  reason: "OCR 인식 불가 — 직접 검토 또는 재제출 요청" },
    ],
    questionReflectionItems: [
      "박서연 질문 — 7번 ∞ - ∞ 유리화 방향 수업 초반 반드시 다루기",
      "최다은 질문 — 5번 분자·분모 나누기 순서 개념 정리",
    ],
    homeworkFollowUp: "다음 숙제는 분량 줄이고 핵심 유형 5–7문항 집중 제시",
  },
  {
    classId: "ca-4",
    urgency: "중간",
    reExplainTopics: [
      "점화식 풀이 3단계 절차",
      "등비수열 공비 계산 반복 훈련",
    ],
    reinforcementItems: [
      "점화식 → 일반항 5문항 집중 반복",
      "공비 분수형 계산 2–3문제 추가",
    ],
    individualFeedbackNeeded: [
      { studentName: "한지은", reason: "반복 미제출 2회 — 이유 확인 필요" },
      { studentName: "류서준", reason: "반복 미제출 2회 — 이유 확인 필요" },
      { studentName: "정다연", reason: "부분 제출 — 심화 파트 접근법 개별 안내" },
    ],
    questionReflectionItems: [
      "황준서 질문 — 9번 점화식 공비 찾기 수업 중 다루기",
      "정다연 질문 — 11번 이후 심화 접근법 안내",
    ],
    homeworkFollowUp: "미제출 2명 다음 수업 전 제출 완료 확인 후 진행",
  },
];

// ─── 보조 인사이트 ────────────────────────────────────────────
export const assignmentInsights = {
  repeatNonSubmitStudents: [
    { name: "박재현", className: "수학 A반", count: 3, lastNote: "연락 필요" },
    { name: "한지은", className: "수학 C반", count: 2, lastNote: "다음 수업 확인" },
    { name: "류서준", className: "수학 C반", count: 2, lastNote: "다음 수업 확인" },
  ],
  frequentQuestionStudents: [
    { name: "박서연",  className: "수학 A반", questionCount: 4, topic: "극한 계산 유형" },
    { name: "황준서",  className: "수학 C반", questionCount: 3, topic: "점화식 풀이" },
    { name: "정다연",  className: "수학 C반", questionCount: 2, topic: "심화 파트 접근" },
  ],
  reinforcementPriority: [
    { className: "수학 A반", reason: "∞ - ∞ 유리화 오답률 83%", urgency: "높음" as const },
    { className: "수학 C반", reason: "점화식 → 일반항 오답률 높음",  urgency: "중간" as const },
    { className: "영어 B반", reason: "연결사 선택 반복 오류",         urgency: "낮음" as const },
  ],
  recentOperationMemo:
    "이번 주 수학 A반 과제 오답률이 예상보다 높아 다음 수업에서 유리화 재설명을 최우선으로 배치. 수학 C반 미제출 학생 2명 개별 연락 필요.",
};
