"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1 4L3.5 6.5L9 1"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Surface({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "bg-[linear-gradient(135deg,rgba(255,219,200,0.92)_0%,rgba(255,137,160,0.22)_48%,rgba(205,214,255,0.68)_100%)] p-[1px]",
        "shadow-[0_22px_60px_rgba(244,92,107,0.08)]",
        className ?? "",
      ].join(" ")}
    >
      <div
        className={[
          "h-full w-full bg-[rgba(255,255,255,0.94)] backdrop-blur-md",
          innerClassName ?? "",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function FieldShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,217,193,0.92),rgba(255,137,160,0.16),rgba(207,214,255,0.62))] p-[1px] transition-all duration-200 focus-within:-translate-y-0.5 focus-within:shadow-[0_14px_30px_rgba(244,92,107,0.12)]">
      <div className="flex h-12 items-center gap-2.5 rounded-2xl bg-[rgba(249,247,244,0.98)] px-4">
        {children}
      </div>
    </div>
  );
}

function StudentProgressCard() {
  return (
    <Surface className="rounded-[30px]" innerClassName="rounded-[29px] p-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-[0.18em] text-muted">오늘 할 일</p>
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">
          TODAY
        </span>
      </div>
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-text">진행률</span>
          <span className="text-xl font-extrabold text-brand">72%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-soft">
          <div className="h-3 w-[72%] rounded-full bg-brand" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">수학 오답노트 포함 5개 활동 중 3개 완료</p>
    </Surface>
  );
}

function StudentAssignmentCard() {
  const bars = [40, 52, 88, 36];

  return (
    <Surface className="rounded-[30px]" innerClassName="rounded-[29px] p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-soft text-base">
          📚
        </span>
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] text-muted">과제 제출 현황</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-text">3</span>
            <span className="text-sm text-muted">/ 4 제출</span>
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-end gap-2">
        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className={`flex-1 rounded-t-[10px] ${index === 2 ? "bg-brand" : "bg-brand/18"}`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    </Surface>
  );
}

function StudentCoachCard() {
  return (
    <Surface className="rounded-[28px]" innerClassName="rounded-[27px] p-5">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm/50 text-base">
          ✦
        </span>
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] text-brand">AI 코치 한마디</p>
          <p className="mt-1.5 text-sm font-medium leading-[1.75] text-text">
            "지우님, 오늘 수학 오답 정리가 3개 남았어요!
            <br />
            조금만 더 해볼까요?"
          </p>
        </div>
      </div>
    </Surface>
  );
}

export function StudentLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPathParam = searchParams.get("next");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = useMemo(
    () => isSubmitting || username.trim().length === 0 || password.length === 0,
    [isSubmitting, username, password],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isDisabled) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 900));
      router.push(nextPathParam ?? "/student/dashboard");
    } catch {
      setErrorMessage("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f5f3_0%,#f4f3f5_56%,#f2f2f7_100%)]">
      <div className="relative mx-auto min-h-screen max-w-[1500px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute left-[4%] top-[-4%] h-[260px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,233,191,0.56)_0%,rgba(255,233,191,0)_72%)] blur-3xl sm:left-[8%] sm:h-[320px] sm:w-[420px]" />
        <div className="pointer-events-none absolute right-[4%] top-[12%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(255,212,201,0.28)_0%,rgba(255,212,201,0)_74%)] blur-3xl sm:right-[6%] sm:h-[360px] sm:w-[360px]" />
        <div className="pointer-events-none absolute left-[12%] top-[40%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(214,220,255,0.24)_0%,rgba(214,220,255,0)_72%)] blur-3xl sm:left-[22%] sm:h-[380px] sm:w-[380px]" />

        <section className="relative">
          <div className="grid gap-8 xl:grid-cols-12 xl:gap-x-10 xl:gap-y-0">
            <div className="relative z-10 xl:col-span-7">
              <div className="max-w-[620px]">
                <div className="flex flex-wrap items-center gap-3">
                  <Image
                    src="/aim-on-logo.png"
                    alt="Aim ON"
                    width={44}
                    height={44}
                    className="h-10 w-10 object-contain"
                  />
                  <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                    <p className="text-[1.5rem] font-black tracking-[-0.02em] text-brand sm:text-[1.65rem]">
                      Aim ON
                    </p>
                    <span className="rounded-full border border-warm/80 bg-warm/35 px-2.5 py-0.5 text-[10.5px] font-bold tracking-[0.16em] text-[#7a6400]">
                      STUDENT PORTAL
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
                  <h1 className="text-[1.95rem] font-black leading-[1.14] tracking-tight text-text sm:text-[2.45rem] lg:text-[2.8rem]">
                    오늘 해야 할 공부,
                    <br />
                    한눈에 정리합니다
                  </h1>
                  <p className="max-w-[490px] text-[0.98rem] leading-[1.85] text-muted sm:text-[1rem] sm:leading-[1.9]">
                    밀린 공부도 다시 정리해주는 AI 학습 코치와 함께
                    <br className="hidden sm:block" />
                    나에게 맞는 계획으로 공부를 이어가세요.
                  </p>
                </div>

                <div className="relative z-10 mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 xl:mt-9 xl:max-w-[920px] xl:grid-cols-[1.05fr_0.92fr]">
                  <div className="sm:col-span-2 xl:col-span-1 xl:max-w-[410px]">
                    <StudentProgressCard />
                  </div>
                  <div className="sm:col-span-1 xl:mt-4 xl:max-w-[340px] xl:-ml-8">
                    <StudentAssignmentCard />
                  </div>
                  <div className="sm:col-span-2 xl:col-span-2 xl:ml-[140px] xl:mt-[-48px] xl:max-w-[500px]">
                    <StudentCoachCard />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-20 xl:col-span-5 xl:col-start-8">
              <div className="mx-auto w-full max-w-[420px] xl:mt-24">
                <Surface className="rounded-[32px]" innerClassName="rounded-[31px] px-6 py-7 sm:px-8 sm:py-9">
                  <div>
                    <h2 className="text-[1.5rem] font-black tracking-tight text-text sm:text-[1.65rem]">
                      학생 로그인
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      계정으로 로그인하고 오늘의 학습을 바로 시작하세요
                    </p>
                  </div>

                  <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="student-username"
                        className="block text-xs font-bold tracking-[0.14em] text-muted"
                      >
                        아이디 (Username)
                      </label>
                      <FieldShell>
                        <span className="select-none text-[15px] text-muted/55">👤</span>
                        <input
                          id="student-username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          placeholder="아이디를 입력해 주세요"
                          className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-text outline-none placeholder:text-muted/55"
                          disabled={isSubmitting}
                        />
                      </FieldShell>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="student-password"
                        className="block text-xs font-bold tracking-[0.14em] text-muted"
                      >
                        비밀번호 (Password)
                      </label>
                      <FieldShell>
                        <span className="select-none text-[15px] text-muted/55">🔒</span>
                        <input
                          id="student-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="비밀번호를 입력해 주세요"
                          className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-text outline-none placeholder:text-muted/55"
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="shrink-0 text-muted/55 transition hover:text-brand"
                          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                          disabled={isSubmitting}
                        >
                          <EyeIcon open={showPassword} />
                        </button>
                      </FieldShell>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <label className="flex cursor-pointer select-none items-center gap-2">
                        <span
                          role="checkbox"
                          aria-checked={rememberMe}
                          onClick={() => setRememberMe((current) => !current)}
                          className={[
                            "flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-2 transition-colors",
                            rememberMe
                              ? "border-brand bg-brand"
                              : "border-border bg-white hover:border-brand/40",
                          ].join(" ")}
                        >
                          {rememberMe && <CheckIcon />}
                        </span>
                        <span className="text-sm text-muted">로그인 상태 유지</span>
                      </label>

                      <button
                        type="button"
                        className="text-[13px] font-semibold text-brand/80 transition hover:text-brand"
                      >
                        비밀번호 찾기
                      </button>
                    </div>

                    <div aria-live="polite" className="min-h-[20px]">
                      {errorMessage ? (
                        <p className="rounded-xl border border-brand/20 bg-brand/[0.05] px-3.5 py-2.5 text-[13px] font-medium text-brand">
                          {errorMessage}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      disabled={isDisabled}
                      className={[
                        "h-12 w-full rounded-2xl text-[15px] font-bold transition-all duration-200",
                        isDisabled
                          ? "cursor-not-allowed bg-brand/25 text-white/60"
                          : "bg-brand text-white shadow-[0_16px_32px_rgba(241,72,88,0.28)] hover:bg-[#d63040] active:scale-[0.99]",
                      ].join(" ")}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                          로그인 중...
                        </span>
                      ) : (
                        "로그인"
                      )}
                    </button>
                  </form>

                  <div className="mt-5 rounded-xl border border-transparent bg-[linear-gradient(rgba(249,247,244,0.98),rgba(249,247,244,0.98)),linear-gradient(135deg,rgba(255,218,197,0.84),rgba(255,137,160,0.18),rgba(204,212,255,0.54))] bg-origin-border bg-clip-padding px-4 py-3 text-center text-[12.5px] leading-5 text-muted">
                    계정 문의는 학원 또는 담당 선생님께 요청해 주세요.
                  </div>
                </Surface>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-[11px] font-semibold tracking-[0.1em] text-muted/60 xl:justify-start xl:px-2">
                  <button type="button" className="px-2 py-1 transition hover:text-brand">
                    HELP CENTER
                  </button>
                  <span className="text-border/80">|</span>
                  <button type="button" className="px-2 py-1 transition hover:text-brand">
                    PRIVACY POLICY
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
