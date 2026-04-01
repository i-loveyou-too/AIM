import type { StudentDetailData } from "@/types/student-detail";

export function StudentExamSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="rounded-[28px] border border-[#0a1536]/20 bg-[#0b1535] p-5 text-white shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold tracking-[0.12em] text-white/85">현재 학습 상태</p>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/85">
          {detail.exam.statusLabel}
        </span>
      </div>

      <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-white/70">DAILY CONCENTRATION</p>
        <div className="mt-2 flex items-end gap-1.5">
          {[32, 42, 78, 30, 38, 29, 64].map((height, index) => (
            <div
              key={height + index}
              className={`w-6 rounded-sm ${index === 2 || index === 6 ? "bg-brand" : "bg-white/15"}`}
              style={{ height: `${height / 2}px` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-white/70">PREDICTED CSAT SCORE</p>
        <p className="mt-2 text-[1.75rem] font-black leading-none tracking-tight text-warm">
          {Math.max(0, detail.goalScore - 4)}~{detail.goalScore}
        </p>
        <p className="mt-2 text-xs text-white/70">시험일 {detail.exam.examDate} · {detail.dDayLabel}</p>
        <p className="mt-1 text-xs text-white/70">{detail.exam.planStatus}</p>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-bold text-[#0b1535] shadow-sm transition hover:bg-white/90"
      >
        실시간 학습 모니터링
      </button>
    </section>
  );
}
