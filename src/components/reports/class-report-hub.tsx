"use client";

// 탭 2: 반별 리포트 허브
// 운영자/강사 관점에서 반 단위 리포트 탐색

type ClassReportItem = {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  examRisk: "양호" | "주의" | "위험";
  progressStability: "안정" | "보통" | "불안정";
  avgAchievement: number;
  avgHomework: number;
  avgProgress: number;
  achievementTrend: number[];
  homeworkTrend: number[];
  weakUnit: string;
  commonMistake: string;
  teachingPoint: string;
  focusStudentCount: number;
};

const riskStyle: Record<ClassReportItem["examRisk"], { bg: string; text: string }> = {
  양호: { bg: "bg-emerald-50", text: "text-emerald-600" },
  주의: { bg: "bg-warm/50", text: "text-[#7a6200]" },
  위험: { bg: "bg-brand/10", text: "text-brand" },
};

const stabilityStyle: Record<ClassReportItem["progressStability"], { bg: string; text: string }> = {
  안정: { bg: "bg-emerald-50", text: "text-emerald-600" },
  보통: { bg: "bg-warm/50", text: "text-[#7a6200]" },
  불안정: { bg: "bg-brand/10", text: "text-brand" },
};

// 인라인 미니 바 차트 (progress trend 시각화)
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-10 items-end gap-1">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
          <div
            className={`w-full rounded-sm ${color}`}
            style={{ height: `${(v / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, color = "bg-brand" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function ClassReportHub({ data }: { data: ClassReportItem[] }) {
  return (
    <div id="class-report" className="space-y-4">
      {/* 안내 배너 */}
      <div className="rounded-[20px] border border-brand/15 bg-brand/5 px-5 py-4">
        <p className="text-xs font-bold text-brand mb-1">반별 분석 허브</p>
        <p className="text-sm text-text leading-relaxed">
          각 반의 평균 성취도, 숙제 수행률, 진도 달성률과 공통 취약 단원을 비교해 운영 우선순위를 파악할 수 있습니다.
        </p>
      </div>

      {/* 반 카드 목록 */}
      <div className="grid gap-4 xl:grid-cols-2">
        {data.map((cls) => {
          const risk = riskStyle[cls.examRisk];
          const stab = stabilityStyle[cls.progressStability];

          return (
            <div
              key={cls.id}
              className="rounded-[24px] border border-border/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-glow"
            >
              {/* 상단: 반 이름 + 배지 */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-text">{cls.name}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-muted">
                      {cls.subject}
                    </span>
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-muted">
                      학생 {cls.studentCount}명
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${stab.bg} ${stab.text}`}>
                      진도 {cls.progressStability}
                    </span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${risk.bg} ${risk.text}`}>
                  시험 위험도 {cls.examRisk}
                </span>
              </div>

              {/* 지표 바 */}
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-muted">
                    <span>평균 성취도</span>
                    <span className="font-bold text-text">{cls.avgAchievement}%</span>
                  </div>
                  <ProgressBar value={cls.avgAchievement} color="bg-brand" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-muted">
                    <span>평균 숙제 수행률</span>
                    <span className="font-bold text-text">{cls.avgHomework}%</span>
                  </div>
                  <ProgressBar value={cls.avgHomework} color="bg-emerald-500" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-muted">
                    <span>평균 진도 달성률</span>
                    <span className="font-bold text-text">{cls.avgProgress}%</span>
                  </div>
                  <ProgressBar value={cls.avgProgress} color="bg-accent" />
                </div>
              </div>

              {/* 추이 미니 차트 */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/50 bg-soft/50 px-3 py-2.5">
                  <p className="mb-1.5 text-[10px] font-bold text-muted">성취도 추이 (4주)</p>
                  <MiniBarChart data={cls.achievementTrend} color="bg-brand/60" />
                </div>
                <div className="rounded-xl border border-border/50 bg-soft/50 px-3 py-2.5">
                  <p className="mb-1.5 text-[10px] font-bold text-muted">숙제 제출률 추이 (4주)</p>
                  <MiniBarChart data={cls.homeworkTrend} color="bg-emerald-400/70" />
                </div>
              </div>

              {/* 공통 취약 + 재설명 포인트 */}
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2 rounded-xl border border-warm/40 bg-warm/10 px-3.5 py-2.5">
                  <span className="mt-0.5 text-xs">⚠️</span>
                  <div>
                    <p className="text-[10px] font-bold text-[#7a6200]">공통 취약 단원</p>
                    <p className="text-xs text-text">{cls.weakUnit}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{cls.commonMistake}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-border/50 bg-soft/50 px-3.5 py-2.5">
                  <span className="mt-0.5 text-xs">📋</span>
                  <div>
                    <p className="text-[10px] font-bold text-muted">재설명 필요 포인트</p>
                    <p className="text-xs text-text">{cls.teachingPoint}</p>
                  </div>
                </div>
              </div>

              {/* 집중 관리 학생 수 + 버튼 */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted">
                  집중 관리 필요 학생{" "}
                  <span className="font-bold text-brand">{cls.focusStudentCount}명</span>
                </span>
                <button
                  type="button"
                  className="rounded-full border border-brand bg-brand px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:shadow-glow"
                >
                  반 리포트 보기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
