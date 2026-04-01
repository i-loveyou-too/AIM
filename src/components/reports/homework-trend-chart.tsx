// 숙제 수행률 추이 차트 — CSS 바 차트
// 최근 4주 완료율을 시각적으로 비교

function barColor(rate: number): string {
  if (rate >= 85) return "bg-emerald-500";
  if (rate >= 70) return "bg-warm";
  return "bg-brand";
}

function rateTextColor(rate: number): string {
  if (rate >= 85) return "text-emerald-600";
  if (rate >= 70) return "text-[#8a6200]";
  return "text-brand";
}

type HomeworkTrendPoint = {
  week: string;
  note?: string;
  submitted: number;
  total: number;
  completionRate: number;
};

export function HomeworkTrendChart({ data }: { data: HomeworkTrendPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-8 shadow-soft">
        <p className="text-sm font-semibold text-muted">숙제 수행률 데이터가 없습니다.</p>
      </section>
    );
  }

  const latest  = data[data.length - 1];
  const prev    = data[data.length - 2] ?? latest;
  const diff    = (latest?.completionRate ?? 0) - (prev?.completionRate ?? 0);

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">숙제 수행률 추이</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          최근 4주 숙제 완료율 변화
        </h2>
        <p className="mt-1 text-sm text-muted">
          주간 숙제 제출 현황과 수행률 흐름을 확인하세요.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* 최신값 요약 */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[1.6rem] font-extrabold tracking-tight ${rateTextColor(latest.completionRate)}`}>
              {latest.completionRate}%
            </span>
            <span className="text-sm font-semibold text-muted">지난 주 수행률</span>
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
            diff >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-brand/10 text-brand"
          }`}>
            <span>{diff >= 0 ? "↑" : "↓"}</span>
            <span>{Math.abs(diff)}% (전주 대비)</span>
          </div>
        </div>

        {/* 바 차트 */}
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.week}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text">{item.week}</span>
                  {item.note && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                      {item.note}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">
                    {item.submitted}/{item.total}건
                  </span>
                  <span className={`text-sm font-extrabold ${rateTextColor(item.completionRate)}`}>
                    {item.completionRate}%
                  </span>
                </div>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-soft">
                {/* 목표선 (85%) */}
                <div
                  className="absolute top-0 h-full w-px bg-muted/30"
                  style={{ left: "85%" }}
                />
                {/* 실제 바 */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor(item.completionRate)}`}
                  style={{ width: `${item.completionRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border/50 pt-4">
          <p className="text-[11px] font-semibold text-muted">수행률 기준</p>
          {[
            { label: "85% 이상 — 우수", color: "bg-emerald-500" },
            { label: "70–84% — 보통",  color: "bg-warm" },
            { label: "70% 미만 — 주의", color: "bg-brand" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              {item.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-3 w-px bg-muted/40" />
            세로선 = 목표 85%
          </span>
        </div>
      </div>
    </section>
  );
}
