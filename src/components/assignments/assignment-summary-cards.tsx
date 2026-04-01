"use client";

// 과제 관리 — 상단 KPI 요약 카드
// 카드 클릭 시 아래 보드 필터/탭 전환

type CardId = "active" | "dueToday" | "unsubmitted" | "questions" | "avgRate" | "reinforcement";

type Props = {
  summary: {
    activeAssignments: number;
    dueTodayCount: number;
    unsubmittedStudents: number;
    studentsWithQuestions: number;
    avgSubmissionRate: number;
    reinforcementNeeded: number;
  };
  activeCardId?: CardId | null;
  onCardClick?: (id: CardId) => void;
};

const toneStyle: Record<string, { icon: string; value: string; hover: string; active: string }> = {
  brand:  { icon: "bg-brand/10 text-brand",    value: "text-brand",     hover: "hover:border-brand/30",  active: "border-brand bg-brand/5"  },
  alert:  { icon: "bg-brand/10 text-brand",    value: "text-brand",     hover: "hover:border-brand/40",  active: "border-brand bg-brand/5"  },
  warn:   { icon: "bg-warm/60 text-[#7a6200]", value: "text-[#7a6200]", hover: "hover:border-warm/60",   active: "border-warm bg-warm/10"   },
  accent: { icon: "bg-accent/10 text-accent",  value: "text-accent",    hover: "hover:border-accent/30", active: "border-accent bg-accent/5" },
  soft:   { icon: "bg-soft text-muted",        value: "text-text",      hover: "hover:border-border",    active: "border-border bg-soft"    },
};

export function AssignmentSummaryCards({ summary, activeCardId, onCardClick }: Props) {
  const cards: { id: CardId; label: string; value: string; icon: string; note: string; tone: "brand" | "alert" | "warn" | "accent" | "soft"; clickable: boolean }[] = [
    {
      id: "active",
      label: "진행 중 과제",
      value: `${summary.activeAssignments}개`,
      icon: "📋",
      note: "전체 반 기준",
      tone: "brand",
      clickable: true,
    },
    {
      id: "dueToday",
      label: "오늘 마감",
      value: `${summary.dueTodayCount}개`,
      icon: "⏰",
      note: "오늘 자정 마감",
      tone: "alert",
      clickable: true,
    },
    {
      id: "unsubmitted",
      label: "미제출 학생",
      value: `${summary.unsubmittedStudents}명`,
      icon: "⚠️",
      note: "즉시 확인 필요",
      tone: "warn",
      clickable: true,
    },
    {
      id: "questions",
      label: "질문 남긴 학생",
      value: `${summary.studentsWithQuestions}명`,
      icon: "💬",
      note: "다음 수업 반영 필요",
      tone: "accent",
      clickable: true,
    },
    {
      id: "avgRate",
      label: "평균 제출률",
      value: `${summary.avgSubmissionRate}%`,
      icon: "📊",
      note: "전체 반 평균",
      tone: "soft",
      clickable: false,
    },
    {
      id: "reinforcement",
      label: "보강 필요 과제",
      value: `${summary.reinforcementNeeded}개`,
      icon: "🔧",
      note: "오답률 기준",
      tone: "soft",
      clickable: true,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const t = toneStyle[card.tone];
        const isActive = activeCardId === card.id;

        return (
          <div
            key={card.id}
            onClick={() => card.clickable && onCardClick?.(card.id)}
            className={`rounded-[24px] border bg-white p-5 shadow-soft transition duration-200 ${
              card.clickable ? "cursor-pointer hover:-translate-y-0.5" : ""
            } ${isActive ? t.active : `border-border/80 ${t.hover}`}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${t.icon}`}>
                {card.icon}
              </div>
              {isActive && card.clickable && (
                <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white">필터 중</span>
              )}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted">{card.label}</p>
            <p className={`mt-1 text-[1.4rem] font-extrabold tracking-tight ${t.value}`}>
              {card.value}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-muted">{card.note}</p>
            {card.clickable && !isActive && (
              <p className="mt-1 text-[10px] text-muted/60">클릭하여 필터</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
