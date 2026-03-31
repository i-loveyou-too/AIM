// 이슈함 — 운영 인사이트 섹션
// 반복 미제출 / 질문 빈도 / 시험 임박 / 지연 위험 / 보강 필요 요약

import type { IssueInsightsData } from "@/types/issues";

const urgencyBadge: Record<string, string> = {
  긴급: "bg-brand text-white",
  높음: "bg-accent/15 text-accent",
  중간: "bg-warm/60 text-[#7a6200]",
  낮음: "bg-soft text-muted",
};

const emptyData: IssueInsightsData = {
  repeatNonSubmit: [],
  frequentQuestions: [],
  examImminent: [],
  delayRisk: [],
  commonReinforcement: [],
};

export function IssueInsightSection({ data = emptyData }: { data?: IssueInsightsData }) {
  const d = data;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">운영 인사이트</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          이슈 패턴 분석
        </h2>
        <p className="mt-1 text-sm text-muted">
          반복 미제출, 질문 빈도, 시험 임박, 보강 필요 항목을 종합한 운영 판단 요약입니다.
        </p>
      </div>

      <div className="grid gap-0 divide-y divide-border/50 lg:grid-cols-3 lg:divide-x lg:divide-y-0">

        {/* 반복 미제출 + 자주 묻는 학생 */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted">반복 미제출 학생</p>
            <div className="space-y-2">
              {d.repeatNonSubmit.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded-xl border border-brand/15 bg-brand/5 px-3 py-2.5">
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-brand shadow-sm">
                    {s.name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted">{s.className}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-brand">{s.count}회</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted">질문 빈도 높은 학생</p>
            <div className="space-y-2">
              {d.frequentQuestions.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded-xl border border-accent/15 bg-accent/5 px-3 py-2.5">
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-accent shadow-sm">
                    {s.name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted truncate">{s.topic}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-accent">{s.count}회</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 시험 임박 + 지연 위험 */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted">시험 임박 현황</p>
            <div className="space-y-2">
              {d.examImminent.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border/50 bg-soft/40 px-3 py-2.5">
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-text shadow-sm">
                    {s.name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted">{s.className}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-xs font-bold text-brand">{s.dDay}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${urgencyBadge[s.urgency]}`}>{s.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted">진도 지연 위험</p>
            <div className="space-y-2">
              {d.delayRisk.map((s, i) => (
                <div key={i} className="rounded-xl border border-warm/40 bg-warm/20 px-3 py-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#7a6200]">{s.name}</span>
                    {s.weeks > 0 && (
                      <span className="rounded-full bg-warm/60 px-2 py-0.5 text-[9px] font-bold text-[#7a6200]">{s.weeks}주 지연</span>
                    )}
                  </div>
                  <p className="text-xs text-text">{s.delayUnit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 공통 보강 필요 */}
        <div className="px-6 py-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted">공통 보강 필요 항목</p>
          <div className="space-y-2">
            {d.commonReinforcement.map((r, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-soft/40 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-text">{r.className}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${urgencyBadge[r.urgency]}`}>{r.urgency}</span>
                </div>
                <p className="text-xs text-muted">{r.concept}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-border/50 bg-soft/30 px-4 py-3">
            <p className="text-[10px] font-bold text-muted mb-1">운영 팁</p>
            <p className="text-xs leading-5 text-text">
              반복 미제출 학생은 이번 주 수업 전 개별 면담을 진행하고, 공통 오답 개념은 다음 수업 도입부에 5분 복습을 배치하는 것을 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
