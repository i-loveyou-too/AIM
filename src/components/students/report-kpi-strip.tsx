import type { StudentDetailData } from "@/types/student-detail";

export function ReportKpiStrip({ detail }: { detail: StudentDetailData }) {
  const { student } = detail;
  const delta = Math.max(5, Math.round(student.score * 0.15));
  const weakestTopic = detail.weaknesses.topics[0] ?? "해당 없음";

  const kpis = [
    {
      label: "평균 성취도",
      value: `${student.score}%`,
      note: "현재 기준",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <polyline points="1,12 5,7 9,9 15,3" stroke="#F04452" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="15" cy="3" r="1.5" fill="#F04452"/>
        </svg>
      ),
    },
    {
      label: "최근 3개월 상승폭",
      value: `+${delta}점`,
      note: "8월 대비 10월",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 13V3M8 3L4 7M8 3L12 7" stroke="#F04452" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "가장 취약한 단원",
      value: weakestTopic,
      note: "우선 집중 필요",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="#F04452" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="3" stroke="#F04452" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="1" fill="#F04452"/>
        </svg>
      ),
    },
    {
      label: "최고 집중 시간대",
      value: "오후 (16–20시)",
      note: "학습 효율 최고점",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="#F04452" strokeWidth="1.5"/>
          <path d="M8 4.5V8L10.5 10" stroke="#F04452" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-[20px] border border-border/80 bg-white px-4 py-3.5 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/10 text-brand">
              {kpi.icon}
            </span>
            <span className="text-[11px] font-medium text-muted">{kpi.label}</span>
          </div>
          <p className="mt-2.5 truncate text-[1.05rem] font-extrabold tracking-tight text-text">
            {kpi.value}
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-muted">{kpi.note}</p>
        </div>
      ))}
    </section>
  );
}
