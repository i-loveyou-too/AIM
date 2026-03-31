import { getApiBaseUrl, requestJson } from "@/lib/api/client";
import type {
  StudentAssignment,
  StudentCoachQuestionType,
  StudentCoachResponse,
  StudentGoalsUpdatePayload,
  StudentGoalsUpdateResponse,
  StudentLatestReport,
  StudentSubmission,
  StudentTodayTask,
} from "@/types/student";

async function requestStudentApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  return requestJson<T>({
    baseUrl: `${getApiBaseUrl()}/api/student`,
    path,
    init: {
      ...options,
      headers: {
        ...(hasFormDataBody ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    },
    errorMode: "detail",
    defaultErrorMessage: "Student API request failed",
  });
}

export async function fetchTodayTasks(): Promise<StudentTodayTask[]> {
  const data = await requestStudentApi<{ tasks?: StudentTodayTask[] } | StudentTodayTask[]>(
    "/today-tasks",
  );
  if (Array.isArray(data)) {
    return data;
  }
  return Array.isArray(data.tasks) ? data.tasks : [];
}

export async function fetchLatestReport(): Promise<StudentLatestReport | null> {
  const data = await requestStudentApi<
    { report?: StudentLatestReport | null } | StudentLatestReport | null
  >("/reports/latest");
  if (data === null) {
    return null;
  }
  if (typeof data === "object" && "report" in data) {
    return data.report ?? null;
  }
  return typeof data === "object" ? (data as StudentLatestReport) : null;
}

export async function fetchAssignments(): Promise<StudentAssignment[]> {
  const data = await requestStudentApi<
    { assignments?: StudentAssignment[] } | StudentAssignment[]
  >("/assignments");
  if (Array.isArray(data)) {
    return data;
  }
  return Array.isArray(data.assignments) ? data.assignments : [];
}

export async function fetchSubmissions(): Promise<StudentSubmission[]> {
  const data = await requestStudentApi<
    { submissions?: StudentSubmission[] } | StudentSubmission[]
  >("/submissions");
  if (Array.isArray(data)) {
    return data;
  }
  return Array.isArray(data.submissions) ? data.submissions : [];
}

export async function updateGoals(
  payload: StudentGoalsUpdatePayload,
): Promise<StudentGoalsUpdateResponse> {
  return requestStudentApi<StudentGoalsUpdateResponse>("/goals", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function askCoach(
  questionType: StudentCoachQuestionType,
): Promise<StudentCoachResponse> {
  return requestStudentApi<StudentCoachResponse>("/coach", {
    method: "POST",
    body: JSON.stringify({
      question_type: questionType,
    }),
  });
}
