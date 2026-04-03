import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aim ON 시작하기",
  description: "선생님 포털과 학생 포털 중 하나를 선택해 Aim ON에 접속합니다.",
};

const PORTALS = [
  {
    id: "teacher",
    icon: "🏫",
    title: "선생님 포털",
    badge: null as string | null,
    features: ["학생 관리", "수업 운영", "리포트 및 학원 운영"],
    buttonLabel: "선생님 로그인",
    buttonClass: "bg-brand text-white group-hover:bg-[#d63040]",
    href: "/login/teacher",
    hoverClass: "hover:border-brand/25 hover:shadow-glow",
  },
  {
    id: "student",
    icon: "📘",
    title: "학생 포털",
    badge: "FOCUS",
    features: ["오늘 할 일", "과제 제출", "AI 코치와 학습 리포트"],
    buttonLabel: "학생 로그인",
    buttonClass: "bg-text text-white group-hover:bg-[#2d2d35]",
    href: "/login/student",
    hoverClass: "hover:border-warm/40",
  },
] as const;

export default function PortalSelectPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f5f3]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[-10%] top-[12%] h-[320px] w-[320px] rounded-full bg-brand/[0.05] blur-3xl sm:left-[2%] sm:h-[420px] sm:w-[420px]" />
        <div className="absolute right-[-12%] top-[18%] h-[300px] w-[300px] rounded-full bg-warm/[0.09] blur-3xl sm:right-[4%] sm:h-[420px] sm:w-[420px]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1120px] flex-col justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <Image
              src="/aim-on-logo.png"
              alt="Aim ON"
              width={36}
              height={36}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              priority
            />
            <span className="text-[1.45rem] font-black tracking-[-0.02em] text-brand sm:text-[1.6rem]">
              Aim ON
            </span>
          </div>

          <div className="mt-8 max-w-[640px]">
            <h1 className="text-[1.9rem] font-black tracking-tight text-text sm:text-[2.35rem] lg:text-[2.7rem]">
              포털을 선택하고 바로 시작하세요
            </h1>
            <p className="mt-3 text-[0.96rem] leading-7 text-muted sm:text-base sm:leading-8">
              선생님은 운영과 수업 관리를, 학생은 오늘 학습과 과제 흐름을
              같은 Aim ON 안에서 이어갈 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mt-10 grid w-full gap-5 md:grid-cols-2 lg:mt-12">
          {PORTALS.map((portal) => (
            <Link
              key={portal.id}
              href={portal.href}
              aria-label={`${portal.title}로 이동`}
              className={[
                "group relative flex min-h-[320px] flex-col overflow-hidden rounded-[28px]",
                "border border-border/70 bg-white p-6 shadow-soft transition-all duration-200",
                "sm:p-7 lg:p-8",
                "hover:-translate-y-0.5",
                portal.hoverClass,
              ].join(" ")}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={
                  portal.id === "teacher"
                    ? { background: "radial-gradient(circle at top left, rgba(240,68,82,0.04), transparent 60%)" }
                    : { background: "radial-gradient(circle at top right, rgba(255,228,77,0.07), transparent 60%)" }
                }
                aria-hidden
              />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-soft text-2xl">
                {portal.icon}
              </div>

              <div className="relative mt-5 flex flex-wrap items-center gap-2.5">
                <h2 className="text-[1.28rem] font-extrabold tracking-tight text-text sm:text-[1.4rem]">
                  {portal.title}
                </h2>
                {portal.badge ? (
                  <span className="rounded-full border border-warm/70 bg-warm/80 px-2.5 py-0.5 text-[10.5px] font-bold tracking-[0.1em] text-[#6b5400]">
                    {portal.badge}
                  </span>
                ) : null}
              </div>

              <ul className="relative mt-5 flex-1 space-y-2.5">
                {portal.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-[0.92rem] text-muted">
                    <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-muted/35" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>

              <span
                className={[
                  "relative mt-8 flex h-[52px] w-full items-center justify-center rounded-2xl",
                  "text-[0.95rem] font-bold tracking-[0.01em] transition-colors duration-150",
                  portal.buttonClass,
                ].join(" ")}
              >
                {portal.buttonLabel}
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/40 px-5 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center justify-between gap-3 text-[11px] font-semibold tracking-[0.1em] text-muted/60 sm:flex-row">
          <p>© 2025 AIM ON INC.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="푸터 링크">
            <button type="button" className="transition hover:text-brand">
              이용약관
            </button>
            <button type="button" className="transition hover:text-brand">
              개인정보처리방침
            </button>
            <button type="button" className="transition hover:text-brand">
              고객지원
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
