// 과제 관리 — 보조 인사이트 섹션
// 반복 미제출 학생 / 질문 많은 학생 / 보강 우선순위 / 운영 메모

import { assignmentInsights } from "@/lib/mock-data/assignment-mock-data";

const urgencyBadge: Record<string, string> = {
  높음: "bg-brand/10 text-brand",
  중간: "bg-warm/50 text-[#7a6200]",
  낮음: "bg-emerald-50 text-emerald-700",
};

export function AssignmentInsightSection() {
  const data = assignmentInsights;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">운영 인사이트</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          보강·관리 우선순위 요약
        </h2>
        <p className="mt-1 text-sm text-muted">
          반복 미제출, 질문 빈도, 보강 필요 반을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-0 divide-y divide-border/50 px-0 lg:grid-cols-3 lg:divide-x lg:divide-y-0">

        {/* 반복 미제출 학생 */}
        <div className="px-6 py-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
            반복 미제출 학생
          </p>
          <div className="space-y-2.5">
            {data.repeatNonSubmitStudents.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-xl border border-brand/15 bg-brand/5 px-3 py-2.5">
                <span className="text-sm font-bold text-text">{s.name}</span>
                <span className="text-[11px] text-muted">{s.className}</span>
                <span className="ml-auto rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                  {s.count}회
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 질문 많은 학생 */}
        <div className="px-6 py-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            질문 빈도 높은 학생
          </p>
          <div className="space-y-2.5">
            {data.frequentQuestionStudents.map((s) => (
              <div key={s.name} className="flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/5 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text">{s.name}
                    <span className="ml-1.5 text-[11px] font-normal text-muted">{s.className}</span>
                  </p>
                  <p className="text-[11px] text-muted truncate">{s.topic}</p>
                </div>
                <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                  {s.questionCount}건
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 보강 우선순위 + 메모 */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              보강 우선순위
            </p>
            <div className="space-y-2">
              {data.reinforcementPriority.map((r) => (
                <div key={r.className} className="flex items-start gap-3 rounded-xl bg-soft/60 px-3 py-2.5">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${urgencyBadge[r.urgency]}`}>
                    {r.urgency}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text">{r.className}</p>
                    <p className="text-[11px] text-muted">{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 운영 메모 */}
          <div className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
              최근 운영 메모
            </p>
            <p className="text-xs leading-5 text-text">{data.recentOperationMemo}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
