"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";

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
        "bg-[linear-gradient(135deg,rgba(255,220,208,0.88)_0%,rgba(244,117,133,0.18)_42%,rgba(212,219,248,0.72)_100%)] p-[1px]",
        "shadow-[0_24px_72px_rgba(120,96,102,0.08)]",
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
    <div className="rounded-[20px] bg-[linear-gradient(135deg,rgba(255,221,207,0.92),rgba(244,117,133,0.14),rgba(211,219,247,0.62))] p-[1px] transition-all duration-200 focus-within:-translate-y-0.5 focus-within:shadow-[0_14px_32px_rgba(241,72,88,0.11)]">
      <div className="flex h-13 items-center gap-2.5 rounded-[20px] bg-[rgba(247,247,249,0.98)] px-4 sm:h-14">
        {children}
      </div>
    </div>
  );
}

function EyeToggle({
  open,
  disabled,
  onClick,
}: {
  open: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-brand"
      aria-label={open ? "비밀번호 숨기기" : "비밀번호 보기"}
      disabled={disabled}
    >
      {open ? "숨기기" : "보기"}
    </button>
  );
}

function ProgressCard() {
  return (
    <Surface className="rounded-[30px]" innerClassName="rounded-[29px] p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold tracking-[0.16em] text-muted">STUDENT PROGRESS</p>
        <span className="text-lg text-brand">↗</span>
      </div>
      <div className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
        <div>
          <div className="flex items-center justify-between text-[1.05rem] sm:text-[1.15rem]">
            <span className="font-semibold text-text">김민수 학생</span>
            <span className="font-bold text-brand">82%</span>
          </div>
          <div className="mt-3 h-3.5 rounded-full bg-soft">
            <div className="h-3.5 w-[82%] rounded-full bg-brand" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[1.05rem] sm:text-[1.15rem]">
            <span className="font-semibold text-text">이서윤 학생</span>
            <span className="font-bold text-muted">45%</span>
          </div>
          <div className="mt-3 h-3.5 rounded-full bg-soft">
            <div className="h-3.5 w-[45%] rounded-full bg-[#cfd6df]" />
          </div>
        </div>
      </div>
    </Surface>
  );
}

function HomeworkCard() {
  return (
    <Surface className="rounded-[30px]" innerClassName="rounded-[29px] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
          📚
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold tracking-[0.16em] text-muted">HOMEWORK STATUS</p>
          <p className="mt-2 text-[1.4rem] font-extrabold tracking-tight text-text sm:text-[1.65rem]">
            과제 제출 흐름
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-end gap-3 sm:mt-7">
        {[42, 58, 104, 64, 34].map((height, index) => (
          <div
            key={`${height}-${index}`}
            className={`flex-1 rounded-t-[20px] ${index === 2 ? "bg-brand" : "bg-brand/24"}`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    </Surface>
  );
}

function InsightCard() {
  return (
    <Surface className="rounded-[28px]" innerClassName="rounded-[27px] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warm/75 text-lg text-text sm:h-12 sm:w-12">
          ✦
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold tracking-[0.16em] text-brand">AI INSIGHT</p>
          <p className="mt-2 text-[1rem] font-semibold leading-[1.7] text-text sm:text-[1.08rem] sm:leading-[1.55]">
            수학 과제 이행률이 평소보다 15% 낮습니다.
            <br />
            보강 자료 발송을 권장합니다.
          </p>
        </div>
      </div>
    </Surface>
  );
}

export function InstructorLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const nextPathParam = searchParams.get("next");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = useMemo(
    () => isSubmitting || username.trim().length === 0 || password.length === 0,
    [isSubmitting, username, password],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login(username, password, nextPathParam);

      if (!result.ok) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      if (typeof window !== "undefined") {
        window.location.assign(result.nextPath);
        return;
      }

      router.replace(result.nextPath);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "로그인 처리 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f6f4_0%,#f4f3f5_56%,#f1f2f6_100%)]">
      <div className="relative mx-auto min-h-screen max-w-[1560px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute left-[2%] top-[-4%] h-[260px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,235,197,0.62)_0%,rgba(255,235,197,0)_72%)] blur-3xl sm:left-[6%] sm:h-[360px] sm:w-[480px]" />
        <div className="pointer-events-none absolute left-[18%] top-[14%] hidden h-[320px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,245,220,0.72)_0%,rgba(255,245,220,0)_74%)] blur-3xl lg:block" />
        <div className="pointer-events-none absolute right-[4%] top-[12%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(223,229,255,0.22)_0%,rgba(223,229,255,0)_72%)] blur-3xl sm:right-[8%] sm:h-[420px] sm:w-[420px]" />
        <div className="pointer-events-none absolute left-[10%] top-[44%] h-[260px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,222,196,0.3)_0%,rgba(255,222,196,0)_74%)] blur-3xl sm:h-[420px] sm:w-[500px]" />

        <section className="relative">
          <div className="grid gap-8 xl:grid-cols-12 xl:gap-x-10 xl:gap-y-0">
            <div className="relative z-10 xl:col-span-7 xl:pt-6">
              <div className="max-w-[720px]">
                <div className="flex flex-wrap items-center gap-3">
                  <Image
                    src="/aim-on-logo.png"
                    alt="Aim ON"
                    width={56}
                    height={56}
                    className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                  />
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="text-[1.55rem] font-black tracking-[-0.02em] text-brand sm:text-[1.8rem]">
                      Aim ON
                    </p>
                    <span className="rounded-full border border-warm/80 bg-warm/28 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-text sm:text-xs">
                      INSTRUCTOR PORTAL
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
                  <h1 className="text-[2rem] font-black leading-[1.14] tracking-tight text-text sm:text-[2.55rem] lg:text-[2.95rem]">
                    조교 없이 학원이 돌아가는
                    <br />
                    <span className="text-brand">AI 운영 OS</span>
                  </h1>
                  <p className="max-w-[610px] text-[0.98rem] leading-[1.9] text-muted sm:text-[1.02rem] sm:leading-[1.95]">
                    학생 데이터, 과제 이행, 취약점 분석, 리포트 발송까지
                    <br className="hidden sm:block" />
                    한 주 운영 흐름을 하나의 화면에서 안정적으로 관리하세요.
                  </p>
                </div>

                <div className="relative z-10 mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 xl:mt-9 xl:max-w-[980px] xl:grid-cols-[1fr_0.96fr]">
                  <div className="sm:col-span-1 xl:max-w-[440px]">
                    <ProgressCard />
                  </div>
                  <div className="sm:col-span-1 xl:mt-3 xl:max-w-[450px] xl:-ml-4">
                    <HomeworkCard />
                  </div>
                  <div className="sm:col-span-2 xl:ml-[126px] xl:mt-[-34px] xl:max-w-[520px]">
                    <InsightCard />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-20 xl:col-span-5 xl:col-start-8">
              <div className="mx-auto w-full max-w-[470px] xl:mt-32">
                <Surface className="rounded-[32px]" innerClassName="rounded-[31px] px-6 py-7 sm:px-8 sm:py-9">
                  <div>
                    <h2 className="text-[1.55rem] font-black tracking-tight text-brand sm:text-[1.75rem]">
                      교사용 로그인
                    </h2>
                    <p className="mt-2 text-[0.95rem] leading-7 text-muted sm:text-[0.98rem]">
                      계정으로 로그인하고 학생 관리와 학습 운영을 시작하세요.
                    </p>
                  </div>

                  <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-xs font-bold tracking-[0.16em] text-muted">
                        ID (USERNAME)
                      </label>
                      <FieldShell>
                        <span className="text-sm text-muted/60">👤</span>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          placeholder="아이디를 입력해 주세요"
                          className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-text outline-none placeholder:text-muted/55"
                          disabled={isSubmitting}
                        />
                      </FieldShell>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-xs font-bold tracking-[0.16em] text-muted">
                        PASSWORD
                      </label>
                      <FieldShell>
                        <span className="text-sm text-muted/60">🔒</span>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="비밀번호를 입력해 주세요"
                          className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-text outline-none placeholder:text-muted/55"
                          disabled={isSubmitting}
                        />
                        <EyeToggle
                          open={showPassword}
                          disabled={isSubmitting}
                          onClick={() => setShowPassword((current) => !current)}
                        />
                      </FieldShell>
                    </div>

                    <div aria-live="polite" className="min-h-[24px]">
                      {errorMessage ? (
                        <p className="rounded-2xl border border-brand/20 bg-brand/5 px-3 py-2 text-sm font-medium text-brand">
                          {errorMessage}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      disabled={isDisabled}
                      className={`inline-flex h-13 w-full items-center justify-center rounded-[20px] text-base font-bold transition-all duration-200 sm:h-14 sm:text-lg ${
                        isDisabled
                          ? "cursor-not-allowed bg-brand/30 text-white/60 shadow-none"
                          : "bg-brand text-white shadow-[0_18px_36px_rgba(241,72,88,0.28)] hover:bg-[#d63040] active:scale-[0.98]"
                      }`}
                    >
                      {isSubmitting ? "로그인 중..." : "로그인"}
                    </button>
                  </form>

                  <div className="mt-6 rounded-[18px] border border-transparent bg-[linear-gradient(rgba(247,247,249,0.98),rgba(247,247,249,0.98)),linear-gradient(135deg,rgba(255,217,203,0.84),rgba(244,117,133,0.14),rgba(212,219,248,0.58))] bg-origin-border bg-clip-padding px-4 py-3 text-center text-sm font-medium text-muted">
                    계정 발급과 권한 문의는 관리자에게 요청해 주세요.
                  </div>
                </Surface>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-xs font-semibold tracking-[0.12em] text-muted/75 xl:justify-between xl:px-0">
                  <p>© 2024 AIM ON INC.</p>
                  <div className="flex items-center gap-4">
                    <button type="button" className="transition hover:text-brand">
                      PRIVACY
                    </button>
                    <button type="button" className="transition hover:text-brand">
                      TERMS
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
