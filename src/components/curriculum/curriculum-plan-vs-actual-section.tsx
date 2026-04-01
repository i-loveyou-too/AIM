type CurriculumPlanVsActualSectionProps = {
  comparison: {
    totalUnits: number;
    plannedUnits: number;
    plannedPercent: number;
    actualUnits: number;
    actualPercent: number;
    gapSummary: string;
    canFinishBeforeExam: string;
    markers: Array<{
      label: string;
      value: string;
      tone: "brand" | "warm" | "accent" | "soft";
    }>;
    plannedMilestone: string;
    actualMilestone: string;
    finishEstimate: string;
  };
};

export function CurriculumPlanVsActualSection({ comparison }: CurriculumPlanVsActualSectionProps) {
  const plannedBar = (comparison.plannedUnits / comparison.totalUnits) * 100;
  const actualBar = (comparison.actualUnits / comparison.totalUnits) * 100;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          계획 vs 실제 비교
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          계획 대비 현재 진도를 비교합니다
        </h2>
        <p className="mt-1 text-sm text-muted">
          선생님이 지금 늦었는지, 유지 가능한지, 보강이 필요한지를 바로 판단할 수 있도록 비교합니다.
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[22px] bg-soft px-4 py-3">
            <p className="text-[11px] font-semibold text-muted">전체 단원</p>
            <p className="mt-1 text-[1.15rem] font-extrabold text-text">{comparison.totalUnits}개</p>
          </div>
          <div className="rounded-[22px] bg-soft px-4 py-3">
            <p className="text-[11px] font-semibold text-muted">계획상 완료</p>
            <p className="mt-1 text-[1.15rem] font-extrabold text-text">{comparison.plannedUnits}개</p>
            <p className="text-[10px] text-muted">{comparison.plannedPercent}%</p>
          </div>
          <div className="rounded-[22px] bg-soft px-4 py-3">
            <p className="text-[11px] font-semibold text-muted">실제 완료</p>
            <p className="mt-1 text-[1.15rem] font-extrabold text-brand">{comparison.actualUnits}개</p>
            <p className="text-[10px] text-brand">{comparison.actualPercent}%</p>
          </div>
          <div className="rounded-[22px] bg-warm/40 px-4 py-3">
            <p className="text-[11px] font-semibold text-[#7a6200]">차이</p>
            <p className="mt-1 text-[1.15rem] font-extrabold text-[#7a6200]">{comparison.gapSummary}</p>
            <p className="text-[10px] font-semibold text-[#7a6200]">{comparison.canFinishBeforeExam}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#5f6877]">
                <span className="h-2 w-2 rounded-full bg-[#7f8898]" />
                계획 진도
              </span>
              <span className="text-xs font-bold text-[#5f6877]">
                {comparison.plannedPercent}% ({comparison.plannedUnits}/{comparison.totalUnits}단원)
              </span>
            </div>
            <div className="relative h-3.5 w-full overflow-hidden rounded-full border border-[#dbe0e7] bg-[#eef1f5]">
              <div
                className="h-full rounded-full bg-[#8792a6] transition-all duration-500"
                style={{ width: `${plannedBar}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                <span className="h-2 w-2 rounded-full bg-brand" />
                실제 진도
              </span>
              <span className="text-xs font-bold text-brand">
                {comparison.actualPercent}% ({comparison.actualUnits}/{comparison.totalUnits}단원)
              </span>
            </div>
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${actualBar}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {comparison.markers.map((marker) => (
              <div key={marker.label} className="rounded-[20px] border border-border/70 bg-soft px-4 py-3">
                <p className="text-[11px] font-semibold text-muted">{marker.label}</p>
                <p className="mt-1 text-sm font-extrabold tracking-tight text-text">{marker.value}</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    marker.tone === "brand"
                      ? "bg-brand/10 text-brand"
                      : marker.tone === "warm"
                        ? "bg-warm/60 text-[#7a6200]"
                        : marker.tone === "accent"
                          ? "bg-accent/10 text-accent"
                          : "bg-soft text-muted"
                  }`}
                >
                  {marker.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-brand/15 bg-brand/5 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              현재 판단
            </p>
            <p className="mt-2 text-sm leading-7 text-text">
              계획상 도달 위치는 <span className="font-bold text-brand">{comparison.plannedMilestone}</span>, 실제 위치는
              <span className="font-bold text-brand"> {comparison.actualMilestone}</span>입니다.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {comparison.finishEstimate}까지 마무리하려면 기출 연결과 보강을 함께 배치해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
