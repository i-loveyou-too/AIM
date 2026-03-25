import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type CurriculumRiskSectionProps = {
  risks: CurriculumPageData["risks"];
};

const severityStyles: Record<CurriculumPageData["risks"]["items"][number]["severity"], string> = {
  높음: "bg-brand/10 text-brand",
  중간: "bg-warm/60 text-[#7a6200]",
  낮음: "bg-soft text-muted",
};

export function CurriculumRiskSection({ risks }: CurriculumRiskSectionProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          지연 위험 / 시험 위험
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          지금 가장 위험한 구간을 먼저 정리합니다
        </h2>
        <p className="mt-1 text-sm text-muted">
          지연이 반복되는 단원, 보강이 없으면 위험한 단원, 우선 처리해야 할 반과 학생을 표시합니다.
        </p>
      </div>

      <div className="grid gap-4 px-6 py-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[24px] border border-brand/15 bg-brand/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">가장 위험한 대상</p>
          <h3 className="mt-2 text-[1.15rem] font-extrabold tracking-tight text-text">
            {risks.highestRisk}
          </h3>
          <p className="mt-3 text-sm leading-6 text-text">{risks.summary}</p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">위험 신호</p>
          <div className="mt-4 space-y-3">
            {risks.items.map((item) => (
              <article key={item.title} className="rounded-[22px] border border-border bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold tracking-tight text-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.reason}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${severityStyles[item.severity]}`}>
                    {item.severity}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-soft px-3 py-1 text-[11px] font-semibold text-text">
                    대상: {item.target}
                  </span>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">
                    다음: {item.nextStep}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
