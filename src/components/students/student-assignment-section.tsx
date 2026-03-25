import type { StudentDetailData } from "@/lib/student-detail-mock-data";

export function StudentAssignmentSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">과제 관리 상태</p>
            <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
              최근 과제 흐름과 누적 수행률
            </h2>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {detail.assignments.completionRate}%
          </span>
        </div>

        <div className="mt-6 rounded-[28px] bg-soft p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-text">누적 과제 수행률</p>
            <p className="text-sm font-semibold text-brand">{detail.assignments.completionText}</p>
          </div>
          <div className="mt-3 h-3 rounded-full bg-white">
            <div
              className="h-3 rounded-full bg-brand transition-[width] duration-300"
              style={{ width: `${detail.assignments.completionRate}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{detail.assignments.riskText}</p>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <p className="text-sm font-medium text-muted">최근 과제 목록</p>
        <div className="mt-5 space-y-3">
          {detail.assignments.items.map((item) => (
            <div key={`${item.title}-${item.due}`} className="rounded-[24px] border border-border bg-background/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[1.02rem] font-extrabold tracking-tight text-text">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.note}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "완료" ? "bg-emerald-100 text-emerald-700" : "bg-brand/10 text-brand"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">기한</span>
                <span className="font-semibold text-text">{item.due}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
