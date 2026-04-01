import type { StudentDetailData } from "@/types/student-detail";

export function StudentAiInsightSection({ detail }: { detail: StudentDetailData }) {
  const nextTask = detail.nextActions[0]?.label ?? "<디비 데이터 필요>";

  return (
    <section className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft">
      <p className="text-sm font-bold tracking-[0.12em] text-muted">운영 메모</p>
      <h3 className="mt-1.5 text-[1.2rem] font-extrabold tracking-tight text-text">다음 수업 준비 노트</h3>

      <div className="mt-4 space-y-3">
        <article className="rounded-[16px] border border-border bg-soft/40 p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">최근 상담 메모</p>
          <p className="mt-1.5 text-sm leading-6 text-text/85">{detail.feedback.note}</p>
        </article>

        <article className="rounded-[16px] border border-border bg-soft/40 p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">다음 수업 일정</p>
          <p className="mt-1.5 text-sm font-semibold text-text">{detail.feedback.nextCheck}</p>
          <p className="mt-1 text-xs text-muted">핵심 확인 항목: {nextTask}</p>
        </article>

        <article className="rounded-[16px] border border-brand/20 bg-brand/5 p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand">최근 AI 경고</p>
          <p className="mt-1.5 text-sm leading-6 text-text/85">{detail.aiInsight.progressReport.smartInsight}</p>
        </article>
      </div>
    </section>
  );
}
