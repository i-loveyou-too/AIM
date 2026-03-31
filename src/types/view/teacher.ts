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
