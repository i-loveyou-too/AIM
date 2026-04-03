import { fetchAuthCsrf, requestAuthLogout, requestAuthMe, requestTeacherLogin } from "@/lib/api/auth";
import type { AuthUser, TeacherLoginResult } from "@/types/auth";

const DEFAULT_NEXT_PATH = "/dashboard";
const AUTH_REQUEST_TIMEOUT_MS = 8000;

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

async function withTimeout<T>(promise: Promise<T>, fallbackMessage: string, timeoutMs = AUTH_REQUEST_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(fallbackMessage)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type AuthSessionResult =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false };

export async function getAuthSession(): Promise<AuthSessionResult> {
  try {
    const meResult = await withTimeout(
      requestAuthMe(),
      "세션 확인이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
      5000,
    );
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
    const csrfResult = await withTimeout(
      fetchAuthCsrf(),
      "CSRF 토큰을 가져오지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.",
    );
    if (!csrfResult.ok) {
      return { ok: false, error: csrfResult.error };
    }

    const loginResult = await withTimeout(
      requestTeacherLogin(
        {
          username: trimmedUsername,
          password,
          next: normalizeNextPath(next),
        },
        csrfResult.csrfToken,
      ),
      "로그인 요청이 지연되고 있습니다. 기존 브라우저 쿠키를 지우고 다시 시도해 주세요.",
    );

    if (!loginResult.ok) {
      return { ok: false, error: loginResult.error };
    }

    const fallbackUser = loginResult.data?.user;

    try {
      const meResult = await withTimeout(
        requestAuthMe(),
        "세션 확인이 지연되고 있습니다.",
        4000,
      );
      const user = meResult.ok && meResult.data?.authenticated ? meResult.data.user : fallbackUser;

      if (!user) {
        return { ok: false, error: "로그인 상태를 확인하지 못했습니다. 다시 시도해 주세요." };
      }

      return {
        ok: true,
        nextPath: normalizeNextPath(next ?? loginResult.data?.next),
        user,
        raw: loginResult.data,
      };
    } catch {
      if (!fallbackUser) {
        return {
          ok: false,
          error: "로그인은 되었지만 세션 확인이 지연되고 있습니다. 브라우저 쿠키를 지우고 다시 시도해 주세요.",
        };
      }

      return {
        ok: true,
        nextPath: normalizeNextPath(next ?? loginResult.data?.next),
        user: fallbackUser,
        raw: loginResult.data,
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: toAuthErrorMessage("로그인 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.", error),
    };
  }
}

export async function logoutInstructor() {
  try {
    const csrfResult = await withTimeout(
      fetchAuthCsrf(),
      "로그아웃 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    );
    if (!csrfResult.ok) {
      return { ok: false as const, error: csrfResult.error };
    }

    const result = await withTimeout(
      requestAuthLogout(csrfResult.csrfToken),
      "로그아웃 요청이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
    );
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
