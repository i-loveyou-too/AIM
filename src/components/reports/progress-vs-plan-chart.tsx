// 진도 달성 / 계획 대비 현황 차트
// 계획 단원 수 vs 실제 완료 단원 수 비교 + 주간 breakdown

type WeeklyProgress = {
  week: string;
  label: string;
  planned: number;
  actual: number;
  note?: string;
};

type ProgressVsPlanData = {
  totalUnits: number;
  plannedUnits: number;
  plannedPercent: number;
  actualUnits: number;
  actualPercent: number;
  status: string;
  currentUnit: string;
  delayNote?: string;
  weeklyBreakdown: WeeklyProgress[];
};

export function ProgressVsPlanChart({ data }: { data: ProgressVsPlanData | null | undefined }) {
  if (!data) {
    return (
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-8 shadow-soft">
        <p className="text-sm font-semibold text-muted">진도 비교 데이터가 없습니다.</p>
      </section>
    );
  }

  const plannedBar = (data.plannedUnits / data.totalUnits) * 100;
  const actualBar  = (data.actualUnits  / data.totalUnits) * 100;
  const gap        = data.plannedPercent - data.actualPercent;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">진도 달성 현황</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          계획 대비 실제 진도
        </h2>
        <p className="mt-1 text-sm text-muted">
          목표 커리큘럼 대비 현재까지 완료한 진도를 확인하세요.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* 상단 요약 */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-soft px-4 py-3">
            <p className="text-[11px] font-semibold text-muted">전체 단원</p>
            <p className="mt-1 text-xl font-extrabold text-text">{data.totalUnits}개</p>
          </div>
          <div className="rounded-2xl bg-soft px-4 py-3">
            <p className="text-[11px] font-semibold text-muted">계획 완료 예정</p>
            <p className="mt-1 text-xl font-extrabold text-text">{data.plannedUnits}개</p>
            <p className="text-[10px] text-muted">{data.plannedPercent}%</p>
          </div>
          <div className="rounded-2xl bg-soft px-4 py-3">
            <p className="text-[11px] font-semibold text-muted">실제 완료</p>
            <p className="mt-1 text-xl font-extrabold text-brand">{data.actualUnits}개</p>
            <p className="text-[10px] text-brand">{data.actualPercent}%</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 ${gap > 0 ? "bg-warm/40" : "bg-emerald-50"}`}>
            <p className="text-[11px] font-semibold text-muted">계획 대비</p>
            <p className={`mt-1 text-xl font-extrabold ${gap > 0 ? "text-[#7a6200]" : "text-emerald-600"}`}>
              {gap > 0 ? `-${gap}%` : `+${Math.abs(gap)}%`}
            </p>
            <p className={`text-[10px] font-semibold ${gap > 0 ? "text-[#7a6200]" : "text-emerald-600"}`}>
              {data.status}
            </p>
          </div>
        </div>

        {/* 비교 바 */}
        <div className="mb-6 space-y-3">
          {/* 계획 바 */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                <span className="h-2 w-2 rounded-full bg-border" />
                계획 진도
              </span>
              <span className="text-xs font-bold text-muted">{data.plannedPercent}% ({data.plannedUnits}/{data.totalUnits}단원)</span>
            </div>
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-border/60 transition-all duration-500"
                style={{ width: `${plannedBar}%` }}
              />
            </div>
          </div>

          {/* 실제 바 */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                <span className="h-2 w-2 rounded-full bg-brand" />
                실제 완료
              </span>
              <span className="text-xs font-bold text-brand">{data.actualPercent}% ({data.actualUnits}/{data.totalUnits}단원)</span>
            </div>
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${actualBar}%` }}
              />
            </div>
          </div>
        </div>

        {/* 현재 진행 단원 */}
        <div className="mb-5 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
          <p className="text-[11px] font-semibold text-brand">현재 진행 단원</p>
          <p className="mt-0.5 text-sm font-bold text-text">{data.currentUnit}</p>
          {data.delayNote && (
            <p className="mt-1 text-[11px] text-muted">{data.delayNote}</p>
          )}
        </div>

        {/* 주간 breakdown */}
        <div>
          <p className="mb-3 text-xs font-bold text-text">주간 진도 상세</p>
          <div className="space-y-2">
            {data.weeklyBreakdown.map((w) => {
              const isDelayed = w.actual < w.planned;
              return (
                <div key={w.week} className="flex items-center gap-3 rounded-xl border border-border/60 bg-soft/50 px-4 py-2.5">
                  <span className="w-16 text-xs font-semibold text-muted">{w.label}</span>
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-[11px] text-muted">계획 {w.planned}단원</span>
                    <span className="text-muted/50">→</span>
                    <span className={`text-[11px] font-bold ${isDelayed ? "text-[#7a6200]" : "text-text"}`}>
                      실제 {w.actual}단원
                    </span>
                  </div>
                  {w.note ? (
                    <span className="rounded-full bg-warm/60 px-2 py-0.5 text-[10px] font-semibold text-[#7a6200]">
                      {w.note}
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      정상
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
