export type StatusTone = "rose" | "gold" | "peach" | "soft";

export type TeacherDashboardSummaryCard = {
  label: string;
  value: string;
  note: string;
  tone: StatusTone;
  emoji: string;
  badge: string;
  href?: string;
};

export type TeacherDashboardClassInsight = {
  label: string;
  school: string;
  className: string;
  metricLabel: string;
  metricValue: string;
  delta: string;
  note: string;
  chartBars: number[];
  focusLabel: string;
  focusValue: string;
};

export type TeacherDashboardStudentInsight = {
  label: string;
  title: string;
  subtitle: string;
  students: Array<{
    id: string;
    name: string;
    className: string;
    badge: string;
    note: string;
  }>;
};

export type TeacherDashboardScheduleItem = {
  time: string;
  duration: string;
  title: string;
  student: string;
  memo: string;
  status: string;
  tone: "rose" | "gold" | "peach";
};

export type TeacherDashboardRecentActivityItem = {
  time: string;
  student: string;
  action: string;
  detail: string;
  kind?: "success" | "info" | "warning";
};

export type TeacherDashboardQuickActionItem = {
  label: string;
  description: string;
  tone: StatusTone;
  icon: string;
};

export type TeacherDashboardExamAlertSchool = {
  name: string;
  examName: string;
  examDate: string;
  daysLeft: number;
  overallProgress: number;
  classes: Array<{
    name: string;
    progress: number;
  }>;
};

export type TeacherDashboardOperationsStatus = {
  unavailable: boolean;
  imminent: number;
  openIssues: number;
  reviewCount: number;
};

export type TeacherDashboardPageData = {
  cardsError: boolean;
  cards: TeacherDashboardSummaryCard[];
  insightError: boolean;
  insightEmpty: boolean;
  classInsights: TeacherDashboardClassInsight[];
  studentInsight: TeacherDashboardStudentInsight | null;
  scheduleError: boolean;
  scheduleItems: TeacherDashboardScheduleItem[];
  recentItems: TeacherDashboardRecentActivityItem[];
  recentError: boolean;
  examSchools: TeacherDashboardExamAlertSchool[];
  operationsStatus: TeacherDashboardOperationsStatus;
  quickActionItems: TeacherDashboardQuickActionItem[];
};

export type TeacherStudentsPageStudentRecord = {
  id: string;
  studentCode: string;
  name: string;
  school: string;
  grade: string;
  className: string;
  subject: string;
  recentProgress: string;
  recentTag: string;
  score: number;
  examDays: number;
  nextExamDate: string | null;
  overdueAssignments: number;
  assignmentDone: number;
  assignmentTotal: number;
  assignmentRate: number;
  weakTopic: string;
  status: "상승" | "안정" | "주의" | "시험 임박";
  note: string;
};

export type TeacherStudentsPageData =
  | { status: "ok"; students: TeacherStudentsPageStudentRecord[] }
  | { status: "empty" }
  | { status: "error"; message: string };

export type TeacherReportsCardTone =
  | "brand"
  | "warm"
  | "accent"
  | "soft"
  | "success"
  | "alert";

export type TeacherReportsSummaryCard = {
  label: string;
  value: string;
  note: string;
  emoji: string;
  tone: TeacherReportsCardTone;
  badge: string;
};

export type TeacherReportsStudentItem = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  className: string;
  status: "양호" | "주의" | "위험" | "관리 필요";
  examReadiness: "양호" | "주의" | "위험";
  examUpcoming: boolean;
  dDay: string;
  achievement: number;
  homework: number;
  progress: number;
  lastUpdated: string;
  insight: string;
};

export type TeacherReportsClassItem = {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  examRisk: "양호" | "주의" | "위험";
  progressStability: "안정" | "보통" | "불안정";
  avgAchievement: number;
  avgHomework: number;
  avgProgress: number;
  achievementTrend: number[];
  homeworkTrend: number[];
  weakUnit: string;
  commonMistake: string;
  teachingPoint: string;
  focusStudentCount: number;
};

export type TeacherReportsExamReadinessStudent = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  examDate: string;
  dDay: number;
  riskLevel: "위험" | "주의" | "양호";
  readiness: number;
  onTrack: boolean;
  needsExtra: boolean;
  needsPlanAdjust: boolean;
  riskNote: string;
};

export type TeacherReportsExamReadinessClass = {
  id: string;
  name: string;
  examDate: string;
  dDay: number;
  riskLevel: "위험" | "주의" | "양호";
  avgReadiness: number;
  completionRisk: boolean;
  riskNote: string;
};

export type TeacherReportsPeriodKey = "1주" | "2주" | "4주" | "월간";

export type TeacherReportsPeriodDataPoint = {
  label: string;
  value: number;
};

export type TeacherReportsPeriodIssue = {
  type: "숙제" | "성취도" | "진도" | "시험" | string;
  severity: "high" | "medium" | "low";
  date: string;
  title: string;
};

export type TeacherReportsPeriodBlock = {
  achievementTrend: TeacherReportsPeriodDataPoint[];
  homeworkTrend: TeacherReportsPeriodDataPoint[];
  progressTrend: TeacherReportsPeriodDataPoint[];
  questionCount: TeacherReportsPeriodDataPoint[];
  missedCount: TeacherReportsPeriodDataPoint[];
  riskCount: TeacherReportsPeriodDataPoint[];
  issues: TeacherReportsPeriodIssue[];
};

export type TeacherReportsTabsData = {
  studentReports: TeacherReportsStudentItem[];
  classReports: TeacherReportsClassItem[];
  examReadinessStudents: TeacherReportsExamReadinessStudent[];
  examReadinessClasses: TeacherReportsExamReadinessClass[];
  periodReports: Partial<Record<TeacherReportsPeriodKey, TeacherReportsPeriodBlock>>;
};

export type TeacherReportsOverviewData = TeacherReportsTabsData & {
  summaryCards: TeacherReportsSummaryCard[];
};

export type TeacherReportsPageData = {
  overview: TeacherReportsOverviewData;
  loadFailed: boolean;
};

export type TeacherTodayLessonStatus = "집중 관리" | "정상" | "보강 필요" | "시험 임박";

export type TeacherTodayLessonsSummary = {
  totalLessons: number;
  focusStudents: number;
  homeworkIssues: number;
  teachingPoints: number;
  examImminentStudents: number;
};

export type TeacherTodayScheduleItem = {
  id: string;
  time: string;
  studentName: string;
  grade: string;
  subject: string;
  lessonType: string;
  todayGoal: string;
  examDate: string;
  dDay: string;
  status: TeacherTodayLessonStatus;
};

export type TeacherLessonPrep = {
  id: string;
  studentName: string;
  grade: string;
  subject: string;
  time: string;
  dDay: string;
  status: TeacherTodayLessonStatus;
  recentAchievement: "우수" | "보통" | "미흡";
  progress: {
    todayUnit: string;
    completedRange: string;
    targetRange: string;
    curriculumPosition: string;
    isDelayed: boolean;
    planComparison?: string;
    delayNote?: string;
  };
  explanation: {
    conceptType: string;
    keyConcepts: string[];
    confusionPoints: string[];
    misconceptions: string[];
  };
  materials: {
    priorityTag: string;
    mainTextbook: string;
    workbooks: string[];
    printouts: string[];
  };
  weaknesses: {
    weakUnits: string[];
    repeatMistakes: string[];
    todayFocusCheck: string[];
    attentionPoints: string[];
  };
  homework: {
    status: "완료" | "미완료" | "부분 완료";
    completionRate: number;
    warning?: string;
    errorTendencies: string[];
    homeworkBasedExplanation: string[];
  };
  lessonMemo: {
    preClassCheck: string[];
    questionPrompts: string[];
    nextLessonConnection: string;
  };
};

export type TeacherLessonNextAction = {
  lessonId: string;
  beforeClass: string[];
  duringClass: string[];
  afterClass: string[];
  nextLessonPrep: string[];
};

export type TeacherWeaknessOverviewItem = {
  studentName: string;
  grade: string;
  subject: string;
  urgency: "높음" | "중간";
  focusReason: string;
  overlappingWeakness: string;
  action: string;
};

export type TeacherHomeworkReflection = {
  criticalItems: Array<{
    studentName: string;
    subject: string;
    issue: string;
    actionRequired: string;
  }>;
  incompleteHomework: Array<{
    studentName: string;
    subject: string;
    completionRate: number;
  }>;
  commonReExplanation: string[];
  reinforcementNeeded: string[];
};

export type TeacherTodayMaterial = {
  id: string;
  subject: string;
  student: string;
  type: "교재" | "프린트" | "정리표" | "기출" | "링크";
  title: string;
  priority: "필수" | "참고";
  note?: string;
};

export type TeacherTodayLessonsOverviewData = {
  summary: TeacherTodayLessonsSummary;
  schedule: TeacherTodayScheduleItem[];
  preps: TeacherLessonPrep[];
  weaknessOverview: TeacherWeaknessOverviewItem[];
  homeworkReflection: TeacherHomeworkReflection;
  materials: TeacherTodayMaterial[];
  nextActions: TeacherLessonNextAction[];
};

export type TeacherTodayLessonsPageData = {
  overview: TeacherTodayLessonsOverviewData;
  loadFailed: boolean;
};

export type TeacherAssignmentViewTab = "class" | "student" | "unsubmitted" | "dueToday";
export type TeacherAssignmentCardId =
  | "active"
  | "dueToday"
  | "unsubmitted"
  | "questions"
  | "avgRate"
  | "reinforcement";

export type TeacherAssignmentsSummary = {
  activeAssignments: number;
  dueTodayCount: number;
  unsubmittedStudents: number;
  studentsWithQuestions: number;
  avgSubmissionRate: number;
  reinforcementNeeded: number;
};

export type TeacherClassAssignment = {
  id: string;
  className: string;
  subject: string;
  status: string;
  assignmentTitle: string;
  issuedDate: string;
  dueDate: string;
  studentCount: number;
  submittedCount: number;
  photoSubmissions: number;
  omrSubmissions: number;
  questionsCount: number;
  topMistakeTopic: string;
  repeatUnsubmitCount: number;
};

export type TeacherStudentSubmission = {
  id: string;
  classId: string;
  studentName: string;
  status: string;
  submissionType?: string | null;
  question?: string | null;
  submittedAt?: string | null;
  isRepeatNonSubmit?: boolean;
  needsReview?: boolean;
  ocrSummary?: string | null;
  omrResult?: Array<{
    questionNum: number;
    correct: boolean;
    studentAnswer: string;
    correctAnswer: string;
  }> | null;
  correctCount?: number;
  totalQuestions?: number;
};

export type TeacherCommonMistakeAnalysis = {
  classId: string;
  topMistakes: Array<{
    rank: number;
    questionNum: number;
    topic: string;
    mistakeType: string;
    incorrectCount: number;
  }>;
  weakConceptSummary: string[];
  repeatMistakePatterns: string[];
  explanationNeeded: string[];
  topQuestions: string[];
};

export type TeacherLessonReflection = {
  classId: string;
  urgency: string;
  reExplainTopics: string[];
  reinforcementItems: string[];
  individualFeedbackNeeded: Array<{ studentName: string; reason: string }>;
  questionReflectionItems: string[];
  homeworkFollowUp: string;
};

export type TeacherAssignmentInsights = {
  repeatNonSubmitStudents: Array<{ name: string; className: string; count: number }>;
  frequentQuestionStudents: Array<{
    name: string;
    className: string;
    questionCount: number;
    topic: string;
  }>;
  reinforcementPriority: Array<{ className: string; reason: string; urgency: string }>;
  recentOperationMemo: string;
};

export type TeacherAssignmentsOverviewData = {
  summary: TeacherAssignmentsSummary;
  classAssignments: TeacherClassAssignment[];
  studentSubmissions: TeacherStudentSubmission[];
  commonMistakeAnalyses: TeacherCommonMistakeAnalysis[];
  lessonReflections: TeacherLessonReflection[];
  assignmentInsights: TeacherAssignmentInsights;
};

export type TeacherAssignmentBoardHeader = {
  label: string;
  title: string;
};

export type TeacherAssignmentCardSelection = {
  activeCardId: TeacherAssignmentCardId | null;
  activeTab: TeacherAssignmentViewTab;
  status: string;
  hasQuestion: boolean | null;
};
