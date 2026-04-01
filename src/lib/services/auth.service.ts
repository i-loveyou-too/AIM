import { requestTeacherLogin } from "@/lib/api/auth";
import type { TeacherLoginResult } from "@/types/auth";

const DEFAULT_NEXT_PATH = "/dashboard";

function normalizeNextPath(path: unknown) {
  if (typeof path !== "string") return DEFAULT_NEXT_PATH;
  if (!path.startsWith("/")) return DEFAULT_NEXT_PATH;
  return path;
}

export async function loginInstructor(
  username: string,
  password: string,
): Promise<TeacherLoginResult> {
  const trimmedUsername = username.trim();
  if (!trimmedUsername) {
    return { ok: false, error: "아이디를 입력해 주세요." };
  }
  if (!password) {
    return { ok: false, error: "비밀번호를 입력해 주세요." };
  }

  let result:
    | Awaited<ReturnType<typeof requestTeacherLogin>>
    | null = null;
  try {
    result = await requestTeacherLogin({
      username: trimmedUsername,
      password,
    });
  } catch {
    return { ok: false, error: "로그인 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  if (!result) {
    return { ok: false, error: "로그인 요청을 처리하지 못했습니다." };
  }

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const nextPath = normalizeNextPath(result.data?.next);
  return {
    ok: true,
    nextPath,
    raw: result.data,
  };
}
