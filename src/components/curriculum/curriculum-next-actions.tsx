import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type CurriculumNextActionsProps = {
  nextActions: CurriculumPageData["nextActions"];
};

const toneStyles: Record<"brand" | "warm" | "accent" | "soft", string> = {
  brand: "bg-brand/10 text-brand",
  warm: "bg-warm/60 text-[#7a6200]",
  accent: "bg-accent/10 text-accent",
  soft: "bg-soft text-muted",
};

export function CurriculumNextActions({ nextActions }: CurriculumNextActionsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
      <article className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              다음 수업 액션
            </p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
              다음 수업에서 바로 해야 할 일
            </h2>
          </div>
          <span className="rounded-full bg-warm/60 px-3 py-1 text-xs font-semibold text-[#7a6200]">
            우선 확인
          </span>
        </div>

        <div className="mt-5 rounded-[24px] border border-border/70 bg-soft p-4">
          <p className="text-[11px] font-semibold text-muted">다음 수업 예정 단원</p>
          <p className="mt-1 text-[1.15rem] font-extrabold tracking-tight text-text">
            {nextActions.nextUnit}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">{nextActions.objective}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-border bg-soft/60 p-4">
            <p className="text-[11px] font-semibold text-muted">핵심 개념</p>
            <div className="mt-3 space-y-2">
              {nextActions.keyConcepts.map((item) => (
                <div key={item} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-text shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-border bg-soft/60 p-4">
            <p className="text-[11px] font-semibold text-muted">과제 반영 포인트</p>
            <div className="mt-3 space-y-2">
              {nextActions.homeworkReflection.map((item) => (
                <div key={item} className="rounded-[18px] bg-white px-3 py-2 text-sm leading-6 text-text shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {nextActions.buttons.map((button, index) => (
            <button
              key={button}
              type="button"
              className={`rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${
                index === 0
                  ? "bg-brand text-white hover:bg-[#ea3d4d]"
                  : "border border-border bg-white text-text hover:border-brand/30 hover:text-brand"
              }`}
            >
              {button}
            </button>
          ))}
        </div>
      </article>

      <article className="rounded-[28px] border border-border/80 bg-soft p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          수업 전 점검
        </p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          놓치면 안 되는 반영 포인트
        </h3>

        <div className="mt-5 space-y-3">
          <div className="rounded-[22px] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-muted">반복 실수</p>
            <div className="mt-3 space-y-2">
              {nextActions.commonMistakes.map((item) => (
                <div key={item} className="rounded-full border border-border bg-soft px-3 py-2 text-sm font-semibold text-text">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-muted">보강 필요 대상</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {nextActions.reinforcementTargets.map((item, index) => (
                <span
                  key={item}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${toneStyles[
                    index === 0 ? "brand" : index === 1 ? "warm" : "accent"
                  ]}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-muted">수업 전 확인</p>
            <div className="mt-3 space-y-2">
              {nextActions.preClassChecks.map((item) => (
                <div key={item} className="rounded-[18px] bg-soft px-3 py-2 text-sm leading-6 text-text">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
