import type { StudentDetailData } from "@/types/student-detail";

const toneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
  soft: "bg-soft text-brand",
};

export function StudentNextActions({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <p className="text-sm font-medium text-muted">다음 액션 / 추천 관리</p>
        <h2 className="mt-2 text-[1.1rem] font-extrabold tracking-tight text-text sm:text-[1.3rem]">
          선생님이 바로 결정할 수 있도록 정리합니다
        </h2>

        <div className="mt-5 grid gap-3">
          {detail.nextActions.map((action) => (
            <div
              key={action.label}
              className="rounded-[24px] border border-border bg-background/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold tracking-tight text-text">{action.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{action.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[action.tone]}`}>
                  {action.tone === "rose"
                    ? "우선"
                    : action.tone === "gold"
                      ? "점검"
                      : action.tone === "peach"
                        ? "조정"
                        : "유지"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea3d4d]"
          >
            바로 실행
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            계획 수정
          </button>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-soft p-5 shadow-none">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand">활동 흐름</p>
        <h3 className="mt-2 text-[1.05rem] font-extrabold tracking-tight text-text sm:text-[1.1rem]">
          최근 관리 기록
        </h3>

        <div className="mt-5 space-y-4">
          {detail.timeline.map((item, index) => (
            <div key={`${item.time}-${item.title}`} className="flex gap-4">
              <div className="flex flex-col items-center pt-1">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
                    item.kind === "success"
                      ? "bg-emerald-100 text-emerald-600"
                      : item.kind === "warning"
                        ? "bg-brand/10 text-brand"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {item.kind === "success" ? "✓" : item.kind === "warning" ? "!" : "•"}
                </span>
                {index < detail.timeline.length - 1 ? <span className="mt-2 h-full w-px flex-1 bg-border" /> : null}
              </div>

              <article className="flex-1 rounded-[22px] border border-border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold tracking-tight text-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand shadow-sm">
                    {item.time}
                  </span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
