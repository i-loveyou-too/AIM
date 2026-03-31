import type { StudentDetailData } from "@/types/student-detail";

export function StudentFeedbackSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">선생님 피드백 노트</p>
          <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
            최근 피드백과 다음 체크 사항을 정리합니다
          </h2>
        </div>
        <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">
          {detail.feedback.summary}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-border bg-soft p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">학습 태도 메모</p>
          <p className="mt-2 text-sm leading-6 text-muted">{detail.feedback.attitude}</p>
        </article>
        <article className="rounded-[24px] border border-border bg-soft p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">보완 포인트</p>
          <p className="mt-2 text-sm leading-6 text-muted">{detail.feedback.supplement}</p>
        </article>
        <article className="rounded-[24px] border border-border bg-soft p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">최근 피드백 요약</p>
          <p className="mt-2 text-sm leading-6 text-muted">{detail.feedback.summary}</p>
        </article>
        <article className="rounded-[24px] border border-border bg-soft p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">다음 수업 전 체크</p>
          <p className="mt-2 text-sm leading-6 text-muted">{detail.feedback.nextCheck}</p>
          <p className="mt-3 text-sm font-semibold text-brand">{detail.feedback.note}</p>
        </article>
      </div>
    </section>
  );
}
