// 숙제 반영 개요 섹션
// 오늘 수업 전에 반드시 확인하고 수업에 연결해야 할 숙제 결과 요약

type HomeworkReflection = {
  criticalItems: Array<{
    studentName: string;
    subject: string;
    issue: string;
    actionRequired: string;
  }>;
  incompleteHomework: Array<{
    studentName: string;
    subject: string;
    completionRate: number;
  }>;
  commonReExplanation: string[];
  reinforcementNeeded: string[];
};

type Props = {
  homeworkReflection: HomeworkReflection;
};

export function HomeworkReflectionSection({ homeworkReflection }: Props) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      {/* 섹션 헤더 */}
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          숙제 반영
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          오늘 수업에 반영해야 할 숙제 이슈
        </h2>
        <p className="mt-1 text-sm text-muted">
          지난 숙제 결과를 오늘 수업 계획에 연결하세요.
        </p>
      </div>

      <div className="space-y-0 divide-y divide-border/50">
        {/* 1. 오늘 반드시 반영할 항목 */}
        <div className="px-6 py-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            오늘 꼭 반영할 숙제 이슈
          </p>
          <div className="space-y-3">
            {homeworkReflection.criticalItems.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-brand/20 bg-brand/5 px-5 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-text">{item.studentName}</span>
                    <span className="rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                      {item.subject}
                    </span>
                  </div>
                  <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
                    반영 필요
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-text">{item.issue}</p>
                <div className="mt-2 flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-bold text-accent">→</span>
                  <p className="text-xs font-semibold text-accent">{item.actionRequired}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 숙제 미완료 학생 */}
        <div className="px-6 py-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            숙제 미완료 / 부분 완료 학생
          </p>
          <div className="flex flex-wrap gap-3">
            {homeworkReflection.incompleteHomework.map((hw, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-soft px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-text">{hw.studentName}</p>
                  <p className="text-xs text-muted">{hw.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full ${
                        hw.completionRate >= 80 ? "bg-yellow-400" : "bg-brand"
                      }`}
                      style={{ width: `${hw.completionRate}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      hw.completionRate >= 80 ? "text-[#8a6200]" : "text-brand"
                    }`}
                  >
                    {hw.completionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 공통 재설명 포인트 + 보강 필요 항목 */}
        <div className="grid gap-0 px-6 py-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              공통 재설명 포인트
            </p>
            <ul className="space-y-2">
              {homeworkReflection.commonReExplanation.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-6 text-text">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 sm:mt-0">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              보강 필요 항목
            </p>
            <ul className="space-y-2">
              {homeworkReflection.reinforcementNeeded.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl bg-soft px-3 py-2 text-xs font-semibold leading-5 text-text"
                >
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-brand">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
