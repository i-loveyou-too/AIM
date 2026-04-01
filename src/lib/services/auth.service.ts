import { fetchAuthCsrf, requestAuthLogout, requestAuthMe, requestTeacherLogin } from "@/lib/api/auth";
import type { AuthUser, TeacherLoginResult } from "@/types/auth";

const DEFAULT_NEXT_PATH = "/dashboard";

function normalizeNextPath(path: unknown) {
  if (typeof path !== "string") return DEFAULT_NEXT_PATH;
  if (!path.startsWith("/")) return DEFAULT_NEXT_PATH;
  if (path === "/login") return DEFAULT_NEXT_PATH;
  return path;
}

function toAuthErrorMessage(fallback: string, error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
}

export type AuthSessionResult =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false };

export async function getAuthSession(): Promise<AuthSessionResult> {
  try {
    const meResult = await requestAuthMe();
    if (!meResult.ok) return { authenticated: false };
    if (!meResult.data?.authenticated || !meResult.data.user) return { authenticated: false };
    return { authenticated: true, user: meResult.data.user };
  } catch {
    return { authenticated: false };
  }
}

export async function loginInstructor(
  username: string,
  password: string,
  next?: string | null,
): Promise<TeacherLoginResult> {
  const trimmedUsername = username.trim();
  if (!trimmedUsername) {
    return { ok: false, error: "아이디를 입력해 주세요." };
  }
  if (!password) {
    return { ok: false, error: "비밀번호를 입력해 주세요." };
  }

  try {
    const csrfResult = await fetchAuthCsrf();
    if (!csrfResult.ok) {
      return { ok: false, error: csrfResult.error };
    }

    const loginResult = await requestTeacherLogin(
      {
        username: trimmedUsername,
        password,
        next: normalizeNextPath(next),
      },
      csrfResult.csrfToken,
    );

    if (!loginResult.ok) {
      return { ok: false, error: loginResult.error };
    }

    // 로그인 성공 후 세션 기준 사용자 상태를 다시 확인해 동기화
    const meResult = await requestAuthMe();
    const user = meResult.ok && meResult.data?.authenticated ? meResult.data.user : loginResult.data?.user;

    if (!user) {
      return { ok: false, error: "로그인 상태를 확인하지 못했습니다. 다시 시도해 주세요." };
    }

    const nextPath = normalizeNextPath(next ?? loginResult.data?.next);
    return {
      ok: true,
      nextPath,
      user,
      raw: loginResult.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: toAuthErrorMessage("로그인 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.", error),
    };
  }
}

export async function logoutInstructor() {
  try {
    const csrfResult = await fetchAuthCsrf();
    if (!csrfResult.ok) {
      return { ok: false as const, error: csrfResult.error };
    }

    const result = await requestAuthLogout(csrfResult.csrfToken);
    if (!result.ok) {
      return { ok: false as const, error: result.error };
    }

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: toAuthErrorMessage("로그아웃 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.", error),
    };
  }
}
