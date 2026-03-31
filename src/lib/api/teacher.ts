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

export async function getTeacherProfile() {
  return fetchJson<{
    teacherId: number;
    name: string;
    affiliation: string;
    role: string;
    email: string;
    phone: string;
    joined: string;
    header: TeacherHeaderProfile;
  }>("/api/teacher/profile");
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
