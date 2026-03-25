// 시험일 역산 계획 섹션 — 계획 vs 실제 현황 요약

import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type Props = { reversePlan: CurriculumPageData["reversePlan"] };

export function CurriculumReversePlanSection({ reversePlan }: Props) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          시험일 역산 계획
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          계획 대비 현재 진도
        </h2>
        <p className="mt-1 text-sm text-muted">
          {reversePlan.totalPeriod}
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-warm/50 px-3 py-1 text-xs font-bold text-[#7a6200]">
            {reversePlan.gapSummary}
          </span>
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-muted">
            완료 예상 {reversePlan.completionEstimate}
          </span>
        </div>

        {/* 핵심 지표 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/60 bg-soft px-4 py-3.5">
            <p className="text-[11px] font-semibold text-muted">남은 단원</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-text">
              {reversePlan.remainingUnits}<span className="ml-0.5 text-sm font-semibold text-muted">개</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-soft px-4 py-3.5">
            <p className="text-[11px] font-semibold text-muted">남은 수업</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-text">
              {reversePlan.remainingLessons}<span className="ml-0.5 text-sm font-semibold text-muted">회</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white px-4 py-3.5 shadow-sm">
            <p className="text-[11px] font-semibold text-muted">계획 위치</p>
            <p className="mt-1 text-sm font-bold text-text leading-snug">{reversePlan.algorithmTarget}</p>
          </div>
          <div className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3.5">
            <p className="text-[11px] font-semibold text-brand">실제 위치</p>
            <p className="mt-1 text-sm font-bold text-brand leading-snug">{reversePlan.actualTarget}</p>
          </div>
        </div>

        {/* 주간 목표 */}
        <div className="rounded-2xl border border-border/60 bg-soft px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-muted">이번 주 목표</p>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">
              {reversePlan.completionEstimate}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-bold text-text">{reversePlan.weeklyTarget}</p>
          <p className="mt-1 text-xs text-muted">다음 점검 · {reversePlan.nextCheckpoint}</p>
        </div>

        {/* 현재 판단 */}
        <div className="rounded-2xl border border-brand/15 bg-brand/5 px-4 py-4">
          <p className="text-[11px] font-bold text-brand mb-1.5">현재 판단</p>
          <p className="text-sm leading-6 text-text">{reversePlan.paceSummary}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-muted">우선 단원</span>
            <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white">
              {reversePlan.focusUnit}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
