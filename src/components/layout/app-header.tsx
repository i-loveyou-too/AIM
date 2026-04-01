"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";

type AppHeaderProps = {
  title: string;
  greeting: string;
  profile: {
    name: string;
    role: string;
    initials: string;
  };
};

export function AppHeader({ title, greeting, profile }: AppHeaderProps) {
  const pathname = usePathname();
  const isStudentListPage = pathname === "/dashboard/students";
  const isStudentReportPage = pathname.startsWith("/dashboard/students/") && pathname.endsWith("/report");
  const isStudentDetailPage = pathname.startsWith("/dashboard/students/") && pathname !== "/dashboard/students" && !isStudentReportPage;
  const isTodayLessonsPage = pathname === "/dashboard/today-lessons";
  const isCurriculumPage = pathname === "/dashboard/curriculum";
  const isAssignmentsPage = pathname === "/dashboard/assignments";

  if (isCurriculumPage) {
    return (
      <header className="px-0.5 py-0.5 sm:px-1.5">
        <div className="rounded-[26px] border border-border/80 bg-white/85 px-3.5 py-3.5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                계획 · 커리큘럼
              </p>
              <p className="text-sm text-muted">
                시험일까지 역산한 학습 계획과 현재 진도를 비교해 다음 수업 방향을 정리합니다.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <div className="ml-1 flex items-center gap-2.5 rounded-full border border-border bg-white px-2.5 py-1.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isAssignmentsPage) {
    return (
      <header className="px-0.5 py-0.5 sm:px-1.5">
        <div className="rounded-[26px] border border-border/80 bg-white/85 px-3.5 py-3.5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                과제 운영 · 분석 · 반영
              </p>
              <p className="text-sm text-muted">
                반별 과제 운영, 제출 상태, 공통 오답, 다음 수업 반영 포인트를 한눈에 관리합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <div className="ml-1 flex items-center gap-2.5 rounded-full border border-border bg-white px-2.5 py-1.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // 학생 목록 페이지는 상단 검색 바와 알림/프로필 중심으로 보여줍니다.
  // 오늘 수업 운영 페이지 — 상단 헤더
  if (isTodayLessonsPage) {
    return (
      <header className="px-0.5 py-0.5 sm:px-1.5">
        <div className="rounded-[26px] border border-border/80 bg-white/85 px-3.5 py-3.5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                수업 준비 · 운영
              </p>
              <p className="text-sm text-muted">
                오늘 수업 일정, 진도, 약점, 숙제 반영을 한 화면에서 확인하고 바로 수업에 들어가세요.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <div className="ml-1 flex items-center gap-2.5 rounded-full border border-border bg-white px-2.5 py-1.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isStudentReportPage) {
    return (
      <header className="px-1 py-1 sm:px-2">
        <div className="rounded-[28px] border border-border/80 bg-white/85 px-4 py-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <Link
                href="/dashboard/students"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-4 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
              >
                ← 학생 목록
              </Link>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-brand">학생 리포트</p>
                <h1 className="mt-2 text-[1.45rem] font-extrabold tracking-tight text-text sm:text-[1.7rem]">
                  4주간 성취 추이와 분석 리포트
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted">
                  성취도 변화, 숙제 수행률, 취약 단원, 시험 준비도를 한눈에 파악합니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <div className="ml-1 flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isStudentListPage) {
    return (
      <header className="px-0.5 py-0.5 sm:px-1.5">
        <div className="rounded-[26px] border border-border/80 bg-white/85 px-3.5 py-3.5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex items-center gap-2.5 rounded-full border border-border bg-soft px-3.5 py-2.5 shadow-sm xl:min-w-[380px] xl:max-w-[520px]">
              <span className="text-lg text-muted">🔎</span>
              <input
                type="search"
                placeholder="학생 이름을 검색하세요"
                className="w-full bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted/70"
              />
            </label>

            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="도움말"
              >
                ?
              </button>

              <div className="ml-1 flex items-center gap-2.5 rounded-full border border-border bg-white px-2.5 py-1.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isStudentDetailPage) {
    return (
      <header className="px-1 py-1 sm:px-2">
        <div className="rounded-[28px] border border-border/80 bg-white/85 px-4 py-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <Link
                href="/dashboard/students"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-4 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
              >
                ← 학생 목록
              </Link>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-brand">학생 상세</p>
                <h1 className="mt-2 text-[1.45rem] font-extrabold tracking-tight text-text sm:text-[1.7rem]">
                  개별 학생의 흐름을 집중해서 확인합니다
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted">
                  시험일, 과제, 취약 단원, 계획 조정 여부를 한 화면에서 빠르게 봅니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="도움말"
              >
                ?
              </button>

              <div className="ml-1 flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return <Header title={title} greeting={greeting} profile={profile} />;
}
