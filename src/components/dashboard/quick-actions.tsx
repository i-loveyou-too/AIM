type QuickActionItem = {
  label: string;
  description: string;
  tone: "rose" | "gold" | "peach" | "soft";
  icon: string;
};

type QuickActionsProps = {
  items: QuickActionItem[];
};

const toneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
  soft: "bg-soft text-brand",
};

export function QuickActions({ items }: QuickActionsProps) {
  return (
    <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">빠른 실행</p>
          <h2 className="mt-2 text-[1rem] font-extrabold tracking-tight text-text sm:text-[1.1rem]">
            자주 쓰는 작업을 바로 시작합니다
          </h2>
        </div>
        <p className="text-sm text-muted">필요한 작업을 빠르게 시작</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className="group rounded-[28px] border border-border bg-[#f8f8fa] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white hover:shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold ${toneStyles[item.tone]}`}
              >
                {item.icon}
              </span>
              <span className="text-lg text-muted transition group-hover:translate-x-0.5 group-hover:text-brand">
                →
              </span>
            </div>

            <p className="mt-4 text-base font-extrabold tracking-tight text-text">
              {item.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
