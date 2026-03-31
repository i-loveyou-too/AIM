// 취약 단원 분석 섹션
// 반복 오답 단원 목록 + 실수 패턴 분석

const severityStyle: Record<string, { bg: string; text: string; dot: string }> = {
  높음:  { bg: "bg-brand/10",    text: "text-brand",       dot: "bg-brand"       },
  중간:  { bg: "bg-warm/50",     text: "text-[#7a6200]",   dot: "bg-warm"        },
  낮음:  { bg: "bg-emerald-50",  text: "text-emerald-600", dot: "bg-emerald-400" },
};

const categoryStyle: Record<string, string> = {
  계산: "bg-accent/10 text-accent",
  개념: "bg-brand/10 text-brand",
  서술: "bg-soft text-muted",
  응용: "bg-emerald-50 text-emerald-600",
};

const mistakeTypeStyle: Record<string, string> = {
  "계산 실수":  "bg-brand/10 text-brand",
  "개념 혼동":  "bg-accent/10 text-accent",
  "절차 누락":  "bg-warm/50 text-[#7a6200]",
};

export function WeaknessAnalysisSection({
  weakTopics,
  repeatMistakePatterns,
}: {
  weakTopics: Array<{
    topic: string;
    severity: "높음" | "중간" | "낮음";
    category: "계산" | "개념" | "서술" | "응용";
    frequency: number;
    lastOccurred: string;
    riskBeforeExam: boolean;
  }>;
  repeatMistakePatterns: Array<{
    type: "계산 실수" | "개념 혼동" | "절차 누락" | string;
    pattern: string;
    count: number;
  }>;
}) {
  if (!weakTopics || weakTopics.length === 0) {
    return (
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-8 shadow-soft">
        <p className="text-sm font-semibold text-muted">취약 단원 데이터가 없습니다.</p>
      </section>
    );
  }

  const riskTopics = weakTopics.filter((t) => t.riskBeforeExam);
  const maxFreq = Math.max(...weakTopics.map((t) => t.frequency));

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">취약 단원 분석</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          반복 오답 단원 & 실수 패턴
        </h2>
        <p className="mt-1 text-sm text-muted">
          최근 4주간 반복된 오답 패턴과 시험 전 집중 보완이 필요한 단원을 분석합니다.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* 시험 전 위험 단원 경고 */}
        {riskTopics.length > 0 && (
          <div className="mb-5 rounded-2xl border border-brand/25 bg-brand/5 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-xs font-bold text-brand">
                시험 전 집중 보완 필요 — {riskTopics.length}개 단원
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {riskTopics.map((t) => (
                <span
                  key={t.topic}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand shadow-sm ring-1 ring-brand/20"
                >
                  {t.topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 취약 단원 목록 */}
        <div className="mb-6 space-y-3">
          {weakTopics.map((topic) => {
            const sev = severityStyle[topic.severity];
            const barWidth = (topic.frequency / maxFreq) * 100;
            return (
              <div
                key={topic.topic}
                className="rounded-2xl border border-border/60 bg-soft/40 px-4 py-3.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-text">{topic.topic}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryStyle[topic.category]}`}>
                      {topic.category}
                    </span>
                    {topic.riskBeforeExam && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                        시험 위험
                      </span>
                    )}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${sev.bg} ${sev.text}`}>
                    {topic.severity}
                  </span>
                </div>

                {/* 오답 빈도 바 */}
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="w-14 text-[11px] text-muted">오답 {topic.frequency}회</span>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-soft">
                      <div
                        className={`h-full rounded-full ${sev.dot} transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-muted">최근 {topic.lastOccurred}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 반복 실수 패턴 */}
        <div>
          <p className="mb-3 text-xs font-bold text-text">반복 실수 패턴</p>
          <div className="space-y-2">
            {repeatMistakePatterns.map((p) => (
              <div
                key={p.pattern}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-soft/40 px-4 py-2.5"
              >
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${mistakeTypeStyle[p.type] ?? "bg-soft text-muted"}`}>
                  {p.type}
                </span>
                <span className="flex-1 text-xs text-text">{p.pattern}</span>
                <span className="shrink-0 text-[11px] font-bold text-muted">{p.count}회</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
