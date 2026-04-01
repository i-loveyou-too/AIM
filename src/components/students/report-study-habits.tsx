import type { StudentDetailData } from "@/types/student-detail";

const TIME_SLOTS = [
  { label: "Morning", sublabel: "~12시", active: false },
  { label: "Afternoon", sublabel: "12–18시", active: false },
  { label: "Evening", sublabel: "18–22시", active: true },
];

const DAYS = [
  { label: "M", height: 40, active: false },
  { label: "T", height: 78, active: true },
  { label: "W", height: 88, active: true },
  { label: "T", height: 52, active: false },
  { label: "F", height: 82, active: true },
  { label: "S", height: 60, active: true },
  { label: "S", height: 30, active: false },
];

export function ReportStudyHabits({ detail }: { detail: StudentDetailData }) {
  const recentTag = detail.learningGoal.focusLabel;

  return (
    <article className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <h2 className="text-[1.05rem] font-extrabold tracking-tight text-text">Study Habits</h2>

      {/* Time Distribution */}
      <div className="mt-4">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted">TIME DISTRIBUTION</p>
        <div className="flex gap-1.5">
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot.label}
              className={`flex flex-1 flex-col items-center rounded-full py-2.5 text-center transition ${
                slot.active
                  ? "bg-brand text-white"
                  : "bg-soft text-muted"
              }`}
            >
              <span className="text-xs font-semibold">{slot.label}</span>
              <span className={`mt-0.5 text-[10px] ${slot.active ? "text-white/75" : "text-muted/70"}`}>
                {slot.sublabel}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-xs leading-5 text-muted">
          방과 후(16:00–20:00) 학습 집중도가 가장 높습니다.
        </p>
      </div>

      {/* Weekly Consistency */}
      <div className="mt-5">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-muted">WEEKLY CONSISTENCY</p>
        <div className="flex h-16 items-end gap-1.5">
          {DAYS.map((day, i) => (
            <div key={`${day.label}-${i}`} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-[5px] transition-all ${day.active ? "bg-brand" : "bg-[#F0D0D2]"}`}
                style={{ height: `${day.height}%` }}
              />
              <span className="text-[10px] font-medium text-muted">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider + AI insight */}
      <div className="mt-4 border-t border-border/60 pt-4">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warm text-[10px] font-bold text-text">AI</span>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text">학습 패턴 분석</p>
            <p className="text-xs leading-5 text-muted">
              화·수·금 집중 패턴 확인. 주말 공백이 크며 일관성 보완이 권장됩니다.
              현재 집중 단원: <span className="font-semibold text-text">{recentTag}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
