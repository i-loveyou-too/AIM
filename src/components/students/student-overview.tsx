export type OverviewKey = "all" | "attention" | "urgent" | "tasks";

type OverviewCard = {
  key: OverviewKey;
  label: string;
  value: string;
  note: string;
  tone: "rose" | "gold" | "peach" | "soft";
  emoji: string;
  badge?: string;
};

type StudentOverviewProps = {
  cards: OverviewCard[];
  activeKey: OverviewKey;
  onSelect: (key: OverviewKey) => void;
};

const toneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
  soft: "bg-soft text-brand",
};

function getCardState(active: boolean, tone: OverviewCard["tone"]) {
  if (!active) {
    return "border-border/80 bg-white shadow-soft hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-glow";
  }

  const selectedStyles = {
    rose: "border-brand/40 bg-soft shadow-glow",
    gold: "border-warm/40 bg-warm/15 shadow-glow",
    peach: "border-accent/40 bg-accent/5 shadow-glow",
    soft: "border-brand/30 bg-soft shadow-glow",
  };

  return selectedStyles[tone];
}

export function StudentOverview({ cards, activeKey, onSelect }: StudentOverviewProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.label}
          type="button"
          onClick={() => onSelect(card.key)}
          aria-pressed={activeKey === card.key}
          className={`rounded-[28px] border p-5 text-left shadow-soft transition duration-200 ${getCardState(
            activeKey === card.key,
            card.tone,
          )}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${toneStyles[card.tone]}`}>
              <span aria-hidden="true">{card.emoji}</span>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-brand shadow-sm">
              {activeKey === card.key ? "선택됨" : card.badge ?? "요약"}
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-muted">{card.label}</p>
          <p className="mt-2 text-[1.3rem] font-extrabold tracking-tight text-text sm:text-[1.55rem]">
            {card.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{card.note}</p>
        </button>
      ))}
    </section>
  );
}
