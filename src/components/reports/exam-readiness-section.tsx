// 시험 준비도 섹션
// D-day 카운트다운, 준비도 게이지, 체크리스트

type ExamReadinessData = {
  dDay: string;
  examDate: string;
  readinessScore: number;
  status: string;
  currentEstimated: number;
  targetScore: number;
  canReachTarget: boolean;
  reachableScore: number;
  examCoverageReady: number;
  checkItems: Array<{
    label: string;
    done: boolean;
  }>;
  remainingLessons: number;
  remainingWeeks: number;
};

export function ExamReadinessSection({ data }: { data: ExamReadinessData | null | undefined }) {
  if (!data) {
    return (
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-8 shadow-soft">
        <p className="text-sm font-semibold text-muted">시험 준비도 데이터가 없습니다.</p>
      </section>
    );
  }

  const doneCount = data.checkItems.filter((c) => c.done).length;
  const totalCount = data.checkItems.length;
  const readinessColor =
    data.readinessScore >= 80 ? "text-emerald-600" :
    data.readinessScore >= 65 ? "text-[#7a6200]" :
    "text-brand";
  const readinessBg =
    data.readinessScore >= 80 ? "bg-emerald-500" :
    data.readinessScore >= 65 ? "bg-warm" :
    "bg-brand";

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">시험 준비도</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          시험 대비 현황 & 체크리스트
        </h2>
        <p className="mt-1 text-sm text-muted">
          시험일까지 남은 기간과 현재 준비 완료율을 확인하세요.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* D-day + 준비도 요약 */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* D-day */}
          <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-brand/10 px-4 py-4 text-center ring-1 ring-brand/20">
            <p className="text-[11px] font-semibold text-brand">시험일</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand">{data.dDay}</p>
            <p className="text-[10px] text-brand/70">{data.examDate}</p>
          </div>

          {/* 준비도 점수 */}
          <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-soft px-4 py-4 text-center">
            <p className="text-[11px] font-semibold text-muted">준비도</p>
            <p className={`mt-1 text-2xl font-extrabold tracking-tight ${readinessColor}`}>
              {data.readinessScore}%
            </p>
            <p className={`text-[10px] font-bold ${readinessColor}`}>{data.status}</p>
          </div>

          {/* 현재 예상 vs 목표 */}
          <div className="col-span-1 rounded-2xl bg-soft px-4 py-3.5">
            <p className="text-[11px] font-semibold text-muted">현재 예상 점수</p>
            <p className="mt-1 text-xl font-extrabold text-text">{data.currentEstimated}점</p>
            <p className="text-[10px] text-muted">목표 {data.targetScore}점</p>
          </div>

          {/* 도달 가능 점수 */}
          <div className={`col-span-1 rounded-2xl px-4 py-3.5 ${data.canReachTarget ? "bg-emerald-50" : "bg-warm/40"}`}>
            <p className={`text-[11px] font-semibold ${data.canReachTarget ? "text-emerald-600" : "text-[#7a6200]"}`}>
              현 속도 도달 예상
            </p>
            <p className={`mt-1 text-xl font-extrabold ${data.canReachTarget ? "text-emerald-600" : "text-[#7a6200]"}`}>
              {data.reachableScore}점
            </p>
            <p className={`text-[10px] font-semibold ${data.canReachTarget ? "text-emerald-600" : "text-[#7a6200]"}`}>
              {data.canReachTarget ? "목표 달성 가능" : "보강 필요"}
            </p>
          </div>
        </div>

        {/* 준비도 게이지 */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">시험 범위 준비 완료율</span>
            <span className={`text-sm font-extrabold ${readinessColor}`}>{data.examCoverageReady}%</span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-soft">
            {/* 목표선 */}
            <div
              className="absolute top-0 h-full w-px bg-muted/30"
              style={{ left: `${data.targetScore}%` }}
            />
            <div
              className={`h-full rounded-full transition-all duration-700 ${readinessBg}`}
              style={{ width: `${data.examCoverageReady}%` }}
            />
          </div>
          <div className="mt-1 flex justify-end">
            <span className="text-[10px] text-muted">목표 {data.targetScore}%</span>
          </div>
        </div>

        {/* 체크리스트 */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-text">준비 체크리스트</p>
            <span className="rounded-full bg-soft px-3 py-1 text-[11px] font-bold text-muted">
              {doneCount}/{totalCount} 완료
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.checkItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 ${
                  item.done
                    ? "border border-emerald-100 bg-emerald-50"
                    : "border border-border/50 bg-soft/40"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  item.done
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-border text-transparent"
                }`}>
                  {item.done ? "✓" : ""}
                </span>
                <span className={`text-xs font-semibold ${item.done ? "text-emerald-700" : "text-muted"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {/* 남은 수업/기간 */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-[11px] font-semibold text-muted">
              📅 남은 수업 {data.remainingLessons}회
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-[11px] font-semibold text-muted">
              ⏱ 약 {data.remainingWeeks}주 남음
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
