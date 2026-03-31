type CurriculumPlanningNotesSectionProps = {
  notes: {
    memoTitle: string;
    memoSummary: string;
    items: Array<{
      title: string;
      detail: string;
      reason: string;
    }>;
  };
};

export function CurriculumPlanningNotesSection({ notes }: CurriculumPlanningNotesSectionProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          계획 조정 / 운영 메모
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          왜 계획이 바뀌었는지 함께 기록합니다
        </h2>
        <p className="mt-1 text-sm text-muted">
          실제 운영에서 계획을 바꾸게 된 이유, 보강 배정 이유, 다음 조정 포인트를 함께 남깁니다.
        </p>
      </div>

      <div className="grid gap-4 px-6 py-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[24px] border border-brand/15 bg-brand/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {notes.memoTitle}
          </p>
          <p className="mt-3 text-sm leading-7 text-text">{notes.memoSummary}</p>
        </div>

        <div className="space-y-3">
          {notes.items.map((item, index) => (
            <article key={item.title} className="rounded-[24px] border border-border/70 bg-soft p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-extrabold tracking-tight text-text">
                  {String(index + 1).padStart(2, "0")}. {item.title}
                </p>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand shadow-sm">
                  기록
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-text">{item.detail}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{item.reason}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
