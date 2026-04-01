import type { StudentDetailCard } from "@/types/student-detail";

function pickCard(cards: StudentDetailCard[], label: string, fallback: StudentDetailCard) {
  return cards.find((card) => card.label === label) ?? fallback;
}

export function StudentStatusCards({ cards }: { cards: StudentDetailCard[] }) {
  const achievement = pickCard(cards, "최근 성취도", {
    label: "최근 성취도",
    value: "<디비 데이터 필요>",
    note: "최근 테스트 대비 변화 데이터를 확인해 주세요.",
    tone: "soft",
    badge: "확인 필요",
  });
  const homework = pickCard(cards, "미완료 과제 수", {
    label: "과제 이행 상태",
    value: "<디비 데이터 필요>",
    note: "최근 과제 기준 이행률 데이터를 확인해 주세요.",
    tone: "gold",
    badge: "확인 필요",
  });
  const weakPoints = pickCard(cards, "취약 단원 수", {
    label: "집중 관리 단원",
    value: "<디비 데이터 필요>",
    note: "집중 보완 단원 데이터를 확인해 주세요.",
    tone: "peach",
    badge: "확인 필요",
  });

  const highlightCards = [
    {
      key: "achievement",
      title: "Achievement Score",
      value: achievement.value,
      note: achievement.note,
      badge: "상승 흐름",
      accent: "border-brand/70",
    },
    {
      key: "homework",
      title: "Homework Status",
      value: homework.value,
      note: homework.note,
      badge: "운영 점검",
      accent: "border-border",
    },
    {
      key: "weak",
      title: "Weak Points",
      value: weakPoints.value,
      note: weakPoints.note,
      badge: "집중 관리",
      accent: "border-warm/80",
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {highlightCards.map((card) => (
        <article
          key={card.key}
          className={`rounded-[26px] border bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-glow ${card.accent}`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{card.title}</p>
            <span className="rounded-full bg-soft px-2.5 py-1 text-[10px] font-semibold text-brand">
              {card.badge}
            </span>
          </div>
          <p className="mt-3 text-[1.8rem] font-black leading-none tracking-tight text-text">
            {card.value}
          </p>
          <p className="mt-2 text-xs font-medium text-muted">{card.note}</p>
        </article>
      ))}
    </section>
  );
}
