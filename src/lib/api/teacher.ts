import { fetchAuthCsrf } from "@/lib/api/auth";
import { getApiBaseUrl, parseJsonSafe, requestApiResponse, requestJson } from "@/lib/api/client";
import type {
  TeacherClassDetail,
  TeacherClassListItem,
  TeacherStudentDetail,
  TeacherStudentListItem,
  TeacherTodayLessonItem,
} from "@/types/teacher";

async function fetchJson<T>(path: string): Promise<T> {
  return requestJson<T>({
    baseUrl: getApiBaseUrl(),
    path,
    cache: "no-store",
    errorMode: "status",
  });
}

export function toDisplayGrade(value: string | null | undefined) {
  if (!value) return "-";
  if (value === "grade1") return "고1";
  if (value === "grade2") return "고2";
  if (value === "grade3") return "고3";
  return value;
}

export function toDisplayStatus(value: string | null | undefined) {
  if (!value) return "-";
  if (value === "stable") return "안정";
  if (value === "warning") return "주의";
  if (value === "urgent") return "시험 임박";
  if (value === "focus") return "주의";
  if (value === "rising") return "상승";
  return value;
}

export function toDisplayTrack(value: string | null | undefined) {
  if (!value) return "-";
  if (value === "naesin") return "내신";
  if (value === "suneung") return "수능";
  return value;
}

export async function getTeacherStudents() {
  return fetchJson<TeacherStudentListItem[]>("/api/teacher/students");
}

export async function getTeacherClasses() {
  return fetchJson<TeacherClassListItem[]>("/api/teacher/classes");
}

export async function getTeacherClassDetail(classGroupId: number) {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: `/api/teacher/classes/${classGroupId}`,
    cache: "no-store",
  });

  if (response.status === 404) {
    return { status: 404 as const, data: null };
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = (await parseJsonSafe(response)) as TeacherClassDetail;
  return { status: 200 as const, data };
}

export async function getTeacherTodayLessons() {
  return fetchJson<TeacherTodayLessonItem[]>("/api/teacher/today-lessons");
}

export async function getTeacherStudentDetail(studentId: number) {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: `/api/teacher/students/${studentId}`,
    cache: "no-store",
  });

  if (response.status === 404) {
    return { status: 404 as const, data: null };
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const raw = (await parseJsonSafe(response)) as TeacherStudentDetail & {
    weak_topics: unknown;
    studyti_tags: unknown;
  };

  // API가 JSON 문자열로 반환하는 필드를 배열로 파싱
  const data: TeacherStudentDetail = {
    ...raw,
    weak_topics:
      typeof raw.weak_topics === "string"
        ? (() => {
            try {
              return JSON.parse(raw.weak_topics as string);
            } catch {
              return null;
            }
          })()
        : (raw.weak_topics as TeacherStudentDetail["weak_topics"]),
    studyti_tags:
      typeof raw.studyti_tags === "string"
        ? (() => {
            try {
              return JSON.parse(raw.studyti_tags as string);
            } catch {
              return null;
            }
          })()
        : (raw.studyti_tags as TeacherStudentDetail["studyti_tags"]),
  };

  return { status: 200 as const, data };
}

export type TeacherHeaderProfile = {
  name: string;
  role: string;
  initials: string;
  greetingName: string;
};

export type TeacherProfileData = {
  teacherId: number;
  name: string;
  displayName: string;
  affiliation: string;
  role: string;
  email: string;
  phone: string;
  intro: string;
  joined: string;
  header: TeacherHeaderProfile;
};

export async function getTeacherProfile() {
  return fetchJson<TeacherProfileData>("/api/teacher/profile");
}

export async function getTeacherTodayLessonsOverview() {
  return fetchJson<unknown>("/api/teacher/today-lessons/overview");
}

export async function getTeacherAssignmentsOverview() {
  return fetchJson<unknown>("/api/teacher/assignments/overview");
}

export async function getTeacherCurriculumOverview() {
  return fetchJson<unknown>("/api/teacher/curriculum/overview");
}

export async function getTeacherReportsOverview() {
  return fetchJson<unknown>("/api/teacher/reports/overview");
}

export async function getTeacherReportStudentDetail(studentId: number) {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: `/api/teacher/reports/students/${studentId}/detail`,
    cache: "no-store",
  });

  if (response.status === 404) {
    return { status: 404 as const, data: null };
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await parseJsonSafe(response);
  return { status: 200 as const, data };
}

export async function getTeacherSettingsOverview() {
  return fetchJson<unknown>("/api/teacher/settings/overview");
}

export type TeacherSettingsPatchPayload = {
  notifications?: Array<{ key: string; label: string; description: string; enabled: boolean }>;
  report?: { defaultPeriod: string; defaultView: string; examEmphasisDDay: string };
  lesson?: { defaultDuration: string; todayPageInfoScope: string; showNextAction: boolean; showLessonMemo: boolean };
  assignment?: { defaultDeadlineTime: string; allowPhotoSubmit: boolean; allowOMRSubmit: boolean; questionEnabled: boolean; ocrReviewHighlight: boolean; commonMistakeAlert: boolean };
};

export async function patchTeacherSettings(payload: TeacherSettingsPatchPayload): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/teacher/settings/overview`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { detail?: string };
      return { ok: false, error: data.detail ?? "설정 저장에 실패했습니다." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "네트워크 오류가 발생했습니다." };
  }
}

export type UpdateTeacherProfilePayload = {
  name: string;
  displayName?: string;
  email?: string;
  phone?: string;
  intro?: string;
};

export type UpdateTeacherProfileResult =
  | { ok: true; profile: TeacherProfileData; message: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function updateTeacherProfile(
  payload: UpdateTeacherProfilePayload,
): Promise<UpdateTeacherProfileResult> {
  const csrfResult = await fetchAuthCsrf();
  if (!csrfResult.ok) {
    return { ok: false, error: csrfResult.error };
  }

  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: "/api/teacher/profile",
    init: {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfResult.csrfToken,
      },
      body: JSON.stringify(payload),
    },
    cache: "no-store",
  });

  const data = (await parseJsonSafe(response)) as
    | { message?: string; detail?: string; profile?: TeacherProfileData; errors?: Record<string, string> }
    | null;

  if (!response.ok || !data?.profile) {
    return {
      ok: false,
      error:
        (typeof data?.detail === "string" && data.detail) ||
        (typeof data?.message === "string" && data.message) ||
        `API request failed: ${response.status}`,
      fieldErrors: typeof data?.errors === "object" && data?.errors ? data.errors : undefined,
    };
  }

  return {
    ok: true,
    profile: data.profile,
    message: data.message ?? "프로필이 저장되었습니다.",
  };
}

// ─── 학생 등록 ────────────────────────────────────────────────────────────────

export type CreateStudentPayload = {
  name: string;
  student_code?: string | null;
  school_name?: string | null;
  grade: string;             // "고1" | "고2" | "고3"
  class_group_name?: string | null;
  enrolled_at?: string | null; // "YYYY-MM-DD"
};

export type CreateStudentResult =
  | { ok: true; student_id: number }
  | { ok: false; error: string };

export async function createTeacherStudent(
  payload: CreateStudentPayload,
  csrfToken: string,
): Promise<CreateStudentResult> {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: "/api/teacher/students",
    init: {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(payload),
    },
    cache: "no-store",
  });

  const data = (await parseJsonSafe(response)) as Record<string, unknown> | null;

  if (!response.ok) {
    const error =
      typeof data?.error === "string"
        ? data.error
        : "학생 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    return { ok: false, error };
  }

  const student_id =
    typeof data?.student_id === "number" ? data.student_id : 0;
  return { ok: true, student_id };
}
