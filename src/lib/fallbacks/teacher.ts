import type {
  TeacherAssignmentInsights,
  TeacherAssignmentsOverviewData,
  TeacherAssignmentsSummary,
  TeacherDashboardQuickActionItem,
  TeacherHomeworkReflection,
  TeacherReportsOverviewData,
  TeacherTodayLessonsOverviewData,
} from "@/types/view/teacher";

export const UNKNOWN_EXAM_DAYS = 9999;

export const TEACHER_DASHBOARD_QUICK_ACTIONS: TeacherDashboardQuickActionItem[] = [
  { label: "학생 목록", description: "학생 목록에서 상태와 과제 진행을 확인합니다.", tone: "rose", icon: "👤" },
  { label: "반 목록", description: "반별 평균 점수와 커리큘럼 상태를 확인합니다.", tone: "gold", icon: "🏫" },
  { label: "오늘 수업", description: "오늘 수업 일정과 제출 현황을 확인합니다.", tone: "peach", icon: "🕒" },
  { label: "리포트", description: "학생/반 리포트 화면으로 이동해 추이를 점검합니다.", tone: "soft", icon: "📊" },
];

export const TEACHER_STUDENTS_PAGE_MESSAGES = {
  emptyTitle: "학생 데이터가 없습니다",
  emptyDescription: "`/api/teacher/students` 응답이 비어 있습니다. DB seed 또는 VIEW 결과를 확인해 주세요.",
  errorTitle: "학생 목록을 불러오지 못했습니다",
  errorDescription: "`/api/teacher/students` 연결 상태를 확인해 주세요.",
};

export const TEACHER_REPORTS_OVERVIEW_FALLBACK: TeacherReportsOverviewData = {
  summaryCards: [],
  studentReports: [],
  classReports: [],
  examReadinessStudents: [],
  examReadinessClasses: [],
  periodReports: {},
};

const TEACHER_TODAY_LESSONS_HOMEWORK_REFLECTION_FALLBACK: TeacherHomeworkReflection = {
  criticalItems: [],
  incompleteHomework: [],
  commonReExplanation: [],
  reinforcementNeeded: [],
};

export const TEACHER_TODAY_LESSONS_OVERVIEW_FALLBACK: TeacherTodayLessonsOverviewData = {
  summary: {
    totalLessons: 0,
    focusStudents: 0,
    homeworkIssues: 0,
    teachingPoints: 0,
    examImminentStudents: 0,
  },
  schedule: [],
  preps: [],
  weaknessOverview: [],
  homeworkReflection: TEACHER_TODAY_LESSONS_HOMEWORK_REFLECTION_FALLBACK,
  materials: [],
  nextActions: [],
};

export const TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK: TeacherAssignmentsSummary = {
  activeAssignments: 0,
  dueTodayCount: 0,
  unsubmittedStudents: 0,
  studentsWithQuestions: 0,
  avgSubmissionRate: 0,
  reinforcementNeeded: 0,
};

export const TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK: TeacherAssignmentInsights = {
  repeatNonSubmitStudents: [],
  frequentQuestionStudents: [],
  reinforcementPriority: [],
  recentOperationMemo: "운영 메모 데이터가 없습니다.",
};

export const TEACHER_ASSIGNMENTS_OVERVIEW_FALLBACK: TeacherAssignmentsOverviewData = {
  summary: TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK,
  classAssignments: [],
  studentSubmissions: [],
  commonMistakeAnalyses: [],
  lessonReflections: [],
  assignmentInsights: TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK,
};
