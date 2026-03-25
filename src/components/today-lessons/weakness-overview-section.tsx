// 약점 / 집중 관리 학생 개요 섹션
// 오늘 특별히 신경 써야 할 학생들을 빠르게 파악

import { weaknessOverview } from "@/lib/mock-data/today-lessons";

const urgencyStyles: Record<"높음" | "중간", { badge: string; border: string }> = {
  높음: {
    badge: "bg-brand text-white",
    border: "border-brand/25 hover:border-brand/40",
  },
  중간: {
    badge: "bg-warm/80 text-[#7a6200]",
    border: "border-border hover:border-accent/30",
  },
};

export function WeaknessOverviewSection() {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      {/* 섹션 헤더 */}
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          약점 / 집중 관리
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          오늘 집중 관리가 필요한 학생
        </h2>
        <p className="mt-1 text-sm text-muted">
          약점이 겹치거나, 보강이 필요하거나, 숙제 반영이 중요한 학생을 우선 확인하세요.
        </p>
      </div>

      {/* 학생 카드 리스트 */}
      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
        {weaknessOverview.map((student) => {
          const styles = urgencyStyles[student.urgency];
          return (
            <div
              key={student.studentName}
              className={`rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft ${styles.border}`}
            >
              {/* 상단: 이름 + 긴급도 */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-extrabold text-text">{student.studentName}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {student.grade} · {student.subject}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${styles.badge}`}>
                  긴급 {student.urgency}
                </span>
              </div>

              {/* 집중 사유 */}
              <div className="mt-3 rounded-xl bg-soft px-4 py-3">
                <p className="text-[11px] font-semibold text-muted">집중 관리 사유</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-text">{student.focusReason}</p>
              </div>

              {/* 겹치는 약점 */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-muted">공통 약점 영역</p>
                <p className="mt-1 text-xs leading-5 text-text">{student.overlappingWeakness}</p>
              </div>

              {/* 오늘 액션 */}
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand/15 bg-brand/5 px-3 py-2.5">
                <span className="mt-0.5 text-xs text-brand">→</span>
                <p className="text-xs font-semibold text-brand">{student.action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
