import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type CurriculumRoadmapBoardProps = {
  roadmap: CurriculumPageData["roadmap"];
};

const toneStyles: Record<CurriculumPageData["roadmap"][number]["tone"], { chip: string; bar: string }> = {
  brand: {
    chip: "bg-brand/10 text-brand",
    bar: "bg-brand",
  },
  warm: {
    chip: "bg-warm/60 text-[#7a6200]",
    bar: "bg-warm",
  },
  accent: {
    chip: "bg-accent/10 text-accent",
    bar: "bg-accent",
  },
  soft: {
    chip: "bg-soft text-muted",
    bar: "bg-border/70",
  },
  success: {
    chip: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
  },
  alert: {
    chip: "bg-brand/10 text-brand",
    bar: "bg-brand",
  },
};

export function CurriculumRoadmapBoard({ roadmap }: CurriculumRoadmapBoardProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          커리큘럼 메인 보드
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          대단원 · 중단원 · 세부 항목을 한 번에 관리합니다
        </h2>
        <p className="mt-1 text-sm text-muted">
          단원별 시작일, 종료일, 실제 진행, 숙제 반영, 공통 오답, 보강 필요 여부를 함께 봅니다.
        </p>
      </div>

      <div className="grid gap-4 px-6 py-5 xl:grid-cols-3">
        {roadmap.map((item) => {
          const styles = toneStyles[item.tone];

          return (
            <article key={item.title} className="rounded-[26px] border border-border/70 bg-soft/40 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-[1.2rem] font-extrabold tracking-tight text-text">
                    {item.title}
                  </h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${styles.chip}`}>
                  {item.statusLabel}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-muted">실제 진행</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-text">
                    {item.actualProgress}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-muted">계획 진행</p>
                  <p className="mt-1 text-sm font-bold text-muted">{item.plannedProgress}%</p>
                </div>
              </div>

              <div className="mt-3 h-2.5 rounded-full bg-white">
                <div className={`h-2.5 rounded-full ${styles.bar}`} style={{ width: `${item.actualProgress}%` }} />
              </div>

              <div className="mt-4 space-y-2 rounded-[20px] border border-border bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold text-muted">운영 메모</p>
                <p className="text-sm leading-6 text-text">{item.lessonNote}</p>
                <p className="text-xs leading-5 text-muted">{item.assignmentNote}</p>
                <p className="text-xs leading-5 text-muted">{item.commonMistakeNote}</p>
                <p className="text-xs leading-5 text-muted">{item.reinforcementNote}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold text-text shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-[20px] border border-border/70 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold text-muted">세부 학습항목</p>
                <div className="mt-3 space-y-2">
                  {item.subtopics.map((subtopic) => (
                    <div key={subtopic.title} className="rounded-[16px] bg-soft px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text">{subtopic.title}</p>
                          {subtopic.note && <p className="text-[11px] text-muted">{subtopic.note}</p>}
                        </div>
                        <span className="text-xs font-bold text-brand">{subtopic.progress}%</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white">
                        <div className={`h-1.5 rounded-full ${styles.bar}`} style={{ width: `${subtopic.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-brand">
                {item.canFinishBeforeExam}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
