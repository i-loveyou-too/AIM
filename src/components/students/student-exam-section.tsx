import type { StudentDetailData } from "@/lib/student-detail-mock-data";

export function StudentExamSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">시험일 기준 관리</p>
            <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
              역산 계획과 시험 준비 상태를 확인합니다
            </h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            detail.exam.statusTone === "gold"
              ? "bg-warm/70 text-text"
              : detail.exam.statusTone === "peach"
                ? "bg-accent/10 text-accent"
                : "bg-soft text-brand"
          }`}>
            {detail.exam.statusLabel}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-[28px] bg-[#171519] p-5 text-white shadow-soft">
            <p className="text-xs font-semibold tracking-[0.16em] text-warm">시험일</p>
            <p className="mt-3 text-[2.8rem] font-extrabold leading-none tracking-tight text-warm">
              {detail.dDayLabel}
            </p>
            <p className="mt-2 text-[1.05rem] font-extrabold tracking-tight">{detail.exam.examDate}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{detail.exam.planNote}</p>
          </div>

          <div className="rounded-[28px] border border-border bg-soft p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">역산 계획상 현재 위치</p>
            <p className="mt-3 text-[1.45rem] font-extrabold tracking-tight text-text">
              {detail.exam.reversePlanPosition}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{detail.exam.reversePlanNote}</p>

            <div className="mt-5 rounded-[22px] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-text">현재 계획 대비 진도 상태</p>
                <p className="text-sm font-semibold text-brand">{detail.exam.planRate}%</p>
              </div>
              <div className="mt-3 h-3 rounded-full bg-soft">
                <div
                  className="h-3 rounded-full bg-brand transition-[width] duration-300"
                  style={{ width: `${detail.exam.planRate}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                {detail.exam.planStatus} 기준으로 관리 중입니다.
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <p className="text-sm font-medium text-muted">시험 전 체크</p>
        <h3 className="mt-2 text-[1.1rem] font-extrabold tracking-tight text-text sm:text-[1.25rem]">
          계획 조정이 필요한지 빠르게 판단합니다
        </h3>

        <div className="mt-5 grid gap-3">
          <div className="rounded-[24px] border border-border bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">남은 기간</p>
            <p className="mt-2 text-[1.4rem] font-extrabold tracking-tight text-text">{detail.exam.remainingDays}</p>
          </div>
          <div className="rounded-[24px] border border-border bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">시험 준비 메시지</p>
            <p className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text">{detail.exam.statusLabel}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{detail.exam.planNote}</p>
          </div>
          <div className="rounded-[24px] border border-border bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">계획 조정 판단</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {detail.exam.planRate >= 80
                ? "계획 유지 가능"
                : detail.exam.planRate >= 65
                  ? "보강 필요"
                  : "진도 재조정 필요"}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
