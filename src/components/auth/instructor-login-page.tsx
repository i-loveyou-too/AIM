"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";

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
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await login(username, password, nextPathParam);

    if (!result.ok) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(result.nextPath);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_560px]">
        <section className="relative overflow-hidden border-border/70 bg-gradient-to-b from-white via-[#f9f9fb] to-[#fffef8] px-8 py-10 lg:border-r lg:px-14 lg:py-12">
          <div className="max-w-[760px]">
            <div className="flex items-center gap-3">
              <Image src="/aim-on-logo.png" alt="Aim ON" width={56} height={56} className="h-12 w-12 object-contain" />
              <div className="flex items-center gap-2">
                <p className="text-[1.8rem] font-black tracking-[-0.02em] text-brand">Aim ON</p>
                <span className="rounded-full border border-warm/80 bg-warm/30 px-3 py-1 text-xs font-bold tracking-[0.14em] text-text">
                  INSTRUCTOR PORTAL
                </span>
              </div>
            </div>

            <h1 className="mt-12 text-[2.1rem] font-black leading-[1.16] tracking-tight text-text sm:text-[2.7rem]">
              조교 없이 학원이 돌아가는
              <br />
              <span className="text-brand">AI 운영 OS</span>
            </h1>

            <p className="mt-6 max-w-[620px] text-lg leading-9 text-muted">
              학생 데이터, 과제 이행, 취약점 분석, 리포트 발송까지 한 번에 관리하세요.
            </p>

            <div className="mt-14 max-w-[760px]">
              <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                <article className="rounded-[26px] border border-border bg-white p-5 shadow-soft">
                  <p className="text-xs font-bold tracking-[0.16em] text-muted">STUDENT PROGRESS</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-text">김민수 학생</span>
                        <span className="font-bold text-brand">82%</span>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-soft">
                        <div className="h-2.5 w-[82%] rounded-full bg-brand" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-text">이서연 학생</span>
                        <span className="font-bold text-muted">45%</span>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-soft">
                        <div className="h-2.5 w-[45%] rounded-full bg-border" />
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-[26px] border border-border bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">📋</span>
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-muted">HOMEWORK STATUS</p>
                      <p className="mt-1 text-[1.4rem] font-extrabold tracking-tight text-text">고전 시가 분석 과제</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-end gap-2">
                    {[35, 42, 74, 48, 28].map((height, index) => (
                      <div
                        key={height + index}
                        className={`w-10 rounded-t-[16px] ${index === 2 ? "bg-brand" : "bg-brand/25"}`}
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </article>

                <article className="sm:col-span-2 rounded-[26px] border border-brand/30 bg-white p-5 shadow-soft">
                  <p className="text-xs font-bold tracking-[0.16em] text-brand">AI INSIGHT</p>
                  <p className="mt-3 text-sm leading-7 text-text">
                    수학 과제 이행률이 평소보다 15% 낮습니다. 보강 자료 발송을 권장합니다.
                  </p>
                </article>
              </div>

              <div className="relative hidden h-[560px] lg:block">
                <div className="absolute left-[80px] top-[12px] h-[420px] w-[430px] rounded-[42px] bg-[#fffef4] blur-3xl" />

                <article className="absolute left-0 top-0 w-[480px] rounded-[40px] border border-border bg-white p-8 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-[1.05rem] font-bold tracking-[0.16em] text-muted">STUDENT PROGRESS</p>
                    <span className="text-xl text-brand">↗</span>
                  </div>
                  <div className="mt-8 space-y-7">
                    <div>
                      <div className="flex items-center justify-between text-[1.45rem]">
                        <span className="font-semibold text-text">김민수 학생</span>
                        <span className="font-bold text-brand">82%</span>
                      </div>
                      <div className="mt-3.5 h-4 rounded-full bg-soft">
                        <div className="h-4 w-[82%] rounded-full bg-brand" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[1.45rem]">
                        <span className="font-semibold text-text">이서연 학생</span>
                        <span className="font-bold text-muted">45%</span>
                      </div>
                      <div className="mt-3.5 h-4 rounded-full bg-soft">
                        <div className="h-4 w-[45%] rounded-full bg-[#cfd6df]" />
                      </div>
                    </div>
                  </div>
                </article>

                <article className="absolute left-[360px] top-[94px] w-[520px] rounded-[40px] border border-border bg-white p-8 shadow-soft">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">📋</span>
                    <div>
                      <p className="text-[1.05rem] font-bold tracking-[0.16em] text-muted">HOMEWORK STATUS</p>
                      <p className="mt-2 text-[2rem] font-extrabold tracking-tight text-text">고전 시가 분석 과제</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-end gap-3">
                    {[42, 58, 104, 64, 34].map((height, index) => (
                      <div
                        key={height + index}
                        className={`w-16 rounded-t-[24px] ${index === 2 ? "bg-brand" : "bg-brand/25"}`}
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </article>

                <article className="absolute left-[350px] top-[330px] w-[360px] rotate-[3deg] rounded-[34px] border border-border bg-white p-7 opacity-75 shadow-soft">
                  <p className="text-[1.05rem] font-bold tracking-[0.1em] text-muted">WEAK POINT ANALYSIS</p>
                </article>

                <article className="absolute left-[170px] top-[358px] z-10 w-[520px] rounded-[34px] border border-border bg-white p-6 shadow-soft">
                  <div className="absolute bottom-7 left-0 top-7 w-1 rounded-full bg-brand" />
                  <div className="flex items-start gap-4 pl-4">
                    <span className="mt-1 flex h-14 w-14 items-center justify-center rounded-full bg-warm/80 text-xl text-text">
                      💡
                    </span>
                    <div className="min-w-0">
                      <p className="text-[1.45rem] font-extrabold tracking-[0.08em] text-brand">AI INSIGHT</p>
                      <p className="mt-2 text-[1.45rem] font-semibold leading-[1.45] text-text">
                        "수학 과제 이행률이 평소보다 15%
                        <br />
                        낮습니다. 보강 자료 발송을 추천합니다."
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-8 lg:px-10">
          <div className="w-full max-w-[430px]">
            <div className="rounded-[30px] border border-border bg-white px-6 py-7 shadow-soft sm:px-8 sm:py-8">
              <h2 className="text-[1.75rem] font-black tracking-tight text-brand">교사용 로그인</h2>
              <p className="mt-2 text-lg leading-8 text-muted">
                계정으로 로그인하여 학생 관리와 학습 운영을 시작하세요.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="text-xs font-bold tracking-[0.16em] text-muted">
                    ID (USERNAME)
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="아이디를 입력하세요"
                    className="mt-2 h-14 w-full rounded-full border border-border bg-soft px-5 text-base font-medium text-text outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-xs font-bold tracking-[0.16em] text-muted">
                    PASSWORD
                  </label>
                  <div className="mt-2 flex h-14 items-center gap-2 rounded-full border border-border bg-soft px-4 focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="h-full flex-1 bg-transparent px-1 text-base font-medium text-text outline-none"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-brand"
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                      disabled={isSubmitting}
                    >
                      {showPassword ? "숨기기" : "보기"}
                    </button>
                  </div>
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
                  className={`inline-flex h-14 w-full items-center justify-center rounded-full text-lg font-bold transition-all duration-200 ${
                    isDisabled
                      ? "cursor-not-allowed bg-brand/30 text-white/60 shadow-none"
                      : "bg-brand text-white shadow-glow hover:bg-[#d63040] active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? "로그인 중..." : "로그인"}
                </button>
              </form>

              <p className="mt-6 rounded-full border border-border bg-soft px-4 py-2 text-center text-sm font-medium text-muted">
                계정 발급은 관리자에게 문의하세요
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between px-2 text-xs font-semibold tracking-[0.12em] text-muted">
              <p>© 2024 AIM ON INC.</p>
              <div className="flex items-center gap-4">
                <button type="button" className="transition hover:text-brand">PRIVACY</button>
                <button type="button" className="transition hover:text-brand">TERMS</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
