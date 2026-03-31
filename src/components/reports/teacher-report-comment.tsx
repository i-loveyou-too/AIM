// 선생님 종합 코멘트 섹션
// 강점 / 우려사항 / 최근 변화 / 다음 집중 방향

export function TeacherReportComment({
  data,
  studentName,
  reportPeriod,
}: {
  data: {
    strengths: string[];
    concerns: string[];
    recentChange: string;
    nextFocus: string;
  } | null | undefined;
  studentName: string;
  reportPeriod: string;
}) {
  if (!data) {
    return (
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-8 shadow-soft">
        <p className="text-sm font-semibold text-muted">선생님 코멘트 데이터가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">선생님 종합 코멘트</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          {studentName} 학생 종합 평가
        </h2>
        <p className="mt-1 text-sm text-muted">
          {reportPeriod} 기간 기준 담당 선생님의 종합 평가입니다.
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* 강점 */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-sm">💪</span>
            <p className="text-xs font-bold text-emerald-700">강점</p>
          </div>
          <ul className="space-y-2">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm text-emerald-800 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 우려사항 */}
        <div className="rounded-2xl border border-brand/15 bg-brand/5 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand/10 text-sm">⚠️</span>
            <p className="text-xs font-bold text-brand">우려사항</p>
          </div>
          <ul className="space-y-2">
            {data.concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
                <span className="text-sm text-text leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 최근 변화 */}
        <div className="rounded-2xl border border-border/60 bg-soft/60 px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-soft text-sm">📊</span>
            <p className="text-xs font-bold text-text">최근 변화</p>
          </div>
          <p className="text-sm text-text leading-relaxed">{data.recentChange}</p>
        </div>

        {/* 다음 집중 방향 */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/10 text-sm">🎯</span>
            <p className="text-xs font-bold text-accent">다음 집중 방향</p>
          </div>
          <p className="text-sm text-text leading-relaxed">{data.nextFocus}</p>
        </div>
      </div>
    </section>
  );
}
