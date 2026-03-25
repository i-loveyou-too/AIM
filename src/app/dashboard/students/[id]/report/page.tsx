import type { Metadata } from "next";
import Link from "next/link";
import { ReportSummaryCards } from "@/components/reports/report-summary-cards";
import { AchievementTrendChart } from "@/components/reports/achievement-trend-chart";
import { HomeworkTrendChart } from "@/components/reports/homework-trend-chart";
import { ProgressVsPlanChart } from "@/components/reports/progress-vs-plan-chart";
import { WeaknessAnalysisSection } from "@/components/reports/weakness-analysis-section";
import { ExamReadinessSection } from "@/components/reports/exam-readiness-section";
import { TeacherReportComment } from "@/components/reports/teacher-report-comment";
import { NextDirectionSection } from "@/components/reports/next-direction-section";
import {
  reportStudent,
  recentMilestones,
} from "@/lib/mock-data/student-report-mock-data";

export const metadata: Metadata = {
  title: "학생 리포트 | Aim ON",
  description: "학생의 4주간 추이, 성취도, 숙제, 취약 단원, 시험 준비도를 분석합니다.",
};

const milestoneTypeStyle: Record<string, { bg: string; text: string; dot: string }> = {
  수업:    { bg: "bg-brand/10",    text: "text-brand",       dot: "bg-brand"       },
  과제:    { bg: "bg-accent/10",   text: "text-accent",      dot: "bg-accent"      },
  피드백:  { bg: "bg-soft",        text: "text-muted",       dot: "bg-muted/50"    },
  시험:    { bg: "bg-warm/50",     text: "text-[#7a6200]",   dot: "bg-warm"        },
};

export default function StudentReportPage() {
  const student = reportStudent;

  return (
    <main className="space-y-6">
      {/* ── 리포트 헤더 ──────────────────────────────── */}
      <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
        <div className="px-6 py-6 sm:px-8">
          {/* 상단 메타 */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand">
              📊 학생 리포트
            </span>
            <span className="rounded-full bg-soft px-3 py-1 text-[11px] font-semibold text-muted">
              {student.reportPeriod}
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              student.overallStatus === "주의 필요"
                ? "bg-brand/10 text-brand"
                : "bg-emerald-50 text-emerald-600"
            }`}>
              {student.overallStatus}
            </span>
          </div>

          {/* 학생 정보 */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {student.subject} · {student.className}
              </p>
              <h1 className="mt-1.5 text-[2rem] font-extrabold tracking-tight text-text sm:text-[2.4rem]">
                {student.name}
                <span className="ml-2 text-lg font-semibold text-muted">{student.grade}</span>
              </h1>
              <p className="mt-1 text-sm text-muted">{student.school} · ID {student.id}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* D-day 뱃지 */}
              <div className="flex items-center gap-2 rounded-2xl border border-brand/25 bg-brand/5 px-4 py-2.5">
                <span className="text-lg">📅</span>
                <div>
                  <p className="text-[10px] font-semibold text-brand">시험일 {student.examDate}</p>
                  <p className="text-lg font-extrabold text-brand leading-none">{student.dDay}</p>
                </div>
              </div>

              {/* 상세 보기 링크 */}
              <Link
                href={`/dashboard/students/${student.id}`}
                className="rounded-full border border-border bg-soft px-4 py-2.5 text-xs font-semibold text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
              >
                ← 학생 상세 보기
              </Link>
            </div>
          </div>

          {/* 종합 인사이트 */}
          <div className="mt-5 rounded-2xl border border-brand/15 bg-brand/5 px-5 py-4">
            <p className="text-[11px] font-bold text-brand mb-1">종합 인사이트</p>
            <p className="text-sm text-text leading-relaxed">{student.summaryInsight}</p>
          </div>
        </div>
      </section>

      {/* ── KPI 요약 카드 ─────────────────────────────── */}
      <ReportSummaryCards />

      {/* ── 최근 주요 이력 타임라인 ───────────────────── */}
      <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
        <div className="border-b border-border/60 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">최근 이력</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">최근 주요 활동</h2>
        </div>
        <div className="px-6 py-5">
          <div className="relative space-y-3 pl-5">
            {/* 타임라인 세로선 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />
            {recentMilestones.map((m, i) => {
              const style = milestoneTypeStyle[m.type] ?? milestoneTypeStyle["피드백"];
              return (
                <div key={i} className="relative flex items-start gap-4">
                  {/* 도트 */}
                  <span className={`absolute -left-5 mt-1.5 h-3 w-3 rounded-full border-2 border-white ${style.dot} ring-1 ring-border/50`} />
                  <div className="flex-1 rounded-xl border border-border/50 bg-soft/40 px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${style.bg} ${style.text}`}>
                        {m.type}
                      </span>
                      <span className="text-[11px] font-semibold text-muted">{m.date}</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-text">{m.title}</p>
                    <p className="text-[11px] text-muted">{m.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 성취도 추이 + 숙제 수행률 ─────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <AchievementTrendChart />
        <HomeworkTrendChart />
      </div>

      {/* ── 진도 달성 현황 ────────────────────────────── */}
      <ProgressVsPlanChart />

      {/* ── 취약 단원 분석 ────────────────────────────── */}
      <WeaknessAnalysisSection />

      {/* ── 시험 준비도 ───────────────────────────────── */}
      <ExamReadinessSection />

      {/* ── 선생님 코멘트 + 다음 방향 ─────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <TeacherReportComment />
        <NextDirectionSection />
      </div>
    </main>
  );
}
