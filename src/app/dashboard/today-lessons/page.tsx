// 오늘 수업 운영 페이지
// 교사가 오늘 수업 전·중·후 흐름을 한 화면에서 준비하고 운영하는 핵심 페이지

import Link from "next/link";
import { TodayLessonsSummaryCards } from "@/components/today-lessons/today-summary-cards";
import { TodayScheduleSection } from "@/components/today-lessons/today-schedule-section";
import { LessonPrepCard } from "@/components/today-lessons/lesson-prep-card";
import { WeaknessOverviewSection } from "@/components/today-lessons/weakness-overview-section";
import { HomeworkReflectionSection } from "@/components/today-lessons/homework-reflection-section";
import { MaterialsPanel } from "@/components/today-lessons/materials-panel";
import { getTeacherTodayLessonsOverview } from "@/lib/api/teacher";

export default async function TodayLessonsPage() {
  let overview: any = null;
  try {
    overview = await getTeacherTodayLessonsOverview();
  } catch {
    overview = null;
  }

  const summary = overview?.summary ?? {
    totalLessons: 0,
    focusStudents: 0,
    homeworkIssues: 0,
    teachingPoints: 0,
    examImminentStudents: 0,
  };

  const schedule = overview?.schedule ?? [];
  const preps = overview?.preps ?? [];
  const weaknessOverview = overview?.weaknessOverview ?? [];
  const homeworkReflection = overview?.homeworkReflection ?? {
    criticalItems: [],
    incompleteHomework: [],
    commonReExplanation: [],
    reinforcementNeeded: [],
  };
  const materials = overview?.materials ?? [];
  const nextActions = overview?.nextActions ?? [];

  return (
    <div className="space-y-6">
      {/* ── 페이지 헤더 ──────────────────────────────────────── */}
      <header className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* 좌측: 제목 + 설명 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              수업 준비 · 운영
            </p>
            <h1 className="mt-1.5 text-[1.5rem] font-extrabold tracking-tight text-text sm:text-[1.8rem]">
              오늘 수업 운영
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              오늘 수업 일정, 학생별 진도 위치, 설명 포인트, 취약 단원, 숙제 반영 사항을
              한 화면에서 확인하고 바로 수업에 들어가세요.
            </p>
          </div>

          {/* 우측: CTA 버튼 그룹 */}
          <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
            <button
              type="button"
              className="rounded-full border border-brand bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              수업 메모 작성
            </button>
            <button
              type="button"
              className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
            >
              진도 업데이트
            </button>
            <Link
              href="/dashboard/today-lessons#materials"
              className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
            >
              자료 보기
            </Link>
            <Link
              href="/dashboard/curriculum#reverse-plan"
              className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
            >
              계획 보기
            </Link>
          </div>
        </div>
      </header>

      {/* ── 상단 요약 카드 ────────────────────────────────────── */}
      <TodayLessonsSummaryCards summary={summary} />

      {/* ── 오늘 수업 일정 ────────────────────────────────────── */}
      <div id="schedule">
        <TodayScheduleSection schedule={schedule} />
      </div>

      {/* ── 수업별 준비 카드 ──────────────────────────────────── */}
      <section id="lesson-prep" className="space-y-4">
        <div className="px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            수업별 준비
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
            수업별 상세 준비 카드
          </h2>
          <p className="mt-1 text-sm text-muted">
            각 수업에서 다룰 진도, 설명 포인트, 약점, 숙제 반영, 운영 메모를 확인하세요.
          </p>
        </div>
        {preps.map((lesson: any, idx: number) => (
          <LessonPrepCard key={lesson.id} lesson={lesson} index={idx} nextActions={nextActions} />
        ))}
      </section>

      {/* ── 약점 / 집중 관리 + 숙제 반영 — 2컬럼 ────────────── */}
      <div id="homework" className="grid gap-6 xl:grid-cols-2">
        <WeaknessOverviewSection weaknessOverview={weaknessOverview} />
        <HomeworkReflectionSection homeworkReflection={homeworkReflection} />
      </div>

      {/* ── 오늘 자료 패널 ────────────────────────────────────── */}
      <div id="materials" className="scroll-mt-24">
        <MaterialsPanel materials={materials} />
      </div>

    </div>
  );
}
