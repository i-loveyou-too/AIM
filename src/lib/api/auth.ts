import { getApiBaseUrl, parseJsonSafe, requestApiResponse } from "@/lib/api/client";
import type { TeacherLoginApiResponse, TeacherLoginPayload } from "@/types/auth";

function getLoginPath() {
  const envPath = process.env.NEXT_PUBLIC_TEACHER_LOGIN_PATH?.trim();
  return envPath && envPath.length > 0 ? envPath : "/api/auth/login";
}

function getErrorMessage(data: unknown, status: number) {
  if (typeof data === "object" && data !== null) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim().length > 0) {
      return detail;
    }
  }
  return `로그인에 실패했습니다. (HTTP ${status})`;
}

export async function requestTeacherLogin(payload: TeacherLoginPayload) {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: getLoginPath(),
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
    cache: "no-store",
  });

  const data = (await parseJsonSafe(response)) as TeacherLoginApiResponse | null;

  if (!response.ok) {
    return {
      ok: false as const,
      error: getErrorMessage(data, response.status),
    };
  }

  return {
    ok: true as const,
    data,
  };
}
