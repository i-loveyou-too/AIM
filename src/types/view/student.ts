import type {
  StudentAssignment,
  StudentLatestReport,
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
