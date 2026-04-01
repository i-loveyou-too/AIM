// 리포트 KPI 요약 카드
// 대시보드 summaryCard와 달리 "변화 추이" 정보를 함께 보여주는 분석형 카드

type Tone = "brand" | "warm" | "accent" | "soft" | "alert";
type ChangeDir = "up" | "down" | "neutral";

const toneMap: Record<Tone, { icon: string; value: string; bg: string }> = {
  brand:  { icon: "bg-brand/10 text-brand",       value: "text-brand",       bg: "hover:border-brand/30"  },
  warm:   { icon: "bg-warm/70 text-[#7a6200]",    value: "text-[#7a6200]",   bg: "hover:border-warm/60"   },
  accent: { icon: "bg-accent/10 text-accent",     value: "text-accent",      bg: "hover:border-accent/30" },
  soft:   { icon: "bg-soft text-muted",            value: "text-text",        bg: "hover:border-border"    },
  alert:  { icon: "bg-brand/10 text-brand",        value: "text-brand",       bg: "hover:border-brand/40"  },
};

const changeDirStyle: Record<ChangeDir, { text: string; arrow: string }> = {
  up:      { text: "text-emerald-600", arrow: "↑" },
  down:    { text: "text-brand",       arrow: "↓" },
  neutral: { text: "text-muted",       arrow: "→" },
};

type ReportSummaryCard = {
  id: string;
  tone: Tone;
  changeDir: ChangeDir;
  icon: string;
  change: string;
  label: string;
  value: string;
  note: string;
};

export function ReportSummaryCards({ data }: { data: ReportSummaryCard[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((kpi) => {
        const tone = toneMap[kpi.tone];
        const dir  = changeDirStyle[kpi.changeDir];
        return (
          <div
            key={kpi.id}
            className={`rounded-[24px] border border-border/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 ${tone.bg}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${tone.icon}`}>
                {kpi.icon}
              </div>
              {/* 변화 방향 뱃지 */}
              <span className={`flex items-center gap-0.5 rounded-full bg-soft px-2.5 py-1 text-[11px] font-bold ${dir.text}`}>
                <span>{dir.arrow}</span>
                <span>{kpi.change}</span>
              </span>
            </div>

            <p className="mt-4 text-xs font-semibold text-muted">{kpi.label}</p>
            <p className={`mt-1 text-[1.4rem] font-extrabold tracking-tight ${tone.value}`}>
              {kpi.value}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-muted">{kpi.note}</p>
          </div>
        );
      })}
    </section>
  );
}
