// 리포트 허브 상단 요약 카드
// 6개 핵심 지표를 프리미엄 카드 형태로 표시

type ReportHubSummaryCard = {
  label: string;
  value: string;
  note: string;
  emoji: string;
  tone: "brand" | "warm" | "accent" | "soft" | "success" | "alert";
  badge: string;
};

const toneStyles: Record<ReportHubSummaryCard["tone"], { icon: string; badge: string; border: string }> = {
  brand: {
    icon: "bg-brand/10 text-brand",
    badge: "bg-brand/10 text-brand",
    border: "hover:border-brand/30 hover:shadow-glow",
  },
  warm: {
    icon: "bg-warm/60 text-[#8a7400]",
    badge: "bg-warm/60 text-[#8a7400]",
    border: "hover:border-warm/60",
  },
  accent: {
    icon: "bg-accent/10 text-accent",
    badge: "bg-accent/10 text-accent",
    border: "hover:border-accent/30",
  },
  soft: {
    icon: "bg-soft text-muted",
    badge: "bg-soft text-muted",
    border: "hover:border-border",
  },
  success: {
    icon: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600",
    border: "hover:border-emerald-200",
  },
  alert: {
    icon: "bg-red-50 text-brand",
    badge: "bg-brand text-white",
    border: "hover:border-brand/40 hover:shadow-glow",
  },
};

export function ReportHubSummaryCards({ cards }: { cards: ReportHubSummaryCard[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => {
        const styles = toneStyles[card.tone];
        return (
          <div
            key={card.label}
            className={`rounded-[24px] border border-border/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 ${styles.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${styles.icon}`}>
                <span aria-hidden="true">{card.emoji}</span>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles.badge}`}>
                {card.badge}
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-muted">{card.label}</p>
            <p className="mt-1.5 text-[1.6rem] font-extrabold tracking-tight text-text">
              {card.value}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-muted">{card.note}</p>
          </div>
        );
      })}
    </section>
  );
}
