// 학생 리포트 목업 데이터
// 학생 상세 페이지(현재 상태·운영)와 달리,
// 리포트는 추이·분석·변화 흐름 중심으로 구성됨

// ─── 리포트 헤더 ──────────────────────────────────────────────
export const reportStudent = {
  id: "AIM_24005",
  name: "박서연",
  grade: "고2",
  subject: "수학",
  className: "수학 A반",
  school: "서울고등학교",
  reportPeriod: "2024.02.26 – 2024.03.25 (4주)",
  examDate: "2024-04-12",
  dDay: "D-19",
  overallStatus: "주의 필요" as const,
  summaryInsight:
    "최근 4주간 성취도가 완만하게 상승 중이나, 숙제 수행률 편차가 크고 수열 극한 단원 오답 패턴이 반복되고 있어 시험 전 집중 보완이 필요합니다.",
};

// ─── KPI 요약 카드 ────────────────────────────────────────────
export const reportKPIs = [
  {
    id: "achievement",
    label: "최근 성취도",
    value: "72점",
    change: "+5점",
    changeDir: "up" as const,
    note: "4주 전 대비 상승",
    tone: "brand" as const,
    icon: "📈",
  },
  {
    id: "progress",
    label: "진도 달성률",
    value: "68%",
    change: "계획 대비 -7%",
    changeDir: "down" as const,
    note: "3일 지연 상태",
    tone: "warm" as const,
    icon: "📚",
  },
  {
    id: "homework",
    label: "숙제 수행률",
    value: "74%",
    change: "-11%",
    changeDir: "down" as const,
    note: "지난 주 대비 하락",
    tone: "accent" as const,
    icon: "📝",
  },
  {
    id: "weakTopics",
    label: "반복 취약 단원",
    value: "4개",
    change: "2개 지속",
    changeDir: "neutral" as const,
    note: "극한·급수 반복 오답",
    tone: "soft" as const,
    icon: "⚠️",
  },
  {
    id: "examReadiness",
    label: "시험 준비도",
    value: "62%",
    change: "+3%",
    changeDir: "up" as const,
    note: "D-19, 보강 필요",
    tone: "alert" as const,
    icon: "🎯",
  },
  {
    id: "planStability",
    label: "계획 안정성",
    value: "보통",
    change: "1회 조정",
    changeDir: "neutral" as const,
    note: "최근 4주 기준",
    tone: "soft" as const,
    icon: "🗓️",
  },
];

// ─── 성취도 추이 (최근 8회차) ─────────────────────────────────
export type SessionScore = {
  session: string;
  date: string;
  score: number;
  note?: string;
};

export const achievementTrend: SessionScore[] = [
  { session: "1회차", date: "3/4",  score: 62, note: "수열 기초 단원" },
  { session: "2회차", date: "3/6",  score: 65 },
  { session: "3회차", date: "3/11", score: 61, note: "점화식 오답 다수" },
  { session: "4회차", date: "3/13", score: 67 },
  { session: "5회차", date: "3/18", score: 70, note: "등비수열 완성" },
  { session: "6회차", date: "3/20", score: 68 },
  { session: "7회차", date: "3/22", score: 72 },
  { session: "8회차", date: "3/25", score: 74, note: "극한 기초 진입" },
];

// ─── 숙제 수행률 추이 (최근 4주) ─────────────────────────────
export type WeeklyHomework = {
  week: string;
  completionRate: number;
  submitted: number;
  total: number;
  note?: string;
};

export const homeworkTrend: WeeklyHomework[] = [
  { week: "4주 전", completionRate: 80, submitted: 8,  total: 10 },
  { week: "3주 전", completionRate: 90, submitted: 9,  total: 10, note: "수행률 최고" },
  { week: "2주 전", completionRate: 75, submitted: 9,  total: 12 },
  { week: "지난 주", completionRate: 65, submitted: 8, total: 12, note: "미완료 4건" },
];

// ─── 진도 달성 / 계획 대비 ────────────────────────────────────
export const progressVsPlan = {
  totalUnits: 24,
  plannedUnits: 17,
  actualUnits: 16,
  plannedPercent: 71,
  actualPercent: 67,
  status: "소폭 지연" as const,
  currentUnit: "수열의 극한 — 극한값 계산",
  delayNote: "등비수열 심화에서 1회 추가 소요",
  weeklyBreakdown: [
    { week: "2/26 주", planned: 3, actual: 3, label: "3주 전" },
    { week: "3/4 주",  planned: 3, actual: 3, label: "2주 전" },
    { week: "3/11 주", planned: 4, actual: 3, label: "지난 주", note: "1단원 지연" },
    { week: "3/18 주", planned: 4, actual: 4, label: "이번 주" },
  ],
};

// ─── 취약 단원 분석 ───────────────────────────────────────────
export type WeakTopic = {
  topic: string;
  category: "계산" | "개념" | "서술" | "응용";
  severity: "높음" | "중간" | "낮음";
  frequency: number; // 오답 횟수
  lastOccurred: string;
  riskBeforeExam: boolean;
};

export const weakTopics: WeakTopic[] = [
  {
    topic: "분수형 극한값 계산",
    category: "계산",
    severity: "높음",
    frequency: 9,
    lastOccurred: "3/25",
    riskBeforeExam: true,
  },
  {
    topic: "∞ - ∞ 꼴 유리화",
    category: "계산",
    severity: "높음",
    frequency: 7,
    lastOccurred: "3/25",
    riskBeforeExam: true,
  },
  {
    topic: "수렴·발산 판별 서술",
    category: "서술",
    severity: "중간",
    frequency: 5,
    lastOccurred: "3/20",
    riskBeforeExam: true,
  },
  {
    topic: "등비수열 심화 적용",
    category: "응용",
    severity: "중간",
    frequency: 4,
    lastOccurred: "3/13",
    riskBeforeExam: false,
  },
];

export const repeatMistakePatterns = [
  { pattern: "분모 유리화 단계 생략", count: 6, type: "계산 실수" },
  { pattern: "부등식 방향 전환 누락 (음수 곱셈)", count: 4, type: "개념 혼동" },
  { pattern: "치환 후 범위 재설정 빠뜨림", count: 3, type: "절차 누락" },
  { pattern: "극한과 수렴 개념 혼용", count: 5, type: "개념 혼동" },
];

// ─── 시험 준비도 ──────────────────────────────────────────────
export const examReadiness = {
  examDate: "2024-04-12",
  dDay: "D-19",
  readinessScore: 62,   // 0–100
  targetScore: 85,      // 목표 점수
  currentEstimated: 72, // 현재 예상 점수
  remainingLessons: 6,
  remainingWeeks: 2.7,
  status: "주의 필요" as const,
  canReachTarget: false,
  reachableScore: 80,   // 현재 속도 기준 도달 가능 예상 점수
  reinforcementRequired: true,
  examCoverageReady: 68, // 시험 범위 준비 완료율 (%)
  checkItems: [
    { label: "핵심 단원 이해도",      done: true  },
    { label: "기출문제 풀이 완료",    done: false },
    { label: "서술형 대비 연습",      done: false },
    { label: "취약 단원 보강 완료",   done: false },
    { label: "오답 노트 정리",        done: true  },
    { label: "실전 모의 풀이 1회",    done: false },
  ],
};

// ─── 선생님 종합 코멘트 ───────────────────────────────────────
export const teacherComment = {
  strengths: [
    "기초 개념 이해 속도가 빠르고, 새 단원 진입 시 적응력이 좋음",
    "수업 중 질문 빈도가 높아지고 있어 학습 태도가 개선되는 중",
    "등비수열까지의 계산 정확도는 안정권에 진입함",
  ],
  concerns: [
    "극한 단원에서 분수·유리화 계산 실수가 반복 — 자동화 부족",
    "숙제 수행률이 지난 주 급락 (80% → 65%) — 외부 요인 파악 필요",
    "서술형 논리 전개가 아직 미숙 — 시험 출제 비중 고려 시 위험 요인",
  ],
  recentChange:
    "3주차부터 성취도가 완만하게 상승 추세로 전환됨. 다만 이번 주 숙제 완료율 하락은 주의 필요하며, 오답 패턴이 아직 반복되고 있어 개념 자동화 훈련을 강화해야 하는 시점입니다.",
  nextFocus:
    "D-19 시험까지 극한 계산 자동화(유리화·최고차항 분리)와 서술형 논리 전개 반복 연습에 집중. 기출 기반 실전 풀이 1–2회 추가 권장.",
};

// ─── 다음 관리 방향 ───────────────────────────────────────────
export const nextDirection = {
  nextLesson: "수열 극한 심화 + 급수 수렴 조건 — 오늘 오답 기반 도입 설명 필수",
  reinforcement: [
    "분수형 극한 계산 — 유형별 5문제 이상 반복 훈련",
    "∞ - ∞ 꼴 유리화 절차 칠판 직접 서술 연습",
    "서술형 수렴·발산 판별 논리 흐름 3회 이상 쓰기",
  ],
  homeworkDirection:
    "숙제 완료율 회복 목표 85% — 분량 조절보다 핵심 문제 압축 제시 (5–7문제 집중형)",
  explanationFocus: [
    "극한 계산 4가지 유형 — 순서·절차를 학생이 직접 말하게 유도",
    "발산·진동 구분 — 오개념 교정 반드시 짚기",
    "서술형 채점 기준 함께 보며 논리 흐름 명시화",
  ],
  priority: "시험 대비 계산 자동화 > 서술형 논리 훈련 > 숙제 수행률 안정화",
};

// ─── 최근 주요 이력 (미니 타임라인) ──────────────────────────
export const recentMilestones = [
  {
    date: "3/25",
    type: "수업" as const,
    title: "극한 기초 단원 진입",
    detail: "성취도 74점 — 최근 최고치",
  },
  {
    date: "3/22",
    type: "과제" as const,
    title: "숙제 수행률 회복 (72%)",
    detail: "미완료 3건 → 이번 주 제출 확인",
  },
  {
    date: "3/18",
    type: "수업" as const,
    title: "등비수열 완성 — 진도 재정상화",
    detail: "1주 지연 해소, 계획 복귀",
  },
  {
    date: "3/13",
    type: "피드백" as const,
    title: "분모 유리화 반복 실수 공식 피드백",
    detail: "칠판 서술 연습 후 오답률 소폭 개선",
  },
  {
    date: "3/6",
    type: "시험" as const,
    title: "단원 점검 테스트 — 65점",
    detail: "목표 75점 미달, 서술형 감점 집중",
  },
];
