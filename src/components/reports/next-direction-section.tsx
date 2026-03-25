// 다음 관리 방향 섹션
// 다음 수업 방향 + 보강 항목 + 숙제 방향 + 설명 집중 포인트

import { nextDirection } from "@/lib/mock-data/student-report-mock-data";

export function NextDirectionSection() {
  const data = nextDirection;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">다음 관리 방향</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          다음 수업 준비 & 집중 방향
        </h2>
        <p className="mt-1 text-sm text-muted">
          다음 수업에서 실행할 구체적인 관리 방향과 준비 사항입니다.
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* 우선순위 배너 */}
        <div className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
          <p className="text-[11px] font-semibold text-brand mb-1">이번 기간 우선순위</p>
          <p className="text-sm font-bold text-text">{data.priority}</p>
        </div>

        {/* 다음 수업 방향 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand/10 text-sm">📖</span>
            <p className="text-xs font-bold text-text">다음 수업 방향</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3">
            <p className="text-sm text-text leading-relaxed">{data.nextLesson}</p>
          </div>
        </div>

        {/* 보강 항목 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/10 text-sm">🔧</span>
            <p className="text-xs font-bold text-text">보강 항목</p>
          </div>
          <ul className="space-y-2">
            {data.reinforcement.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-soft/40 px-4 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
                  {i + 1}
                </span>
                <span className="text-sm text-text leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 숙제 방향 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-soft text-sm">📝</span>
            <p className="text-xs font-bold text-text">숙제 방향</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3">
            <p className="text-sm text-text leading-relaxed">{data.homeworkDirection}</p>
          </div>
        </div>

        {/* 설명 집중 포인트 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-sm">💡</span>
            <p className="text-xs font-bold text-text">설명 집중 포인트</p>
          </div>
          <ul className="space-y-2">
            {data.explanationFocus.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm text-text leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
