// 오늘 수업 운영 — 상단 요약 카드 5개
// 수업 수, 집중 관리 학생, 숙제 이슈, 핵심 설명 포인트, 시험 임박 학생

type TodayLessonsSummary = {
  totalLessons: number;
  focusStudents: number;
  homeworkIssues: number;
  teachingPoints: number;
  examImminentStudents: number;
};

type SummaryItem = {
  label: string;
  value: string;
  note: string;
  icon: string;
  // 카드 색조: "brand" | "warm" | "accent" | "soft" | "alert"
  tone: "brand" | "warm" | "accent" | "soft" | "alert";
};

const toneMap: Record<SummaryItem["tone"], { icon: string; badge: string; border: string }> = {
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
  alert: {
    icon: "bg-red-50 text-brand",
    badge: "bg-brand text-white",
    border: "hover:border-brand/40 hover:shadow-glow",
  },
};

type Props = {
  summary: TodayLessonsSummary;
};

export function TodayLessonsSummaryCards({ summary }: Props) {
  const { totalLessons, focusStudents, homeworkIssues, teachingPoints, examImminentStudents } =
    summary;

  const items: SummaryItem[] = [
    {
      label: "오늘 수업",
      value: `${totalLessons}건`,
      note: "오늘 진행 예정인 전체 수업 수",
      icon: "📚",
      tone: "brand",
    },
    {
      label: "집중 관리 학생",
      value: `${focusStudents}명`,
      note: "오늘 특별 관리가 필요한 학생",
      icon: "🎯",
      tone: "accent",
    },
    {
      label: "반영할 숙제 이슈",
      value: `${homeworkIssues}건`,
      note: "오늘 수업에 반드시 연결할 숙제 결과",
      icon: "📝",
      tone: "warm",
    },
    {
      label: "오늘 핵심 설명 포인트",
      value: `${teachingPoints}개`,
      note: "오늘 수업에서 꼭 짚어야 할 설명 항목",
      icon: "💡",
      tone: "soft",
    },
    {
      label: "시험 임박 학생",
      value: `${examImminentStudents}명`,
      note: "D-30 이내 시험이 잡힌 학생",
      icon: "⚠️",
      tone: "alert",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const styles = toneMap[item.tone];
        return (
          <div
            key={item.label}
            className={`rounded-[24px] border border-border/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 ${styles.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${styles.icon}`}>
                <span aria-hidden="true">{item.icon}</span>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles.badge}`}>
                오늘
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-muted">{item.label}</p>
            <p className="mt-1.5 text-[1.6rem] font-extrabold tracking-tight text-text">
              {item.value}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-muted">{item.note}</p>
          </div>
        );
      })}
    </section>
  );
}
