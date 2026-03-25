// 과제 관리 — 공통 오답 분석 섹션
// 가장 많이 틀린 문제 TOP 5, 취약 개념, 반복 패턴, 재설명 필요 개념

import type { CommonMistakeAnalysis } from "@/lib/mock-data/assignment-mock-data";

const mistakeTypeStyle: Record<string, string> = {
  "계산 실수": "bg-brand/10 text-brand",
  "절차 누락": "bg-warm/50 text-[#7a6200]",
  "개념 혼동": "bg-accent/10 text-accent",
  "서술 오류": "bg-soft text-muted",
};

type Props = {
  analysis: CommonMistakeAnalysis;
  totalStudents: number;
};

export function CommonMistakeAnalysisSection({ analysis, totalStudents }: Props) {
  const maxCount = Math.max(...analysis.topMistakes.map((m) => m.incorrectCount));

  return (
    <div className="space-y-5">

      {/* TOP 5 오답 문항 */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
          가장 많이 틀린 문항 TOP 5
        </p>
        <div className="space-y-2.5">
          {analysis.topMistakes.map((item) => {
            const pct = Math.round((item.incorrectCount / totalStudents) * 100);
            const barW = (item.incorrectCount / maxCount) * 100;
            return (
              <div key={item.rank} className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">
                    {item.rank}
                  </span>
                  <span className="text-sm font-bold text-text">{item.questionNum}번 — {item.topic}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${mistakeTypeStyle[item.mistakeType] ?? "bg-soft text-muted"}`}>
                    {item.mistakeType}
                  </span>
                  <span className="ml-auto text-xs font-bold text-brand">{item.incorrectCount}명 오답 ({pct}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-soft">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${barW}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 공통 취약 개념 */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
          공통 취약 개념
        </p>
        <ul className="space-y-1.5">
          {analysis.weakConceptSummary.map((c, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-soft/60 px-4 py-2.5">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span className="text-xs leading-5 text-text">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 반복 실수 패턴 */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
          반복 실수 패턴
        </p>
        <div className="flex flex-wrap gap-2">
          {analysis.repeatMistakePatterns.map((p, i) => (
            <span key={i} className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* 재설명 필요 */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          재설명 필요 개념
        </p>
        <ul className="space-y-1.5">
          {analysis.explanationNeeded.map((e, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5">
              <span className="mt-0.5 text-xs font-bold text-accent">→</span>
              <span className="text-xs leading-5 text-text">{e}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 질문이 많이 나온 포인트 */}
      {analysis.topQuestions.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            질문 집중 포인트
          </p>
          <ul className="space-y-1.5">
            {analysis.topQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl bg-soft/60 px-4 py-2.5">
                <span className="mt-0.5 text-xs font-bold text-accent">💬</span>
                <span className="text-xs leading-5 text-text">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
