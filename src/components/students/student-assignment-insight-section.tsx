import type { StudentDetailData } from "@/types/student-detail";

export function StudentAssignmentInsightSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="rounded-[30px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">최근 과제 제출 이력</p>
          <h2 className="mt-1.5 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.4rem]">
            최근 과제 현황
          </h2>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
        >
          전체 보기 <span aria-hidden>›</span>
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-border">
        <div className="grid grid-cols-[minmax(0,1.45fr)_92px_110px_84px] gap-3 bg-soft/80 px-4 py-3 text-xs font-bold tracking-[0.12em] text-muted">
          <span>과제명</span>
          <span>마감일</span>
          <span>상태</span>
          <span className="text-right">점수</span>
        </div>
        <div className="divide-y divide-border bg-white">
          {detail.assignments.items.map((item) => (
            <div key={`${item.title}-${item.due}`} className="grid grid-cols-[minmax(0,1.45fr)_92px_110px_84px] gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{item.title}</p>
                <p className="mt-1 truncate text-xs text-muted">{item.note}</p>
              </div>
              <div className="text-sm font-medium text-muted">{item.due}</div>
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    item.status === "완료"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "미완료"
                        ? "bg-brand/10 text-brand"
                        : "bg-warm/70 text-text"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-right text-sm font-bold text-text">{item.score}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
