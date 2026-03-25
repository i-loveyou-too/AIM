import Link from "next/link";
import type { StudentDetailData } from "@/lib/student-detail-mock-data";

const toneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
  soft: "bg-soft text-brand",
};

export function StudentDetailHeader({ detail }: { detail: StudentDetailData }) {
  const { student } = detail;

  return (
    <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <Link
            href="/dashboard/students"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            ← 학생 목록으로
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[detail.managementTone]}`}>
              {detail.managementStatus}
            </span>
            <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">
              {student.school}
            </span>
            <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">
              {student.grade}
            </span>
          </div>

          <div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.72fr)_minmax(260px,0.58fr)]">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-end gap-3">
                      <h1 className="text-[2rem] font-extrabold tracking-tight text-text sm:text-[2.35rem]">
                        {student.name} 학생 상세
                      </h1>
                      <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">
                        {student.className}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-muted sm:text-base">
                      {student.school} · {student.grade} · {student.subject}
                    </p>
                  </div>

                </div>

                <p className="text-sm leading-6 text-muted sm:text-base">
                  {detail.managementNote}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                    학생 ID: {student.id}
                  </span>
                  <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                    목표 점수: {detail.goalScore}점
                  </span>
                  <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                    현재 성취도: {student.score}%
                  </span>
                  <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                    시험일: {detail.examDate}
                  </span>
                  <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">
                    {detail.dDayLabel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* 학생 성향 블록은 수업 방식과 관리 포인트를 빠르게 확인하려는 용도입니다. */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea3d4d]"
                  >
                    {detail.studyti.ctaLabel}
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {detail.studyti.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-text">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-muted">
                  성향 요약: {detail.studyti.summary}
                </p>

                {/* 목표 대학과 학습 방향은 별도 박스보다 이름 아래 핵심 정보칩으로 바로 보이게 둡니다. */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm">
                    목표 대학: {detail.learningGoal.targetUniversity}
                  </span>
                  <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm">
                    학습 방향: {detail.learningGoal.focusLabel}
                  </span>
                  <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">
                    {detail.learningGoal.admissionTrack}
                  </span>
                </div>

              </div>

              {/* D-day 카드는 오른쪽 요약 카드와 같은 시작선에 맞춰 핵심 신호만 보여줍니다. */}
              <div className="rounded-[28px] bg-[#171519] p-4 text-white shadow-soft sm:p-5 xl:mt-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-warm text-text">
                    🗓️
                  </div>
                  <span className="text-sm font-semibold tracking-[0.18em] text-warm">시험 D-DAY</span>
                </div>

                <div className="mt-4 rounded-[22px] bg-white/5 p-4">
                  <p className="text-center text-sm font-semibold text-white/70">기말고사 {detail.dDayLabel}</p>
                  <p className="mt-2 text-center text-[2.35rem] font-extrabold tracking-tight text-warm sm:text-[2.7rem]">
                    {student.examDays}
                  </p>
                  <div className="mt-4 h-2.5 rounded-full bg-white/10">
                    <div
                      className="h-2.5 rounded-full bg-warm transition-[width] duration-300"
                      style={{ width: `${Math.max(28, 100 - student.examDays * 4)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold text-white/75">
                    {student.examDays <= 14 ? "시험이 가까워 우선 관리가 필요합니다" : "계획 유지가 가능한 구간입니다"}
                  </p>
                </div>

                {/* 시험 목표와 목표 점수는 D-day 옆에서 바로 같이 읽히도록 넣습니다. */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold tracking-[0.16em] text-white/55">이번 시험 목표</p>
                    <p className="mt-2 text-[1.05rem] font-extrabold tracking-tight text-white">
                      {detail.learningGoal.scoreBoostLabel}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold tracking-[0.16em] text-white/55">목표 점수</p>
                    <p className="mt-2 text-[1.05rem] font-extrabold tracking-tight text-warm">
                      {detail.learningGoal.targetScoreLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* 오른쪽 요약은 선생님이 바로 판단할 수 있는 핵심 신호만 모았습니다. */}
              <div className="w-full max-w-[340px] rounded-[28px] border border-border bg-soft p-5">
                {/* 행동 버튼은 빠른 요약 위에서 바로 누를 수 있게 묶어둡니다. */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
                  >
                    피드백 기록
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
                  >
                    과제 보기
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
                  >
                    계획 보기
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
                  >
                    수정
                  </button>
                </div>

                <p className="text-sm font-semibold tracking-[0.16em] text-brand">빠른 요약</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.14em] text-muted">현재 수준</p>
                    <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text">
                      {detail.currentLevel}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.14em] text-muted">계획 상태</p>
                    <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text">
                      {detail.exam.statusLabel}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.14em] text-muted">최근 피드백</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{detail.feedback.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
