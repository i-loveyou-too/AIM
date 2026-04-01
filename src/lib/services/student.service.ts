import {
  fetchAssignments,
  fetchLatestReport,
  fetchSubmissions,
  fetchTodayTasks,
} from "@/lib/api/student";
import {
  STUDENT_HOME_ERROR_MESSAGES,
  STUDENT_REPORT_ERROR_MESSAGE,
  STUDENT_SUBMISSIONS_ERROR_MESSAGE,
  STUDENT_TASKS_ERROR_MESSAGE,
} from "@/lib/fallbacks/student";
import type {
  StudentAssignment,
  StudentLatestReport,
  StudentSubmission,
} from "@/types/student";
import type {
  StudentHomeLoadResult,
  StudentReportLoadResult,
  StudentSubmissionsLoadResult,
  StudentTaskPartition,
  StudentTasksLoadResult,
} from "@/types/view/student";

export function formatStudentTodayLabel(baseDate: Date = new Date()) {
  return baseDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatStudentTaskDueDateLabel(dateText?: string | null) {
  if (!dateText) {
    return "기한 없음";
  }
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }
  return date.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
}

export function toStudentTaskStatusLabel(status: string) {
  if (status === "completed") {
    return "완료";
  }
  if (status === "overdue") {
    return "기한 지남";
  }
  return "진행 중";
}

export function getStudentWeakTopicsText(report: StudentLatestReport | null) {
  if (!report?.weak_topics || report.weak_topics.length === 0) {
    return "취약 단원 없음";
  }
  return report.weak_topics.join(", ");
}

export async function loadStudentHomeData(): Promise<StudentHomeLoadResult> {
  const [taskResult, reportResult] = await Promise.allSettled([
    fetchTodayTasks(),
    fetchLatestReport(),
  ]);

  const tasks = taskResult.status === "fulfilled" ? taskResult.value : [];
  const report = reportResult.status === "fulfilled" ? reportResult.value : null;

  let error: string | null = null;
  if (taskResult.status === "rejected" && reportResult.status === "rejected") {
    error = STUDENT_HOME_ERROR_MESSAGES.bothFailed;
  } else if (taskResult.status === "rejected") {
    error = STUDENT_HOME_ERROR_MESSAGES.taskFailed;
  } else if (reportResult.status === "rejected") {
    error = STUDENT_HOME_ERROR_MESSAGES.reportFailed;
  }

  return {
    tasks,
    report,
    error,
  };
}

export function toStudentAssignmentStatus(assignment: StudentAssignment) {
  if (assignment.status) {
    return assignment.status;
  }
  if (assignment.is_submitted) {
    return "completed";
  }
  return "pending";
}

function compareByDueDate(a?: string | null, b?: string | null) {
  if (!a && !b) {
    return 0;
  }
  if (!a) {
    return 1;
  }
  if (!b) {
    return -1;
  }
  return new Date(a).getTime() - new Date(b).getTime();
}

export function sortStudentAssignments(assignments: StudentAssignment[]) {
  return [...assignments].sort((a, b) => {
    const aPending = toStudentAssignmentStatus(a) === "pending" ? 1 : 0;
    const bPending = toStudentAssignmentStatus(b) === "pending" ? 1 : 0;
    if (aPending !== bPending) {
      return bPending - aPending;
    }
    return compareByDueDate(a.due_date, b.due_date);
  });
}

export function partitionStudentAssignments(
  assignments: StudentAssignment[],
): StudentTaskPartition {
  const pendingAssignments = assignments.filter(
    (assignment) => toStudentAssignmentStatus(assignment) === "pending",
  );
  const completedAssignments = assignments.filter(
    (assignment) => toStudentAssignmentStatus(assignment) !== "pending",
  );

  return {
    pendingAssignments,
    completedAssignments,
  };
}

export function formatStudentAssignmentDueDate(dateText?: string | null) {
  if (!dateText) {
    return "기한 없음";
  }
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }
  return date.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function loadStudentTasksData(): Promise<StudentTasksLoadResult> {
  try {
    const assignments = await fetchAssignments();
    return {
      assignments: sortStudentAssignments(assignments),
      error: null,
    };
  } catch (error) {
    return {
      assignments: [],
      error: error instanceof Error ? error.message : STUDENT_TASKS_ERROR_MESSAGE,
    };
  }
}

function compareSubmissionByDateDesc(a?: string | null, b?: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(b).getTime() - new Date(a).getTime();
}

export function sortStudentSubmissions(submissions: StudentSubmission[]) {
  return [...submissions].sort((a, b) =>
    compareSubmissionByDateDesc(a.submitted_at, b.submitted_at),
  );
}

export function formatStudentSubmissionDateTime(dateText?: string | null) {
  if (!dateText) {
    return "제출 시각 없음";
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  return date.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toStudentSubmissionStatusLabel(status?: string | null) {
  if (!status) return "상태 확인";
  if (status === "reviewed") return "검토 완료";
  if (status === "pending") return "검토 대기";
  if (status === "completed") return "완료";
  if (status === "not_submitted") return "미제출";
  return status;
}

export async function loadStudentSubmissionsData(): Promise<StudentSubmissionsLoadResult> {
  try {
    const submissions = await fetchSubmissions();
    return {
      submissions: sortStudentSubmissions(submissions),
      error: null,
    };
  } catch (error) {
    return {
      submissions: [],
      error:
        error instanceof Error
          ? error.message
          : STUDENT_SUBMISSIONS_ERROR_MESSAGE,
    };
  }
}

export async function loadStudentReportData(): Promise<StudentReportLoadResult> {
  try {
    const report = await fetchLatestReport();
    return {
      report,
      error: null,
    };
  } catch (error) {
    return {
      report: null,
      error: error instanceof Error ? error.message : STUDENT_REPORT_ERROR_MESSAGE,
    };
  }
}
