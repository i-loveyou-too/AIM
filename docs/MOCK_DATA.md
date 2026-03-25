# Aim ON Mock Data 형태 문서

기준일: 2026-03-25

이 문서는 현재 코드 기준으로 **모든 mock data export의 형태(필드 구조)**를 정리한 문서입니다.

## 파일 목록

- `src/lib/mock-data/core.ts`
- `src/lib/mock-data/dashboard.ts`
- `src/lib/mock-data/students.ts`
- `src/lib/student-detail-mock-data.ts`
- `src/lib/mock-data/student-report-mock-data.ts`
- `src/lib/mock-data/report-hub-mock-data.ts`
- `src/lib/mock-data/today-lessons.ts`
- `src/lib/curriculum-mock-data.ts`
- `src/lib/mock-data/assignment-mock-data.ts`
- `src/lib/mock-data/issue-mock-data.ts`
- `src/lib/mock-data/settings-mock-data.ts`
- `src/lib/mock-data/index.ts` (재-export 진입점)

---

## `src/lib/mock-data/core.ts`

### exports

- `teacherProfile`
- `SidebarChild`
- `SidebarMenuItem`
- `sidebarMenu`
- `sidebarNotice`

### 형태

```ts
export const teacherProfile: {
  name: string;
  role: string;
  initials: string;
  greetingName: string;
};

export type SidebarChild = {
  label: string;
  href: string;
};

export type SidebarMenuItem = {
  emoji: string;
  label: string;
  href?: string;
  children?: SidebarChild[];
};

export const sidebarMenu: SidebarMenuItem[];
export const sidebarNotice: string;
```

---

## `src/lib/mock-data/dashboard.ts`

### exports

- `summaryStats`
- `dashboardHero`
- `aiInsights`
- `examAlert`
- `examSchools`
- `todaySchedule`
- `recentActivity`
- `quickActions`
- `examHighlights`

### 형태 (코드 기준 추론)

```ts
type SummaryStat = {
  label: string;
  value: string;
  note: string;
  tone: "rose" | "gold" | "peach" | "soft";
  emoji: string;
  badge: string;
  href?: string;
};

export const summaryStats: SummaryStat[];

export const dashboardHero: {
  title: string;
  subtitle: string;
};

type ClassInsight = {
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

type StudentInsightItem = {
  name: string;
  className: string;
  badge: string;
  note: string;
};

export const aiInsights: {
  classInsights: ClassInsight[];
  studentInsight: {
    label: string;
    title: string;
    subtitle: string;
    students: StudentInsightItem[];
  };
};

export const examAlert: {
  label: string;
  title: string;
  subtitle: string;
  progress: number;
};

export const examSchools: Array<{
  name: string;
  examName: string;
  examDate: string;
  daysLeft: number;
  overallProgress: number;
  classes: Array<{
    name: string;
    progress: number;
  }>;
}>;

export const todaySchedule: Array<{
  time: string;
  duration: string;
  title: string;
  student: string;
  memo: string;
  status: string;
  tone: "rose" | "peach";
}>;

export const recentActivity: Array<{
  time: string;
  student: string;
  action: string;
  detail: string;
}>;

export const quickActions: Array<{
  label: string;
  description: string;
  tone: "rose" | "gold" | "peach" | "soft";
  icon: string;
}>;

export const examHighlights: Array<{
  name: string;
  subject: string;
  examDate: string;
  daysLeft: number;
  status: string;
  note: string;
}>;
```

---

## `src/lib/mock-data/students.ts`

### exports

- `StudentRecord`
- `students`
- `studentTotalCount`

### 형태

```ts
export type StudentRecord = {
  id: string;
  name: string;
  school: string;
  grade: string;
  className: string;
  subject: string;
  recentProgress: string;
  recentTag: string;
  score: number;
  examDays: number;
  overdueAssignments: number;
  assignmentDone: number;
  assignmentTotal: number;
  weakTopic: string;
  status: "상승" | "주의" | "시험 임박" | "안정";
  note: string;
};

export const students: StudentRecord[];
export const studentTotalCount: number;
```

---

## `src/lib/student-detail-mock-data.ts`

### exports

- `StudentDetailCard`
- `StudentDetailData`
- `getStudentDetailById(id: string)`

### 형태

```ts
type Tone = "rose" | "gold" | "peach" | "soft";

export type StudentDetailCard = {
  label: string;
  value: string;
  note: string;
  tone: Tone;
  badge: string;
};

export type StudentDetailData = {
  student: StudentRecord;
  goalScore: number;
  currentLevel: string;
  examDate: string;
  dDayLabel: string;
  studyti: {
    summary: string;
    tags: string[];
    ctaLabel: string;
  };
  learningGoal: {
    summary: string;
    scoreBoostLabel: string;
    targetScoreLabel: string;
    admissionTrack: string;
    targetUniversity: string;
    focusLabel: string;
  };
  aiInsight: {
    progressReport: {
      statusLabel: string;
      currentChapterLabel: string;
      currentChapter: string;
      progressRate: number;
      nextGoal: string;
      completeDate: string;
      smartInsight: string;
    };
    weakAnalysis: Array<{
      title: string;
      description: string;
      statusLabel: string;
      tone: Tone;
      accuracyLabel: string;
      progressRate: number;
    }>;
    clinicRecommendation: {
      title: string;
      subtitle: string;
      ctaLabel: string;
    };
  };
  managementStatus: string;
  managementTone: Tone;
  managementNote: string;
  sectionCards: StudentDetailCard[];
  progress: {
    recentUnit: string;
    completedUnits: string[];
    currentUnit: string;
    delayStatus: string;
    progressRate: number;
    progressBars: number[];
    progressNote: string;
  };
  exam: {
    examDate: string;
    remainingDays: string;
    planRate: number;
    planStatus: string;
    planNote: string;
    reversePlanPosition: string;
    reversePlanNote: string;
    statusLabel: string;
    statusTone: Tone;
  };
  assignments: {
    completionRate: number;
    completionText: string;
    riskText: string;
    items: Array<{
      title: string;
      status: "완료" | "미완료";
      due: string;
      note: string;
      score: string;
    }>;
  };
  weaknesses: {
    topics: string[];
    repeatMistakes: string[];
    attentionFlags: string[];
    note: string;
  };
  feedback: {
    summary: string;
    attitude: string;
    supplement: string;
    nextCheck: string;
    note: string;
  };
  nextActions: Array<{
    label: string;
    description: string;
    tone: Tone;
  }>;
  timeline: Array<{
    time: string;
    title: string;
    detail: string;
    kind: "success" | "info" | "warning";
  }>;
};

export function getStudentDetailById(id: string): StudentDetailData | null;
```

### 내부 조합 데이터(참고)

- `subjectProfiles` (과목별 기본 상세 프로필)
- `statusProfiles` (학생 상태별 관리 프로필)
- `detailOverrides` (학생별 예외 목표/시험일/입시 트랙)

---

## `src/lib/mock-data/student-report-mock-data.ts`

### exports

- `reportStudent`
- `reportKPIs`
- `SessionScore`
- `achievementTrend`
- `WeeklyHomework`
- `homeworkTrend`
- `progressVsPlan`
- `WeakTopic`
- `weakTopics`
- `repeatMistakePatterns`
- `examReadiness`
- `teacherComment`
- `nextDirection`
- `recentMilestones`

### 형태

```ts
export const reportStudent: {
  id: string;
  name: string;
  grade: string;
  subject: string;
  className: string;
  school: string;
  reportPeriod: string;
  examDate: string;
  dDay: string;
  overallStatus: "주의 필요";
  summaryInsight: string;
};

type ReportKpi = {
  id: string;
  label: string;
  value: string;
  change: string;
  changeDir: "up" | "down" | "neutral";
  note: string;
  tone: "brand" | "warm" | "accent" | "soft" | "alert";
  icon: string;
};

export const reportKPIs: ReportKpi[];

export type SessionScore = {
  session: string;
  date: string;
  score: number;
  note?: string;
};

export const achievementTrend: SessionScore[];

export type WeeklyHomework = {
  week: string;
  completionRate: number;
  submitted: number;
  total: number;
  note?: string;
};

export const homeworkTrend: WeeklyHomework[];

export const progressVsPlan: {
  totalUnits: number;
  plannedUnits: number;
  actualUnits: number;
  plannedPercent: number;
  actualPercent: number;
  status: "소폭 지연";
  currentUnit: string;
  delayNote: string;
  weeklyBreakdown: Array<{
    week: string;
    planned: number;
    actual: number;
    label: string;
    note?: string;
  }>;
};

export type WeakTopic = {
  topic: string;
  category: "계산" | "개념" | "서술" | "응용";
  severity: "높음" | "중간" | "낮음";
  frequency: number;
  lastOccurred: string;
  riskBeforeExam: boolean;
};

export const weakTopics: WeakTopic[];

export const repeatMistakePatterns: Array<{
  pattern: string;
  count: number;
  type: string;
}>;

export const examReadiness: {
  examDate: string;
  dDay: string;
  readinessScore: number;
  targetScore: number;
  currentEstimated: number;
  remainingLessons: number;
  remainingWeeks: number;
  status: "주의 필요";
  canReachTarget: boolean;
  reachableScore: number;
  reinforcementRequired: boolean;
  examCoverageReady: number;
  checkItems: Array<{
    label: string;
    done: boolean;
  }>;
};

export const teacherComment: {
  strengths: string[];
  concerns: string[];
  recentChange: string;
  nextFocus: string;
};

export const nextDirection: {
  nextLesson: string;
  reinforcement: string[];
  homeworkDirection: string;
  explanationFocus: string[];
  priority: string;
};

export const recentMilestones: Array<{
  date: string;
  type: "수업" | "과제" | "피드백" | "시험";
  title: string;
  detail: string;
}>;
```

---

## `src/lib/mock-data/report-hub-mock-data.ts`

### exports

- `ReportHubSummaryCard`
- `reportHubSummaryCards`
- `StudentReportItem`
- `studentReports`
- `ClassReportItem`
- `classReports`
- `ExamReadinessStudent`
- `examReadinessStudents`
- `ExamReadinessClass`
- `examReadinessClasses`
- `PeriodDataPoint`
- `PeriodReportData`
- `periodReports`

### 형태

```ts
export type ReportHubSummaryCard = {
  label: string;
  value: string;
  note: string;
  emoji: string;
  tone: "brand" | "warm" | "accent" | "soft" | "success" | "alert";
  badge: string;
};

export const reportHubSummaryCards: ReportHubSummaryCard[];

export type StudentReportItem = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  className: string;
  achievement: number;
  homework: number;
  progress: number;
  examReadiness: "양호" | "주의" | "위험";
  insight: string;
  lastUpdated: string;
  status: "양호" | "주의" | "위험" | "관리 필요";
  examDate: string;
  dDay: string;
  examUpcoming: boolean;
};

export const studentReports: StudentReportItem[];

export type ClassReportItem = {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  avgAchievement: number;
  avgHomework: number;
  avgProgress: number;
  weakUnit: string;
  commonMistake: string;
  examRisk: "양호" | "주의" | "위험";
  focusStudentCount: number;
  teachingPoint: string;
  progressStability: "안정" | "보통" | "불안정";
  achievementTrend: number[];
  homeworkTrend: number[];
};

export const classReports: ClassReportItem[];

export type ExamReadinessStudent = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  examDate: string;
  dDay: number;
  readiness: number;
  riskLevel: "양호" | "주의" | "위험";
  onTrack: boolean;
  needsExtra: boolean;
  needsPlanAdjust: boolean;
  riskNote: string;
};

export const examReadinessStudents: ExamReadinessStudent[];

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

export const examReadinessClasses: ExamReadinessClass[];

export type PeriodDataPoint = {
  label: string;
  value: number;
};

export type PeriodReportData = {
  period: "1주" | "2주" | "4주" | "월간";
  achievementTrend: PeriodDataPoint[];
  homeworkTrend: PeriodDataPoint[];
  progressTrend: PeriodDataPoint[];
  questionCount: PeriodDataPoint[];
  missedCount: PeriodDataPoint[];
  riskCount: PeriodDataPoint[];
  issues: Array<{
    date: string;
    title: string;
    type: "숙제" | "성취도" | "진도" | "시험";
    severity: "high" | "medium" | "low";
  }>;
};

export const periodReports: Record<string, PeriodReportData>;
```

---

## `src/lib/mock-data/today-lessons.ts`

### exports

- `todayLessonsSummary`
- `LessonStatus`
- `LessonScheduleItem`
- `todaySchedule`
- `HomeworkStatus`
- `AchievementLevel`
- `LessonPrep`
- `todayLessonsPrep`
- `weaknessOverview`
- `homeworkReflection`
- `todayMaterials`
- `LessonNextActions`
- `lessonNextActions`

### 형태

```ts
export const todayLessonsSummary: {
  totalLessons: number;
  focusStudents: number;
  homeworkIssues: number;
  teachingPoints: number;
  examImminentStudents: number;
};

export type LessonStatus = "집중 관리" | "정상" | "보강 필요" | "시험 임박";

export type LessonScheduleItem = {
  id: string;
  time: string;
  studentName: string;
  grade: string;
  subject: string;
  lessonType: string;
  todayGoal: string;
  examDate: string;
  dDay: string;
  status: LessonStatus;
};

export const todaySchedule: LessonScheduleItem[];

export type HomeworkStatus = "완료" | "미완료" | "부분 완료";
export type AchievementLevel = "우수" | "보통" | "미흡";

export type LessonPrep = {
  id: string;
  studentName: string;
  grade: string;
  subject: string;
  time: string;
  examDate: string;
  dDay: string;
  recentAchievement: AchievementLevel;
  status: LessonStatus;
  progress: {
    todayUnit: string;
    curriculumPosition: string;
    completedRange: string;
    targetRange: string;
    planComparison: string;
    isDelayed: boolean;
    delayNote?: string;
  };
  explanation: {
    keyConcepts: string[];
    confusionPoints: string[];
    conceptType: string;
    misconceptions: string[];
  };
  materials: {
    mainTextbook: string;
    workbooks: string[];
    printouts: string[];
    priorityTag: string;
  };
  weaknesses: {
    weakUnits: string[];
    repeatMistakes: string[];
    attentionPoints: string[];
    todayFocusCheck: string[];
  };
  homework: {
    status: HomeworkStatus;
    completionRate: number;
    errorTendencies: string[];
    reflectionPoints: string[];
    homeworkBasedExplanation: string[];
    warning?: string;
  };
  lessonMemo: {
    preClassCheck: string[];
    questionPrompts: string[];
    postClassNote: string;
    nextLessonConnection: string;
  };
};

export const todayLessonsPrep: LessonPrep[];

export const weaknessOverview: Array<{
  studentName: string;
  grade: string;
  subject: string;
  focusReason: string;
  overlappingWeakness: string;
  action: string;
  urgency: "높음" | "중간";
}>;

export const homeworkReflection: {
  criticalItems: Array<{
    studentName: string;
    subject: string;
    issue: string;
    actionRequired: string;
  }>;
  incompleteHomework: Array<{
    studentName: string;
    completionRate: number;
    subject: string;
  }>;
  commonReExplanation: string[];
  reinforcementNeeded: string[];
};

export const todayMaterials: Array<{
  id: string;
  title: string;
  type: "교재" | "프린트" | "정리표";
  subject: string;
  student: string;
  priority: "필수" | "참고";
  note: string;
}>;

export type LessonNextActions = {
  lessonId: string;
  studentName: string;
  beforeClass: string[];
  duringClass: string[];
  afterClass: string[];
  nextLessonPrep: string[];
};

export const lessonNextActions: LessonNextActions[];
```

---

## `src/lib/curriculum-mock-data.ts`

### exports

- `CurriculumTone`
- `CurriculumSummaryCard`
- `CurriculumCalendarTone`
- `CurriculumCalendarItem`
- `CurriculumSubtopic`
- `CurriculumRoadmapItem`
- `CurriculumActionItem`
- `CurriculumRiskItem`
- `CurriculumNoteItem`
- `CurriculumPageData`
- `curriculumPageData`
- `curriculumClasses`

### 형태

```ts
export type CurriculumTone = "brand" | "warm" | "accent" | "soft" | "success" | "alert";

export type CurriculumSummaryCard = {
  label: string;
  value: string;
  note: string;
  emoji: string;
  badge: string;
  tone: CurriculumTone;
};

export type CurriculumCalendarTone = "today" | "lesson" | "boost" | "check" | "exam";

export type CurriculumCalendarItem = {
  date: string;
  label: string;
  title: string;
  note: string;
  tone: CurriculumCalendarTone;
};

export type CurriculumSubtopic = {
  title: string;
  progress: number;
  statusLabel: string;
  note?: string;
};

export type CurriculumRoadmapItem = {
  title: string;
  period: string;
  statusLabel: string;
  tone: CurriculumTone;
  plannedProgress: number;
  actualProgress: number;
  lessonNote: string;
  assignmentNote: string;
  commonMistakeNote: string;
  reinforcementNote: string;
  canFinishBeforeExam: string;
  badges: string[];
  subtopics: CurriculumSubtopic[];
};

export type CurriculumActionItem = {
  title: string;
  description: string;
  tone: CurriculumTone;
};

export type CurriculumRiskItem = {
  title: string;
  reason: string;
  target: string;
  severity: "높음" | "중간" | "낮음";
  nextStep: string;
};

export type CurriculumNoteItem = {
  title: string;
  detail: string;
  reason: string;
};

export type CurriculumPageData = {
  overview: {
    school: string;
    className: string;
    subject: string;
    examDate: string;
    currentDate: string;
    dDay: string;
    remainingLessons: number;
    totalLessons: number;
    totalUnits: number;
    plannedProgress: number;
    actualProgress: number;
    planStatus: string;
    delayUnits: number;
    reinforcementUnits: number;
    completionChance: string;
    currentPlannedPosition: string;
    currentActualPosition: string;
    finishEstimate: string;
    nextCheckpoint: string;
  };
  summaryCards: CurriculumSummaryCard[];
  reversePlan: {
    totalPeriod: string;
    totalUnits: number;
    remainingUnits: number;
    remainingLessons: number;
    weeklyTarget: string;
    algorithmTarget: string;
    actualTarget: string;
    gapSummary: string;
    paceSummary: string;
    completionEstimate: string;
    focusUnit: string;
    nextCheckpoint: string;
  };
  calendar: {
    monthLabel: string;
    periodLabel: string;
    note: string;
    items: CurriculumCalendarItem[];
  };
  comparison: {
    totalUnits: number;
    plannedUnits: number;
    actualUnits: number;
    plannedPercent: number;
    actualPercent: number;
    plannedMilestone: string;
    actualMilestone: string;
    goalMilestone: string;
    finishEstimate: string;
    gapSummary: string;
    canFinishBeforeExam: string;
    markers: Array<{
      label: string;
      value: string;
      tone: CurriculumTone;
    }>;
  };
  roadmap: CurriculumRoadmapItem[];
  nextActions: {
    nextUnit: string;
    objective: string;
    keyConcepts: string[];
    homeworkReflection: string[];
    commonMistakes: string[];
    reinforcementTargets: string[];
    preClassChecks: string[];
    buttons: string[];
  };
  risks: {
    highestRisk: string;
    summary: string;
    items: CurriculumRiskItem[];
  };
  notes: {
    memoTitle: string;
    memoSummary: string;
    items: CurriculumNoteItem[];
  };
};

export const curriculumPageData: CurriculumPageData;

export const curriculumClasses: Array<{
  id: string;
  label: string;
  grade: string;
  subject: string;
  data: CurriculumPageData;
}>;
```

---

## `src/lib/mock-data/assignment-mock-data.ts`

### exports

- `ViewTab`
- `assignmentSummary`
- `AssignmentStatus`
- `SubmissionType`
- `ClassAssignment`
- `classAssignments`
- `SubmitStatus`
- `OmrItem`
- `StudentSubmission`
- `studentSubmissions`
- `TopMistake`
- `CommonMistakeAnalysis`
- `commonMistakeAnalyses`
- `LessonReflection`
- `lessonReflections`
- `assignmentInsights`

### 형태

```ts
export type ViewTab = "class" | "student" | "unsubmitted" | "dueToday";

export const assignmentSummary: {
  activeAssignments: number;
  dueTodayCount: number;
  unsubmittedStudents: number;
  studentsWithQuestions: number;
  avgSubmissionRate: number;
  reinforcementNeeded: number;
};

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

export const classAssignments: ClassAssignment[];

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

export const studentSubmissions: StudentSubmission[];

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

export const commonMistakeAnalyses: CommonMistakeAnalysis[];

export type LessonReflection = {
  classId: string;
  urgency: "높음" | "중간" | "낮음";
  reExplainTopics: string[];
  reinforcementItems: string[];
  individualFeedbackNeeded: Array<{
    studentName: string;
    reason: string;
  }>;
  questionReflectionItems: string[];
  homeworkFollowUp: string;
};

export const lessonReflections: LessonReflection[];

export const assignmentInsights: {
  repeatNonSubmitStudents: Array<{
    name: string;
    className: string;
    count: number;
    lastNote: string;
  }>;
  frequentQuestionStudents: Array<{
    name: string;
    className: string;
    questionCount: number;
    topic: string;
  }>;
  reinforcementPriority: Array<{
    className: string;
    reason: string;
    urgency: "높음" | "중간" | "낮음";
  }>;
  recentOperationMemo: string;
};
```

---

## `src/lib/mock-data/issue-mock-data.ts`

### exports

- `IssueType`
- `IssueUrgency`
- `IssueStatus`
- `IssueAction`
- `Issue`
- `IssueDetail`
- `UnsubmittedDetail`
- `ExamImmimentDetail`
- `ProgressDelayDetail`
- `QuestionDetail`
- `OcrReviewDetail`
- `CommonMistakeDetail`
- `FocusMgmtDetail`
- `issueSummary`
- `issues`
- `lessonReflectionIssues`
- `issueInsights`

### 형태

```ts
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
export type IssueStatus = "미확인" | "확인됨" | "처리 완료";

export type IssueAction = {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

export type Issue = {
  id: string;
  type: IssueType;
  urgency: IssueUrgency;
  status: IssueStatus;
  studentName?: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  occurredAt: string;
  actions: IssueAction[];
  detail: IssueDetail;
};

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

export type IssueDetail =
  | UnsubmittedDetail
  | ExamImmimentDetail
  | ProgressDelayDetail
  | QuestionDetail
  | OcrReviewDetail
  | CommonMistakeDetail
  | FocusMgmtDetail;

export const issueSummary: {
  unreadCount: number;
  urgentTodayCount: number;
  examImminentCount: number;
  assignmentIssueCount: number;
  lessonReflectionCount: number;
  focusStudentCount: number;
};

export const issues: Issue[];

export const lessonReflectionIssues: {
  reExplainNow: string[];
  questionItems: string[];
  individualNeed: Array<{
    studentName: string;
    reason: string;
  }>;
  homeworkPriority: string;
};

export const issueInsights: {
  repeatNonSubmit: Array<{
    name: string;
    className: string;
    count: number;
    lastNote: string;
  }>;
  frequentQuestions: Array<{
    name: string;
    className: string;
    count: number;
    topic: string;
  }>;
  examImminent: Array<{
    name: string;
    className: string;
    dDay: string;
    subject: string;
    urgency: "긴급" | "높음" | "중간";
  }>;
  delayRisk: Array<{
    name: string;
    className: string;
    delayUnit: string;
    weeks: number;
  }>;
  commonReinforcement: Array<{
    className: string;
    concept: string;
    urgency: "긴급" | "높음" | "중간";
  }>;
};
```

---

## `src/lib/mock-data/settings-mock-data.ts`

### exports

- `settingsProfile`
- `NotificationSetting`
- `notificationSettings`
- `reportSettings`
- `lessonSettings`
- `assignmentSettings`
- `basicInfoSettings`

### 형태

```ts
export const settingsProfile: {
  name: string;
  affiliation: string;
  role: string;
  email: string;
  phone: string;
  joined: string;
};

export type NotificationSetting = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const notificationSettings: NotificationSetting[];

export const reportSettings: {
  defaultPeriod: "1주" | "2주" | "4주";
  defaultView: "학생별" | "반별";
  examEmphasisDDay: "D-7" | "D-14" | "D-21";
};

export const lessonSettings: {
  defaultDuration: "60분" | "90분" | "120분";
  showNextAction: boolean;
  showLessonMemo: boolean;
  todayPageInfoScope: "전체" | "요약만";
};

export const assignmentSettings: {
  defaultDeadlineTime: string;
  allowPhotoSubmit: boolean;
  allowOMRSubmit: boolean;
  questionEnabled: boolean;
  ocrReviewHighlight: boolean;
  commonMistakeAlert: boolean;
};

export const basicInfoSettings: {
  classes: Array<{
    name: string;
    subject: string;
    studentCount: number;
    examDate: string;
  }>;
  subjects: string[];
  examScheduleLinked: boolean;
  curriculumTemplateLinked: boolean;
};
```

---

## `src/lib/mock-data/index.ts`

### exports

```ts
export * from "./core";
export * from "./dashboard";
export * from "./students";
```

참고: `index.ts`는 현재 `core/dashboard/students`만 재-export합니다. 나머지 mock data 파일은 직접 경로 import로 사용 중입니다.

---

## 문서 유지 규칙

- mock data export를 추가/삭제/리네임하면 이 문서의 해당 파일 섹션을 즉시 갱신합니다.
- 타입이 없는 `const`는 코드 기준 추론 타입을 함께 유지합니다.
- 페이지 라우트 변경 시 `core.ts`의 사이드바 링크와 실제 페이지 anchor/query 사용 여부를 함께 점검합니다.
