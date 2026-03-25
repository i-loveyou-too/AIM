import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type CurriculumReversePlanSectionProps = {
  reversePlan: CurriculumPageData["reversePlan"];
};

export function CurriculumReversePlanSection({ reversePlan }: CurriculumReversePlanSectionProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          시험일 역산 계획
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          시험일까지 역산한 학습 흐름을 확인합니다
        </h2>
        <p className="mt-1 text-sm text-muted">
          전체 계획 기간, 남은 단원 수, 계획상 현재 위치와 실제 위치를 함께 비교합니다.
        </p>
      </div>

      <div className="grid gap-4 px-6 py-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="rounded-[24px] border border-border/70 bg-soft p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand">
              {reversePlan.totalPeriod}
            </span>
            <span className="rounded-full bg-warm/60 px-3 py-1 text-[11px] font-bold text-[#7a6200]">
              {reversePlan.gapSummary}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted">계획상 도달 목표</p>
              <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text">
                {reversePlan.algorithmTarget}
              </p>
            </div>
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted">실제 현재 위치</p>
              <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-brand">
                {reversePlan.actualTarget}
              </p>
            </div>
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted">남은 단원 수</p>
              <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text">
                {reversePlan.remainingUnits}개
              </p>
            </div>
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted">남은 수업 수</p>
              <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text">
                {reversePlan.remainingLessons}회
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-brand/15 bg-brand/5 p-4">
            <p className="text-xs font-semibold text-brand">현재 판단</p>
            <p className="mt-2 text-sm leading-6 text-text">{reversePlan.paceSummary}</p>
            <p className="mt-3 text-sm font-semibold text-brand">
              목표 단원: {reversePlan.focusUnit}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-[24px] border border-border/70 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                주간 목표
              </p>
              <h3 className="mt-1 text-base font-extrabold tracking-tight text-text">
                {reversePlan.weeklyTarget}
              </h3>
            </div>
            <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">
              {reversePlan.completionEstimate}
            </span>
          </div>

          <div className="space-y-2">
            <div className="rounded-[20px] bg-soft px-4 py-3">
              <p className="text-[11px] font-semibold text-muted">계획상 위치</p>
              <p className="mt-1 text-sm font-bold text-text">{reversePlan.algorithmTarget}</p>
            </div>
            <div className="rounded-[20px] bg-soft px-4 py-3">
              <p className="text-[11px] font-semibold text-muted">실제 위치</p>
              <p className="mt-1 text-sm font-bold text-brand">{reversePlan.actualTarget}</p>
            </div>
            <div className="rounded-[20px] bg-warm/40 px-4 py-3">
              <p className="text-[11px] font-semibold text-[#7a6200]">차이 요약</p>
              <p className="mt-1 text-sm font-bold text-text">{reversePlan.gapSummary}</p>
            </div>
            <div className="rounded-[20px] border border-border bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold text-muted">다음 점검</p>
              <p className="mt-1 text-sm font-bold text-text">{reversePlan.nextCheckpoint}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
