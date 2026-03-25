// 리포트 허브 mock data
// 학생별 / 반별 / 시험 대비 / 기간별 4개 탭에서 공통으로 사용

// ── 상단 요약 카드 ─────────────────────────────────────────────────────
export type ReportHubSummaryCard = {
  label: string;
  value: string;
  note: string;
  emoji: string;
  tone: "brand" | "warm" | "accent" | "soft" | "success" | "alert";
  badge: string;
};

export const reportHubSummaryCards: ReportHubSummaryCard[] = [
  {
    label: "전체 학생 평균 성취도",
    value: "78%",
    note: "지난 4주 기준 평균 / 전월 대비 +3%p",
    emoji: "📊",
    tone: "brand",
    badge: "+3%p",
  },
  {
    label: "평균 숙제 수행률",
    value: "83%",
    note: "제출 완료 기준 / 미제출 학생 4명",
    emoji: "📝",
    tone: "success",
    badge: "양호",
  },
  {
    label: "평균 진도 달성률",
    value: "71%",
    note: "계획 대비 실제 완료 단원 비율",
    emoji: "📈",
    tone: "accent",
    badge: "주의",
  },
  {
    label: "시험 임박 학생",
    value: "6명",
    note: "D-14 이내 시험 예정 / 즉시 확인 필요",
    emoji: "📅",
    tone: "alert",
    badge: "즉시 확인",
  },
  {
    label: "집중 관리 필요 학생",
    value: "4명",
    note: "성취도 60% 미만 또는 숙제 미제출 3회 이상",
    emoji: "⚠️",
    tone: "warm",
    badge: "위험",
  },
  {
    label: "계획 대비 위험 반",
    value: "2개",
    note: "진도 달성률 65% 미만 반 기준",
    emoji: "🏫",
    tone: "soft",
    badge: "점검 필요",
  },
];

// ── 학생별 리포트 (탭 1) ───────────────────────────────────────────────
export type StudentReportItem = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  className: string;
  achievement: number;       // %
  homework: number;          // %
  progress: number;          // %
  examReadiness: "양호" | "주의" | "위험";
  insight: string;           // 한 줄 요약 인사이트
  lastUpdated: string;
  status: "양호" | "주의" | "위험" | "관리 필요";
  examDate: string;
  dDay: string;
  examUpcoming: boolean;
};

export const studentReports: StudentReportItem[] = [
  {
    id: "1",
    name: "김지수",
    grade: "고2",
    subject: "수학",
    className: "고2 수학 A반",
    achievement: 88,
    homework: 95,
    progress: 85,
    examReadiness: "양호",
    insight: "최근 2주간 성취도 꾸준히 상승 중. 수열 단원 마무리 후 확통으로 넘어갈 적기.",
    lastUpdated: "2026.03.24",
    status: "양호",
    examDate: "2026.04.05",
    dDay: "D-11",
    examUpcoming: true,
  },
  {
    id: "2",
    name: "박도현",
    grade: "고1",
    subject: "영어",
    className: "고1 영어 B반",
    achievement: 62,
    homework: 70,
    progress: 58,
    examReadiness: "위험",
    insight: "숙제 미제출 3회 연속, 독해 정확도 60% 미만. 다음 수업 전 집중 점검 필요.",
    lastUpdated: "2026.03.22",
    status: "관리 필요",
    examDate: "2026.04.08",
    dDay: "D-14",
    examUpcoming: true,
  },
  {
    id: "3",
    name: "이서연",
    grade: "중3",
    subject: "국어",
    className: "중3 국어 A반",
    achievement: 79,
    homework: 88,
    progress: 75,
    examReadiness: "양호",
    insight: "비문학 지문 이해도 향상. 문학 파트 추가 연습 권장.",
    lastUpdated: "2026.03.23",
    status: "양호",
    examDate: "2026.04.15",
    dDay: "D-21",
    examUpcoming: false,
  },
  {
    id: "4",
    name: "최민준",
    grade: "고2",
    subject: "수학",
    className: "고2 수학 A반",
    achievement: 54,
    homework: 60,
    progress: 50,
    examReadiness: "위험",
    insight: "함수 단원 이해도 낮음. 핵심 개념 재설명 및 보강 수업 필요.",
    lastUpdated: "2026.03.21",
    status: "위험",
    examDate: "2026.04.05",
    dDay: "D-11",
    examUpcoming: true,
  },
  {
    id: "5",
    name: "정하은",
    grade: "고1",
    subject: "영어",
    className: "고1 영어 B반",
    achievement: 91,
    homework: 98,
    progress: 92,
    examReadiness: "양호",
    insight: "전 영역 균형 잡힌 성취. 이번 시험 고득점 기대.",
    lastUpdated: "2026.03.24",
    status: "양호",
    examDate: "2026.04.08",
    dDay: "D-14",
    examUpcoming: true,
  },
  {
    id: "6",
    name: "윤재원",
    grade: "중3",
    subject: "과학",
    className: "중3 과학 C반",
    achievement: 73,
    homework: 80,
    progress: 68,
    examReadiness: "주의",
    insight: "물리 파트 오답률 높음. 에너지 단원 추가 문제 풀기 권장.",
    lastUpdated: "2026.03.22",
    status: "주의",
    examDate: "2026.04.20",
    dDay: "D-26",
    examUpcoming: false,
  },
  {
    id: "7",
    name: "강소영",
    grade: "고2",
    subject: "수학",
    className: "고2 수학 A반",
    achievement: 82,
    homework: 85,
    progress: 80,
    examReadiness: "양호",
    insight: "최근 미적분 파트 성취도 상승. 현재 속도 유지 시 계획 내 완주 가능.",
    lastUpdated: "2026.03.24",
    status: "양호",
    examDate: "2026.04.05",
    dDay: "D-11",
    examUpcoming: true,
  },
  {
    id: "8",
    name: "임태현",
    grade: "중2",
    subject: "수학",
    className: "중2 수학 D반",
    achievement: 66,
    homework: 72,
    progress: 60,
    examReadiness: "주의",
    insight: "연립방정식 오답 패턴 반복. 유형별 집중 연습 필요.",
    lastUpdated: "2026.03.20",
    status: "주의",
    examDate: "2026.04.25",
    dDay: "D-31",
    examUpcoming: false,
  },
];

// ── 반별 리포트 (탭 2) ────────────────────────────────────────────────
export type ClassReportItem = {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  avgAchievement: number;    // %
  avgHomework: number;       // %
  avgProgress: number;       // %
  weakUnit: string;          // 공통 취약 단원
  commonMistake: string;     // 공통 오답 유형
  examRisk: "양호" | "주의" | "위험";
  focusStudentCount: number; // 집중 관리 필요 학생 수
  teachingPoint: string;     // 공통 재설명 포인트
  progressStability: "안정" | "보통" | "불안정";
  // 추이 데이터 (최근 4주)
  achievementTrend: number[];
  homeworkTrend: number[];
};

export const classReports: ClassReportItem[] = [
  {
    id: "c1",
    name: "고2 수학 A반",
    subject: "수학",
    studentCount: 8,
    avgAchievement: 76,
    avgHomework: 82,
    avgProgress: 72,
    weakUnit: "수열과 극한",
    commonMistake: "극한값 계산 부호 실수",
    examRisk: "주의",
    focusStudentCount: 2,
    teachingPoint: "등비수열 점화식 풀이 과정 재정리 필요",
    progressStability: "보통",
    achievementTrend: [68, 72, 74, 76],
    homeworkTrend: [75, 80, 83, 82],
  },
  {
    id: "c2",
    name: "고1 영어 B반",
    subject: "영어",
    studentCount: 6,
    avgAchievement: 81,
    avgHomework: 88,
    avgProgress: 85,
    weakUnit: "빈칸 추론",
    commonMistake: "주제문 선택지 오독",
    examRisk: "양호",
    focusStudentCount: 1,
    teachingPoint: "빈칸 앞뒤 문맥 연결 훈련 추가",
    progressStability: "안정",
    achievementTrend: [76, 78, 80, 81],
    homeworkTrend: [85, 87, 88, 88],
  },
  {
    id: "c3",
    name: "중3 국어 A반",
    subject: "국어",
    studentCount: 7,
    avgAchievement: 74,
    avgHomework: 83,
    avgProgress: 70,
    weakUnit: "현대시 감상",
    commonMistake: "시어 함축 의미 파악 오류",
    examRisk: "주의",
    focusStudentCount: 2,
    teachingPoint: "화자의 정서 파악 방법 재설명 필요",
    progressStability: "보통",
    achievementTrend: [70, 71, 73, 74],
    homeworkTrend: [80, 82, 83, 83],
  },
  {
    id: "c4",
    name: "중3 과학 C반",
    subject: "과학",
    studentCount: 5,
    avgAchievement: 61,
    avgHomework: 74,
    avgProgress: 58,
    weakUnit: "전기와 자기",
    commonMistake: "플레밍 법칙 방향 혼동",
    examRisk: "위험",
    focusStudentCount: 3,
    teachingPoint: "전자기 유도 개념 및 방향 판별 집중 보강",
    progressStability: "불안정",
    achievementTrend: [65, 63, 60, 61],
    homeworkTrend: [78, 76, 73, 74],
  },
  {
    id: "c5",
    name: "중2 수학 D반",
    subject: "수학",
    studentCount: 6,
    avgAchievement: 69,
    avgHomework: 76,
    avgProgress: 63,
    weakUnit: "일차함수와 그래프",
    commonMistake: "기울기-y절편 혼동",
    examRisk: "주의",
    focusStudentCount: 2,
    teachingPoint: "함수 그래프 직접 그리기 연습 추가",
    progressStability: "보통",
    achievementTrend: [65, 67, 68, 69],
    homeworkTrend: [72, 74, 75, 76],
  },
];

// ── 시험 대비 리포트 (탭 3) ───────────────────────────────────────────
export type ExamReadinessStudent = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  examDate: string;
  dDay: number;
  readiness: number;         // % 0~100
  riskLevel: "양호" | "주의" | "위험";
  onTrack: boolean;          // 현재 속도로 목표 도달 가능 여부
  needsExtra: boolean;       // 보강 필요
  needsPlanAdjust: boolean;  // 계획 조정 필요
  riskNote: string;
};

export const examReadinessStudents: ExamReadinessStudent[] = [
  {
    id: "2",
    name: "박도현",
    grade: "고1",
    subject: "영어",
    examDate: "2026.04.08",
    dDay: 14,
    readiness: 48,
    riskLevel: "위험",
    onTrack: false,
    needsExtra: true,
    needsPlanAdjust: true,
    riskNote: "현재 속도 유지 시 시험 전 60% 수준에 그칠 것으로 예상",
  },
  {
    id: "4",
    name: "최민준",
    grade: "고2",
    subject: "수학",
    examDate: "2026.04.05",
    dDay: 11,
    readiness: 42,
    riskLevel: "위험",
    onTrack: false,
    needsExtra: true,
    needsPlanAdjust: true,
    riskNote: "미완료 단원 4개, 현재 진도로는 2단원만 추가 완주 가능",
  },
  {
    id: "6",
    name: "윤재원",
    grade: "중3",
    subject: "과학",
    examDate: "2026.04.20",
    dDay: 26,
    readiness: 63,
    riskLevel: "주의",
    onTrack: false,
    needsExtra: true,
    needsPlanAdjust: false,
    riskNote: "물리 파트 미완료 3개, 계획 조정 없이 완주 가능성 낮음",
  },
  {
    id: "8",
    name: "임태현",
    grade: "중2",
    subject: "수학",
    examDate: "2026.04.25",
    dDay: 31,
    readiness: 61,
    riskLevel: "주의",
    onTrack: true,
    needsExtra: false,
    needsPlanAdjust: false,
    riskNote: "현재 속도 유지 시 시험 전 완주 가능. 오답 유형 집중 필요",
  },
  {
    id: "1",
    name: "김지수",
    grade: "고2",
    subject: "수학",
    examDate: "2026.04.05",
    dDay: 11,
    readiness: 84,
    riskLevel: "양호",
    onTrack: true,
    needsExtra: false,
    needsPlanAdjust: false,
    riskNote: "계획 대비 정상 진행 중. 마무리 확인 정도만 필요",
  },
  {
    id: "5",
    name: "정하은",
    grade: "고1",
    subject: "영어",
    examDate: "2026.04.08",
    dDay: 14,
    readiness: 92,
    riskLevel: "양호",
    onTrack: true,
    needsExtra: false,
    needsPlanAdjust: false,
    riskNote: "목표 수준 초과. 고난도 지문 추가 연습 권장",
  },
];

export type ExamReadinessClass = {
  id: string;
  name: string;
  subject: string;
  examDate: string;
  dDay: number;
  avgReadiness: number;
  riskLevel: "양호" | "주의" | "위험";
  completionRisk: boolean;
  riskNote: string;
};

export const examReadinessClasses: ExamReadinessClass[] = [
  {
    id: "c4",
    name: "중3 과학 C반",
    subject: "과학",
    examDate: "2026.04.20",
    dDay: 26,
    avgReadiness: 55,
    riskLevel: "위험",
    completionRisk: true,
    riskNote: "평균 진도 58%. 3명 보강 필요. 계획 전면 조정 검토 요망",
  },
  {
    id: "c1",
    name: "고2 수학 A반",
    subject: "수학",
    examDate: "2026.04.05",
    dDay: 11,
    avgReadiness: 68,
    riskLevel: "주의",
    completionRisk: false,
    riskNote: "D-11 기준 목표 점수 달성 가능하나 2명 집중 보강 필요",
  },
  {
    id: "c2",
    name: "고1 영어 B반",
    subject: "영어",
    examDate: "2026.04.08",
    dDay: 14,
    avgReadiness: 82,
    riskLevel: "양호",
    completionRisk: false,
    riskNote: "계획 대비 정상 범위. 빈칸 추론 파트 마무리 집중 권장",
  },
];

// ── 기간별 리포트 (탭 4) ──────────────────────────────────────────────
export type PeriodDataPoint = { label: string; value: number };

export type PeriodReportData = {
  period: "1주" | "2주" | "4주" | "월간";
  achievementTrend: PeriodDataPoint[];
  homeworkTrend: PeriodDataPoint[];
  progressTrend: PeriodDataPoint[];
  questionCount: PeriodDataPoint[];
  missedCount: PeriodDataPoint[];
  riskCount: PeriodDataPoint[];
  issues: { date: string; title: string; type: "숙제" | "성취도" | "진도" | "시험"; severity: "high" | "medium" | "low" }[];
};

export const periodReports: Record<string, PeriodReportData> = {
  "1주": {
    period: "1주",
    achievementTrend: [
      { label: "월", value: 75 },
      { label: "화", value: 76 },
      { label: "수", value: 77 },
      { label: "목", value: 78 },
      { label: "금", value: 78 },
    ],
    homeworkTrend: [
      { label: "월", value: 80 },
      { label: "화", value: 82 },
      { label: "수", value: 83 },
      { label: "목", value: 83 },
      { label: "금", value: 83 },
    ],
    progressTrend: [
      { label: "월", value: 68 },
      { label: "화", value: 69 },
      { label: "수", value: 70 },
      { label: "목", value: 71 },
      { label: "금", value: 71 },
    ],
    questionCount: [
      { label: "월", value: 12 },
      { label: "화", value: 8 },
      { label: "수", value: 15 },
      { label: "목", value: 10 },
      { label: "금", value: 7 },
    ],
    missedCount: [
      { label: "월", value: 3 },
      { label: "화", value: 2 },
      { label: "수", value: 4 },
      { label: "목", value: 2 },
      { label: "금", value: 1 },
    ],
    riskCount: [
      { label: "월", value: 5 },
      { label: "화", value: 5 },
      { label: "수", value: 4 },
      { label: "목", value: 4 },
      { label: "금", value: 4 },
    ],
    issues: [
      { date: "03.18", title: "박도현 숙제 3회 연속 미제출", type: "숙제", severity: "high" },
      { date: "03.20", title: "중3 과학 C반 평균 성취도 60% 미만 기록", type: "성취도", severity: "high" },
      { date: "03.22", title: "최민준 함수 단원 재테스트 필요", type: "진도", severity: "medium" },
      { date: "03.24", title: "고2 수학 A반 D-11 시험 최종 점검 시작", type: "시험", severity: "medium" },
    ],
  },
  "2주": {
    period: "2주",
    achievementTrend: [
      { label: "1주차", value: 74 },
      { label: "2주차", value: 76 },
      { label: "3주차", value: 77 },
      { label: "이번 주", value: 78 },
    ],
    homeworkTrend: [
      { label: "1주차", value: 79 },
      { label: "2주차", value: 81 },
      { label: "3주차", value: 83 },
      { label: "이번 주", value: 83 },
    ],
    progressTrend: [
      { label: "1주차", value: 64 },
      { label: "2주차", value: 67 },
      { label: "3주차", value: 70 },
      { label: "이번 주", value: 71 },
    ],
    questionCount: [
      { label: "1주차", value: 38 },
      { label: "2주차", value: 44 },
      { label: "3주차", value: 52 },
      { label: "이번 주", value: 52 },
    ],
    missedCount: [
      { label: "1주차", value: 8 },
      { label: "2주차", value: 7 },
      { label: "3주차", value: 9 },
      { label: "이번 주", value: 12 },
    ],
    riskCount: [
      { label: "1주차", value: 6 },
      { label: "2주차", value: 5 },
      { label: "3주차", value: 5 },
      { label: "이번 주", value: 4 },
    ],
    issues: [
      { date: "03.10", title: "임태현 연립방정식 오답 패턴 재발", type: "성취도", severity: "medium" },
      { date: "03.12", title: "중3 과학 C반 진도 목표 미달", type: "진도", severity: "high" },
      { date: "03.14", title: "고1 영어 B반 빈칸 추론 집중 보강 시작", type: "진도", severity: "low" },
      { date: "03.18", title: "박도현 숙제 3회 연속 미제출", type: "숙제", severity: "high" },
      { date: "03.20", title: "중3 과학 C반 평균 성취도 60% 미만 기록", type: "성취도", severity: "high" },
      { date: "03.22", title: "최민준 함수 단원 재테스트 필요", type: "진도", severity: "medium" },
    ],
  },
  "4주": {
    period: "4주",
    achievementTrend: [
      { label: "4주 전", value: 71 },
      { label: "3주 전", value: 73 },
      { label: "2주 전", value: 76 },
      { label: "지난 주", value: 77 },
      { label: "이번 주", value: 78 },
    ],
    homeworkTrend: [
      { label: "4주 전", value: 75 },
      { label: "3주 전", value: 78 },
      { label: "2주 전", value: 81 },
      { label: "지난 주", value: 83 },
      { label: "이번 주", value: 83 },
    ],
    progressTrend: [
      { label: "4주 전", value: 58 },
      { label: "3주 전", value: 63 },
      { label: "2주 전", value: 67 },
      { label: "지난 주", value: 70 },
      { label: "이번 주", value: 71 },
    ],
    questionCount: [
      { label: "4주 전", value: 31 },
      { label: "3주 전", value: 35 },
      { label: "2주 전", value: 44 },
      { label: "지난 주", value: 52 },
      { label: "이번 주", value: 52 },
    ],
    missedCount: [
      { label: "4주 전", value: 5 },
      { label: "3주 전", value: 6 },
      { label: "2주 전", value: 8 },
      { label: "지난 주", value: 9 },
      { label: "이번 주", value: 12 },
    ],
    riskCount: [
      { label: "4주 전", value: 7 },
      { label: "3주 전", value: 6 },
      { label: "2주 전", value: 5 },
      { label: "지난 주", value: 5 },
      { label: "이번 주", value: 4 },
    ],
    issues: [
      { date: "02.24", title: "최민준 수학 성취도 40%대 첫 기록", type: "성취도", severity: "high" },
      { date: "03.03", title: "중3 과학 C반 진도 지연 첫 감지", type: "진도", severity: "medium" },
      { date: "03.10", title: "임태현 연립방정식 오답 패턴 재발", type: "성취도", severity: "medium" },
      { date: "03.12", title: "중3 과학 C반 진도 목표 미달", type: "진도", severity: "high" },
      { date: "03.18", title: "박도현 숙제 3회 연속 미제출", type: "숙제", severity: "high" },
      { date: "03.20", title: "중3 과학 C반 평균 성취도 60% 미만 기록", type: "성취도", severity: "high" },
    ],
  },
  "월간": {
    period: "월간",
    achievementTrend: [
      { label: "12월", value: 66 },
      { label: "1월", value: 70 },
      { label: "2월", value: 73 },
      { label: "3월", value: 78 },
    ],
    homeworkTrend: [
      { label: "12월", value: 71 },
      { label: "1월", value: 75 },
      { label: "2월", value: 79 },
      { label: "3월", value: 83 },
    ],
    progressTrend: [
      { label: "12월", value: 50 },
      { label: "1월", value: 58 },
      { label: "2월", value: 65 },
      { label: "3월", value: 71 },
    ],
    questionCount: [
      { label: "12월", value: 110 },
      { label: "1월", value: 138 },
      { label: "2월", value: 162 },
      { label: "3월", value: 186 },
    ],
    missedCount: [
      { label: "12월", value: 18 },
      { label: "1월", value: 22 },
      { label: "2월", value: 28 },
      { label: "3월", value: 34 },
    ],
    riskCount: [
      { label: "12월", value: 9 },
      { label: "1월", value: 7 },
      { label: "2월", value: 6 },
      { label: "3월", value: 4 },
    ],
    issues: [
      { date: "12월", title: "전반적 성취도 낮은 학기 초반 패턴 확인", type: "성취도", severity: "medium" },
      { date: "1월", title: "중3 과학 C반 편성 후 진도 관리 시작", type: "진도", severity: "medium" },
      { date: "2월", title: "최민준 집중 관리 대상 지정", type: "성취도", severity: "high" },
      { date: "3월", title: "전체 숙제 수행률 80%대 첫 달성", type: "숙제", severity: "low" },
    ],
  },
};
