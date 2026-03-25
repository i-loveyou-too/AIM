import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type CurriculumExamCalendarProps = {
  calendar: CurriculumPageData["calendar"];
};

const toneStyles: Record<
  CurriculumPageData["calendar"]["items"][number]["tone"],
  { chip: string; card: string; dot: string }
> = {
  today: {
    chip: "bg-brand text-white",
    card: "bg-brand/5 border-brand/20",
    dot: "bg-brand",
  },
  lesson: {
    chip: "bg-soft text-brand",
    card: "bg-white border-border",
    dot: "bg-soft",
  },
  boost: {
    chip: "bg-warm/60 text-[#7a6200]",
    card: "bg-warm/20 border-warm/30",
    dot: "bg-warm",
  },
  check: {
    chip: "bg-accent/10 text-accent",
    card: "bg-white border-accent/20",
    dot: "bg-accent",
  },
  exam: {
    chip: "bg-brand/10 text-brand",
    card: "bg-brand/5 border-brand/20",
    dot: "bg-brand",
  },
};

export function CurriculumExamCalendar({ calendar }: CurriculumExamCalendarProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          시험일 역산 캘린더
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          시험일까지의 흐름을 달력으로 확인합니다
        </h2>
        <p className="mt-1 text-sm text-muted">
          오늘, 보강, 중간 점검, 시험일을 한 번에 확인할 수 있도록 중요한 날짜만 압축했습니다.
        </p>
      </div>

      <div className="grid gap-4 px-6 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">
            {calendar.monthLabel}
          </span>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {calendar.periodLabel}
          </span>
          <span className="rounded-full bg-warm/60 px-3 py-1 text-xs font-semibold text-[#7a6200]">
            {calendar.note}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {calendar.items.map((item) => {
            const styles = toneStyles[item.tone];

            return (
              <article
                key={`${item.date}-${item.title}`}
                className={`rounded-[22px] border p-4 shadow-sm transition hover:-translate-y-0.5 ${styles.card}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles.chip}`}>
                    {item.label}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
                </div>
                <p className="mt-4 text-[1.15rem] font-extrabold tracking-tight text-text">{item.date}</p>
                <p className="mt-1 text-sm font-semibold text-text">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted">{item.note}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
