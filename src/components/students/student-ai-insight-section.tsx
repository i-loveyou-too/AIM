import type { StudentDetailData } from "@/lib/student-detail-mock-data";

const toneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
  soft: "bg-soft text-brand",
};

// 이 섹션은 AI가 읽은 학습 진도와 취약 유형을 한눈에 보여주는 판단용 영역입니다.
export function StudentAiInsightSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">학습 진도 리포트</p>
            <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
              역산 계획 기반 스케줄 최적화
            </h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {detail.aiInsight.progressReport.statusLabel}
          </span>
        </div>

        {/* 현재 단원과 진도율은 시험 전 역산 계획이 어디쯤인지 보여주는 핵심 지표입니다. */}
        <p className="mt-3 text-sm leading-6 text-muted">{detail.progress.progressNote}</p>

        <div className="mt-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">
            {detail.aiInsight.progressReport.currentChapterLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-[1.7rem] font-extrabold tracking-tight text-text sm:text-[2rem]">
              {detail.aiInsight.progressReport.currentChapter}
            </h3>
            <p className="text-[2rem] font-extrabold tracking-tight text-brand sm:text-[2.4rem]">
              {detail.aiInsight.progressReport.progressRate}%
            </p>
          </div>

          <div className="mt-4 h-3 rounded-full bg-soft">
            <div
              className="h-3 rounded-full bg-brand transition-[width] duration-300"
              style={{ width: `${detail.aiInsight.progressReport.progressRate}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {/* 다음 목표와 완료 예정일은 선생님이 수업 순서를 바로 조정할 때 보는 값입니다. */}
          <div className="rounded-[28px] bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">다음 목표</p>
            <p className="mt-2 text-[1.02rem] font-extrabold tracking-tight text-text">
              {detail.aiInsight.progressReport.nextGoal}
            </p>
          </div>
          <div className="rounded-[28px] bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">완료 예정일</p>
            <p className="mt-2 text-[1.02rem] font-extrabold tracking-tight text-text">
              {detail.aiInsight.progressReport.completeDate}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border-l-4 border-[#FFE44D] bg-[#fffdf0] p-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted">AI 인사이트</p>
          <p className="mt-3 text-sm leading-7 text-text/85">
            {detail.aiInsight.progressReport.smartInsight}
          </p>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">취약 유형 분석</p>
            <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
              AI가 찾은 반복 취약 포인트
            </h2>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {detail.aiInsight.weakAnalysis.length}개 항목
          </span>
        </div>

        {/* 취약 유형 분석은 오답 패턴과 반복 실수를 묶어서 보여주는 판단용 영역입니다. */}
        <div className="mt-5 space-y-4">
          {detail.aiInsight.weakAnalysis.map((item) => (
            <article key={item.title} className="rounded-[24px] border border-border bg-background/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[1.02rem] font-extrabold tracking-tight text-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[item.tone]}`}>
                  {item.statusLabel}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-3 flex-1 rounded-full bg-white">
                  <div
                    className="h-3 rounded-full bg-brand transition-[width] duration-300"
                    style={{ width: `${item.progressRate}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted">{item.accuracyLabel}</span>
              </div>
            </article>
          ))}
        </div>

        {/* 추천 영역은 바로 다음 행동으로 이어지도록 보강안만 짧게 제시합니다. */}
        <div className="mt-5 rounded-[28px] border border-dashed border-border bg-soft p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text">{detail.aiInsight.clinicRecommendation.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {detail.aiInsight.clinicRecommendation.subtitle}
              </p>
            </div>
            <button
              type="button"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea3d4d]"
            >
              {detail.aiInsight.clinicRecommendation.ctaLabel}
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
