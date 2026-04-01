import type { StudentDetailData } from "@/types/student-detail";

export function ReportWeakPoint({ detail }: { detail: StudentDetailData }) {
  const { weakAnalysis, progressReport } = detail.aiInsight;
  const displayItems = weakAnalysis.slice(0, 3);

  // Fallback items if API returns empty
  const items =
    displayItems.length > 0
      ? displayItems
      : [
          { title: "삼각함수", progressRate: 42, statusLabel: "우선 보강" },
          { title: "적분법", progressRate: 58, statusLabel: "관리 필요" },
          { title: "확률과 통계", progressRate: 65, statusLabel: "관찰" },
        ];

  return (
    <article className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-sm" aria-hidden="true">⚠</span>
          <h2 className="text-[1.05rem] font-extrabold tracking-tight text-text">Weak Point Analysis</h2>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold tracking-wide text-brand">
          TARGET PRIORITY
        </span>
      </div>

      {/* Bar chart */}
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.title}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text">{item.title}</span>
                {"statusLabel" in item && (
                  <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-semibold text-muted">
                    {item.statusLabel}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-brand">{item.progressRate}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-soft">
              <div
                className="h-2.5 rounded-full bg-brand transition-all duration-500"
                style={{ width: `${item.progressRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Error Pattern Diagnosis */}
      <div className="mt-5 rounded-[20px] border border-brand/15 bg-[#FFF8F8] p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-xs" aria-hidden="true">🔍</span>
          <p className="text-[11px] font-bold tracking-[0.12em] text-brand">AI Error Pattern Diagnosis</p>
        </div>
        <p className="text-sm leading-6 text-text/80">
          {progressReport.smartInsight}
        </p>
      </div>
    </article>
  );
}
