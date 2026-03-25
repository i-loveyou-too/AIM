// 이슈함 — 다음 수업 반영 포인트 섹션
// 이슈 결과를 수업 반영으로 연결하는 핵심 섹션

import { lessonReflectionIssues } from "@/lib/mock-data/issue-mock-data";

export function LessonReflectionIssues() {
  const data = lessonReflectionIssues;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">수업 반영</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          다음 수업 반영 포인트
        </h2>
        <p className="mt-1 text-sm text-muted">
          이슈 결과를 바탕으로 다음 수업에서 꼭 다뤄야 할 항목을 정리했습니다.
        </p>
      </div>

      <div className="grid gap-0 divide-y divide-border/50 lg:grid-cols-3 lg:divide-x lg:divide-y-0">

        {/* 재설명 필요 개념 */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand/10 text-sm">📖</span>
            <p className="text-xs font-bold text-text">재설명 필요 개념</p>
          </div>
          <ul className="space-y-2">
            {data.reExplainNow.map((item, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl border border-brand/15 bg-brand/5 px-4 py-2.5">
                <span className="mt-0.5 text-xs font-black text-brand">→</span>
                <span className="text-xs leading-5 text-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 질문 반영 항목 */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/10 text-sm">💬</span>
            <p className="text-xs font-bold text-text">질문 반영 필요 항목</p>
          </div>
          <ul className="space-y-2">
            {data.questionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5">
                <span className="mt-0.5 text-xs font-bold text-accent">💬</span>
                <span className="text-xs leading-5 text-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 개별 피드백 + 숙제 방향 */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-warm/60 text-sm">👤</span>
              <p className="text-xs font-bold text-text">개별 피드백 필요 학생</p>
            </div>
            <div className="space-y-2">
              {data.individualNeed.map((s) => (
                <div key={s.studentName} className="flex items-start gap-3 rounded-xl border border-warm/40 bg-warm/20 px-3 py-2.5">
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#7a6200] shadow-sm">
                    {s.studentName}
                  </span>
                  <span className="text-xs leading-5 text-text">{s.reason}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3">
            <p className="text-[10px] font-bold text-muted mb-1">다음 숙제 방향</p>
            <p className="text-xs leading-5 text-text">{data.homeworkPriority}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
