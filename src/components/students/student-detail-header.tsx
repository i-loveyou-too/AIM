import Link from "next/link";
import type { StudentDetailData } from "@/types/student-detail";

const toneStyles = {
  rose: "bg-brand text-white",
  gold: "bg-warm/80 text-text",
  peach: "bg-accent/15 text-accent",
  soft: "bg-soft text-brand",
};

export function StudentDetailHeader({ detail }: { detail: StudentDetailData }) {
  const { student } = detail;
  const progress = Math.max(0, Math.min(100, student.score));
  const initials = student.name.slice(0, 1);

  return (
    <section className="rounded-[30px] border border-border/80 bg-white px-5 py-5 shadow-soft sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch xl:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <Link
            href="/dashboard/students"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            ← 학생 목록
          </Link>

          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#ffd8de] via-[#f8aeb8] to-[#ec5f74] shadow-soft ring-1 ring-brand/15">
              <span className="text-[1.45rem] font-black text-white">{initials}</span>
              <span className="absolute -bottom-1.5 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold text-muted">
                STUDENT
              </span>
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[1.65rem] font-black tracking-tight text-text sm:text-[1.85rem]">{student.name}</h1>
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-muted">ID: {student.id}</span>
              </div>
              <p className="text-sm font-semibold text-muted sm:text-base">
                {student.grade} · {detail.learningGoal.admissionTrack} · {student.className}
              </p>
              <p className="text-sm font-semibold text-brand sm:text-base">
                {detail.learningGoal.targetUniversity} 지망
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">PREMIUM</span>
                <span className="rounded-full bg-warm/80 px-3 py-1 text-xs font-semibold text-text">{detail.dDayLabel}</span>
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-text">{detail.currentLevel}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[detail.managementTone]}`}>
                  {detail.managementStatus}
                </span>
              </div>

              <div className="rounded-[18px] border border-border bg-background/60 p-3.5 sm:p-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#ea3d4d]"
                  >
                    {detail.studyti.ctaLabel}
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {detail.studyti.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-white px-2.5 py-1 text-xs font-semibold text-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2.5 text-sm leading-6 text-muted">
                  성향 요약: {detail.studyti.summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full rounded-[24px] border border-border bg-background/70 px-5 py-4 xl:max-w-[360px]">
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm font-semibold text-muted">전체 학습 진도율</p>
            <p className="text-[1.75rem] font-black leading-none tracking-tight text-brand">{progress}%</p>
          </div>
          <div className="mt-3 h-3 rounded-full bg-soft">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-brand via-[#ee4b5f] to-[#d92f4a] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted">
            {detail.managementNote}
          </p>
        </aside>
      </div>
    </section>
  );
}
