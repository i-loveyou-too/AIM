import type { StudentDetailCard } from "@/types/student-detail";

const toneStyles = {
  rose: {
    box: "bg-brand/10 text-brand",
    badge: "bg-brand/10 text-brand",
  },
  gold: {
    box: "bg-warm/70 text-text",
    badge: "bg-warm/20 text-text",
  },
  peach: {
    box: "bg-accent/10 text-accent",
    badge: "bg-accent/10 text-accent",
  },
  soft: {
    box: "bg-soft text-brand",
    badge: "bg-soft text-brand",
  },
};

// 카드 라벨을 의미가 보이는 이모지로 바꾸는 매핑
const cardIcons: Record<string, string> = {
  "최근 성취도": "📈",
  "미완료 과제 수": "📝",
  "취약 단원 수": "🎯",
  "계획 조정 필요": "🔁",
  "시험 임박도": "⏰",
  "최근 피드백 여부": "💬",
};

export function StudentStatusCards({ cards }: { cards: StudentDetailCard[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-glow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl leading-none ${toneStyles[card.tone].box}`}>
              <span aria-hidden="true">{cardIcons[card.label] ?? "•"}</span>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] ${toneStyles[card.tone].badge}`}>
              {card.badge}
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-muted">{card.label}</p>
          <p className="mt-2 text-[1.4rem] font-extrabold tracking-tight text-text sm:text-[1.65rem]">
            {card.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{card.note}</p>
        </article>
      ))}
    </section>
  );
}
