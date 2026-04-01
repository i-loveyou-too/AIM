type TodayScheduleItem = {
  time: string;
  duration: string;
  title: string;
  student: string;
  memo: string;
  status: string;
  tone: "rose" | "gold" | "peach";
};

type TodayScheduleProps = {
  items: TodayScheduleItem[];
};

const toneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
};

export function TodaySchedule({ items }: TodayScheduleProps) {
  return (
    <section className="rounded-[32px] bg-soft px-4 py-5 shadow-none sm:px-6 sm:py-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <a
            href="/dashboard/today-lessons"
            className="text-[1.3rem] font-extrabold tracking-tight text-text hover:text-brand transition sm:text-[1.55rem]"
          >
            오늘의 수업 일정
          </a>
        </div>
        <a href="/dashboard/today-lessons" className="text-sm font-extrabold text-brand sm:text-base">
          전체 일정 보기 &rsaquo;
        </a>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <a
            key={`${item.time}-${item.title}`}
            href="/dashboard/today-lessons"
            className="block"
          >
          <article
            className="relative overflow-hidden rounded-[999px] border border-transparent bg-white p-3.5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-glow sm:px-4 sm:py-4"
          >
            <div
              className={`absolute left-0 top-0 h-full w-2 ${
                item.tone === "rose"
                  ? "bg-[#6AA8FF]"
                  : item.tone === "gold"
                    ? "bg-brand"
                    : "bg-[#FF6B73]"
              }`}
            />

            <div className="flex items-center gap-3.5 pl-3.5 sm:pl-5">
              <div className="flex w-[78px] shrink-0 flex-col items-center justify-center text-center">
                <span className="text-[1.2rem] font-extrabold leading-none tracking-tight text-text sm:text-[1.35rem]">
                  {item.time}
                </span>
                <span className="mt-1.5 text-[0.7rem] font-semibold text-[#a1adc4] sm:text-xs">
                  {item.duration}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[1rem] font-extrabold tracking-tight text-text sm:text-[1.08rem]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.88rem] font-medium text-muted sm:text-[0.95rem]">
                      {item.student}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3.5 py-1.5 text-sm font-extrabold text-white shadow-sm sm:px-4 sm:py-2.5 sm:text-sm ${
                      item.tone === "rose"
                        ? "bg-brand"
                        : item.tone === "gold"
                          ? "bg-brand"
                          : "bg-[#FF6A74]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.88rem] leading-5 text-muted sm:text-[0.92rem]">
                  {item.memo}
                </p>
              </div>
            </div>
          </article>
          </a>
        ))}
      </div>
    </section>
  );
}
