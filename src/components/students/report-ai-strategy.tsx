import type { StudentDetailData } from "@/types/student-detail";

export function ReportAiStrategy({ detail }: { detail: StudentDetailData }) {
  const { student, nextActions, weaknesses, dDayLabel, examDate } = detail;

  const strategies = nextActions.slice(0, 3).map((action, i) => ({
    number: i + 1,
    text: action.label,
    note: action.description,
  }));

  // Fallback if nextActions is empty
  const displayStrategies =
    strategies.length > 0
      ? strategies
      : [
          { number: 1, text: `${weaknesses.topics[0] ?? "취약 단원"} 집중 보강`, note: "AI 맞춤형 문항 150제 풀이 권장" },
          { number: 2, text: "실전 모의고사 주 2회", note: "실전 감각 및 시간 안배 강화" },
          { number: 3, text: "약점 보완 오답노트", note: "최근 3개년 기출 중 유사 유형 정리" },
        ];

  const milestones = [
    { week: "Week 1-2", task: `기초 개념 재정립 (${weaknesses.topics[0] ?? "핵심 단원"})`, status: "current" },
    { week: "Week 3", task: "심화 기출 및 킬러 문항 정복", status: "upcoming" },
    { week: "Week 4", task: "실전 감각 및 시간 안배 훈련", status: "upcoming" },
    { week: `${examDate} 시험`, task: "최종 오답 완벽 분석 및 마무리", status: "exam" },
  ];

  return (
    <section className="overflow-hidden rounded-[32px] bg-[#0E0E12]">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        {/* Left: Strategy */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-warm/40 bg-warm/10 px-3 py-1 text-[11px] font-bold tracking-widest text-warm">
              AI CURATED
            </span>
            <span className="text-xs font-semibold text-white/50">Next 4 Weeks Strategy</span>
          </div>

          <h2 className="mt-5 text-[1.6rem] font-extrabold leading-tight tracking-tight text-white sm:text-[1.9rem]">
            수능 {dDayLabel} 최적화<br />
            <span className="text-warm">학습 로드맵</span>
          </h2>
          <p className="mt-2 text-sm text-white/50">
            {student.name} 학생 · {student.grade} · {student.subject} 중심 분석 기반
          </p>

          <div className="mt-7 space-y-4">
            {displayStrategies.map((s) => (
              <div key={s.number} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-extrabold text-brand">
                  {String(s.number).padStart(2, "0")}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-bold leading-6 text-white">{s.text}</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/50">{s.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-[#d63a48]"
            >
              <span aria-hidden="true">✦</span>
              커스텀 학습지 생성하기
            </button>
          </div>
        </div>

        {/* Right: Milestone Timeline */}
        <div className="border-t border-white/10 bg-white/[0.03] p-8 xl:border-l xl:border-t-0 sm:p-10">
          <p className="text-xs font-bold tracking-[0.18em] text-white/50">MILESTONE TIMELINE</p>

          <div className="mt-6 space-y-0">
            {milestones.map((m, i) => {
              const isCurrent = m.status === "current";
              const isLast = i === milestones.length - 1;
              return (
                <div key={m.week} className="relative flex gap-4">
                  {/* Vertical connector */}
                  {!isLast && (
                    <div className="absolute left-[11px] top-6 h-full w-px bg-white/10" />
                  )}
                  {/* Dot */}
                  <div className={`relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isCurrent
                      ? "border-warm bg-warm"
                      : "border-white/20 bg-transparent"
                  }`}>
                    {isCurrent && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                    <p className={`text-[11px] font-bold tracking-[0.12em] ${isCurrent ? "text-warm" : "text-white/35"}`}>
                      {m.week}
                    </p>
                    <p className={`mt-1 text-sm font-semibold leading-5 ${isCurrent ? "text-white" : "text-white/50"}`}>
                      {m.task}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
