import { getApiBaseUrl, parseJsonSafe, requestApiResponse } from "@/lib/api/client";
import type { AuthMeApiResponse, TeacherLoginApiResponse, TeacherLoginPayload } from "@/types/auth";

function getAuthPath(path: string) {
  const envPrefix = process.env.NEXT_PUBLIC_AUTH_API_PREFIX?.trim();
  const prefix = envPrefix && envPrefix.length > 0 ? envPrefix : "/api/auth";
  const normalizedPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return `${normalizedPrefix}/${path}`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${name}=`));
  if (!value) return null;
  return decodeURIComponent(value.slice(name.length + 1));
}

function getErrorMessage(data: unknown, status: number, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const message = (data as { message?: unknown }).message;
    const detail = (data as { detail?: unknown }).detail;
    if (typeof message === "string" && message.trim().length > 0) return message;
    if (typeof detail === "string" && detail.trim().length > 0) return detail;
  }
  return `${fallback} (HTTP ${status})`;
}

export async function fetchAuthCsrf() {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: getAuthPath("csrf"),
    init: {
      method: "GET",
      credentials: "include",
    },
    cache: "no-store",
  });

  const data = await parseJsonSafe(response);
  const csrfToken = getCookie("csrftoken");

  if (!response.ok) {
    return {
      ok: false as const,
      error: getErrorMessage(data, response.status, "CSRF 토큰을 가져오지 못했습니다."),
    };
  }

  if (!csrfToken) {
    return {
      ok: false as const,
      error: "CSRF 쿠키를 확인할 수 없습니다.",
    };
  }

  return {
    ok: true as const,
    csrfToken,
  };
}

export async function requestTeacherLogin(payload: TeacherLoginPayload, csrfToken: string) {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: getAuthPath("login"),
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
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
      error: getErrorMessage(data, response.status, "로그인에 실패했습니다."),
      status: response.status,
    };
  }

  return {
    ok: true as const,
    data,
    status: response.status,
  };
}

export async function requestAuthMe() {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: getAuthPath("me"),
    init: {
      method: "GET",
      credentials: "include",
    },
    cache: "no-store",
  });

  const data = (await parseJsonSafe(response)) as AuthMeApiResponse | null;

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      data,
    };
  }

  return {
    ok: true as const,
    status: response.status,
    data,
  };
}

export async function requestAuthLogout(csrfToken: string) {
  const response = await requestApiResponse({
    baseUrl: getApiBaseUrl(),
    path: getAuthPath("logout"),
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({}),
    },
    cache: "no-store",
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    return {
      ok: false as const,
      error: getErrorMessage(data, response.status, "로그아웃에 실패했습니다."),
    };
  }

  return {
    ok: true as const,
  };
}
