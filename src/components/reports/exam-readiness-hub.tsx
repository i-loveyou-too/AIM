"use client";

// 탭 3: 시험 대비 리포트 허브
// 시험 준비도와 위험도 중심 - "누가 위험한가"를 가장 빠르게 보여주는 탭

import Link from "next/link";

type RiskLevel = "위험" | "주의" | "양호";

type ExamReadinessStudent = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  examDate: string;
  dDay: number;
  riskLevel: RiskLevel;
  readiness: number;
  onTrack: boolean;
  needsExtra: boolean;
  needsPlanAdjust: boolean;
  riskNote: string;
};

type ExamReadinessClass = {
  id: string;
  name: string;
  examDate: string;
  dDay: number;
  riskLevel: RiskLevel;
  avgReadiness: number;
  completionRisk: boolean;
  riskNote: string;
};

const studentRiskStyle: Record<ExamReadinessStudent["riskLevel"], { bg: string; text: string; bar: string; dot: string }> = {
  위험: { bg: "bg-brand/10", text: "text-brand", bar: "bg-brand", dot: "bg-brand" },
  주의: { bg: "bg-warm/50", text: "text-[#7a6200]", bar: "bg-warm", dot: "bg-warm" },
  양호: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500", dot: "bg-emerald-500" },
};

const classRiskStyle: Record<ExamReadinessClass["riskLevel"], { bg: string; text: string; border: string }> = {
  위험: { bg: "bg-brand/10", text: "text-brand", border: "border-brand/30" },
  주의: { bg: "bg-warm/50", text: "text-[#7a6200]", border: "border-warm/50" },
  양호: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
};

function ReadinessBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-soft">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

// D-day 색상: D-14 이내는 붉은색 강조
function DDayBadge({ dDay }: { dDay: number }) {
  const isUrgent = dDay <= 14;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-tight ${
      isUrgent ? "bg-brand text-white" : "bg-soft text-muted"
    }`}>
      D-{dDay}
    </span>
  );
}

export function ExamReadinessHub({
  studentData,
  classData,
}: {
  studentData: ExamReadinessStudent[];
  classData: ExamReadinessClass[];
}) {
  // 위험도순 정렬: 위험 > 주의 > 양호, 동일 위험도면 dDay 오름차순
  const riskOrder = { 위험: 0, 주의: 1, 양호: 2 };
  const sortedStudents = [...studentData].sort(
    (a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || a.dDay - b.dDay,
  );
  const sortedClasses = [...classData].sort(
    (a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || a.dDay - b.dDay,
  );

  const urgentCount = sortedStudents.filter((s) => s.riskLevel === "위험").length;
  const cautionCount = sortedStudents.filter((s) => s.riskLevel === "주의").length;

  return (
    <div id="exam-readiness" className="space-y-6">
      {/* 긴급 요약 배너 */}
      <div className="rounded-[20px] border border-brand/25 bg-brand/5 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-brand mb-1">시험 대비 현황 요약</p>
            <p className="text-sm text-text leading-relaxed">
              위험 학생 <span className="font-extrabold text-brand">{urgentCount}명</span>,
              주의 학생 <span className="font-extrabold text-[#7a6200]">{cautionCount}명</span>이
              즉시 점검이 필요합니다. 시험일 기준으로 정렬되어 있습니다.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-brand">{urgentCount}</p>
              <p className="text-[11px] font-semibold text-brand">위험</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-[#7a6200]">{cautionCount}</p>
              <p className="text-[11px] font-semibold text-[#7a6200]">주의</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-emerald-600">
                {sortedStudents.filter((s) => s.riskLevel === "양호").length}
              </p>
              <p className="text-[11px] font-semibold text-emerald-600">양호</p>
            </div>
          </div>
        </div>
      </div>

      {/* 학생별 시험 준비도 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-text">시험 임박 학생 준비도</h2>
          <span className="rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-semibold text-muted">
            {sortedStudents.length}명
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {sortedStudents.map((student) => {
            const rs = studentRiskStyle[student.riskLevel];
            return (
              <div
                key={`${student.id}-${student.subject}`}
                className={`rounded-[20px] border bg-white p-4 shadow-soft transition hover:-translate-y-0.5 ${
                  student.riskLevel === "위험"
                    ? "border-brand/25 hover:shadow-glow"
                    : "border-border/80 hover:border-brand/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* 위험도 도트 */}
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${rs.dot}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-text">{student.name}</span>
                        <span className="text-[11px] text-muted">{student.grade} · {student.subject}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted">{student.examDate}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <DDayBadge dDay={student.dDay} />
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${rs.bg} ${rs.text}`}>
                      {student.riskLevel}
                    </span>
                  </div>
                </div>

                {/* 준비도 바 */}
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-muted">시험 준비도</span>
                    <span className={`font-extrabold ${rs.text}`}>{student.readiness}%</span>
                  </div>
                  <ReadinessBar value={student.readiness} color={rs.bar} />
                </div>

                {/* 상태 뱃지 */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {!student.onTrack && (
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand">
                      목표 도달 위험
                    </span>
                  )}
                  {student.needsExtra && (
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                      보강 필요
                    </span>
                  )}
                  {student.needsPlanAdjust && (
                    <span className="rounded-full bg-warm/50 px-2.5 py-0.5 text-[10px] font-bold text-[#7a6200]">
                      계획 조정 필요
                    </span>
                  )}
                  {student.onTrack && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      계획 내 진행 중
                    </span>
                  )}
                </div>

                {/* 위험 노트 */}
                <p className="mt-2.5 text-[11px] leading-5 text-muted">{student.riskNote}</p>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/dashboard/students/${student.id}/report`}
                    className="flex-1 rounded-full border border-brand bg-brand py-1.5 text-center text-[11px] font-bold text-white shadow-soft transition hover:shadow-glow"
                  >
                    리포트 보기
                  </Link>
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="flex-1 rounded-full border border-border py-1.5 text-center text-[11px] font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
                  >
                    학생 상세
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 반별 시험 대비 현황 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-text">시험 임박 반 현황</h2>
          <span className="rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-semibold text-muted">
            {sortedClasses.length}개 반
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {sortedClasses.map((cls) => {
            const rs = classRiskStyle[cls.riskLevel];
            return (
              <div
                key={cls.id}
                className={`rounded-[20px] border ${rs.border} bg-white p-4 shadow-soft transition hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-text">{cls.name}</h3>
                    <p className="mt-0.5 text-[11px] text-muted">{cls.examDate}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <DDayBadge dDay={cls.dDay} />
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${rs.bg} ${rs.text}`}>
                      {cls.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-muted">평균 준비도</span>
                    <span className={`font-extrabold ${rs.text}`}>{cls.avgReadiness}%</span>
                  </div>
                  <ReadinessBar
                    value={cls.avgReadiness}
                    color={cls.riskLevel === "위험" ? "bg-brand" : cls.riskLevel === "주의" ? "bg-warm" : "bg-emerald-500"}
                  />
                </div>

                {cls.completionRisk && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-brand/20 bg-brand/5 px-3 py-2">
                    <span className="text-xs">🚨</span>
                    <p className="text-[11px] font-bold text-brand">진도 완주 위험</p>
                  </div>
                )}

                <p className="mt-2.5 text-[11px] leading-5 text-muted">{cls.riskNote}</p>

                <button
                  type="button"
                  className="mt-3 w-full rounded-full border border-brand bg-brand py-1.5 text-[11px] font-bold text-white shadow-soft transition hover:shadow-glow"
                >
                  반 리포트 보기
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
