import type { StudentDetailData } from "@/types/student-detail";

export function StudentProgressSection({ detail }: { detail: StudentDetailData }) {
  const roadmapSteps = [
    ...detail.progress.completedUnits.slice(0, 2),
    detail.progress.currentUnit,
    "다음 단원 준비",
    "Final Review",
  ];
  const currentStepIndex = Math.min(2, roadmapSteps.length - 1);

  return (
    <section className="rounded-[30px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <article className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted">상세 학습 로드맵</p>
            <h2 className="mt-1.5 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.4rem]">
              다음 수업에서 확인할 단원과 진행 흐름
            </h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            On Track
          </span>
        </div>

        <div className="rounded-[24px] border border-border bg-background/60 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">ROADMAP STAGE</p>
            <p className="text-xs font-semibold text-brand">{detail.progress.progressRate}% 진행</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {roadmapSteps.map((step, index) => {
              const isCurrent = index === currentStepIndex;
              const isDone = index < currentStepIndex;
              return (
                <div key={`${step}-${index}`} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        isCurrent
                          ? "bg-brand text-white shadow-soft"
                          : isDone
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-soft text-muted"
                      }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </span>
                    <div className={`h-[2px] flex-1 rounded-full ${index === roadmapSteps.length - 1 ? "bg-transparent" : "bg-border"}`} />
                  </div>
                  <p className={`text-xs font-semibold ${isCurrent ? "text-brand" : "text-muted"}`}>{step}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-warm/70 bg-[#fffaf0] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-warm/90 text-sm font-bold text-text">
              ✦
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">AI 인사이트 · 수업 준비</p>
              <p className="mt-2 text-sm leading-7 text-text/90">
                {detail.aiInsight.progressReport.smartInsight}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                  현재 단원: {detail.progress.currentUnit}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                  다음 수업 목표: {detail.aiInsight.progressReport.nextGoal}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">
                  완료 예정: {detail.aiInsight.progressReport.completeDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
