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

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

const STUDENT_API_BASE = `${BASE_URL}/api/student`;

async function requestStudentApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const response = await fetch(`${STUDENT_API_BASE}${path}`, {
    ...options,
    headers: {
      ...(hasFormDataBody ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof (data as { detail?: unknown }).detail === "string"
        ? (data as { detail: string }).detail
        : `API Error: ${response.status}`;
    throw new Error(detail);
  }

  return data as T;
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
