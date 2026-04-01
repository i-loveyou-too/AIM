import type {
  StudentAssignment,
  StudentLatestReport,
  StudentSubmission,
  StudentTodayTask,
} from "@/types/student";

export type StudentHomeLoadResult = {
  tasks: StudentTodayTask[];
  report: StudentLatestReport | null;
  error: string | null;
};

export type StudentTasksLoadResult = {
  assignments: StudentAssignment[];
  error: string | null;
};

export type StudentTaskPartition = {
  pendingAssignments: StudentAssignment[];
  completedAssignments: StudentAssignment[];
};

export type StudentSubmissionsLoadResult = {
  submissions: StudentSubmission[];
  error: string | null;
};

export type StudentReportLoadResult = {
  report: StudentLatestReport | null;
  error: string | null;
};
