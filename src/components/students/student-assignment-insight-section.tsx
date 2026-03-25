import type { StudentDetailData } from "@/lib/student-detail-mock-data";

// 이 섹션은 과제 현황, 관찰 노트, 바로 실행할 다음 액션을 한 번에 묶어 보여줍니다.
export function StudentAssignmentInsightSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="space-y-4">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">최근 과제 현황</p>
            <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
              최근 과제와 점수가 한눈에 보이도록 정리합니다
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-soft px-3 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            전체보기 <span aria-hidden>›</span>
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-[26px] border border-border bg-background/60">
          <div className="grid grid-cols-[minmax(0,1.55fr)_110px_110px_90px] gap-4 border-b border-border bg-soft px-4 py-3 text-xs font-semibold tracking-[0.14em] text-muted sm:px-5">
            <span>과제 명</span>
            <span>마감일</span>
            <span>상태</span>
            <span className="text-right">점수</span>
          </div>

          <div className="divide-y divide-border">
            {detail.assignments.items.map((item) => (
              <div
                key={`${item.title}-${item.due}`}
                className="grid grid-cols-[minmax(0,1.55fr)_110px_110px_90px] gap-4 px-4 py-4 transition hover:bg-white/70 sm:px-5"
              >
                <div>
                  <p className="text-[1.02rem] font-extrabold tracking-tight text-text">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.note}</p>
                </div>
                <div className="flex items-center text-sm font-semibold text-text">{item.due}</div>
                <div className="flex items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "완료" ? "bg-emerald-100 text-emerald-700" : "bg-brand/10 text-brand"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-end text-[1.1rem] font-extrabold tracking-tight text-brand">
                  {item.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              ✎
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted">선생님 관찰 노트</p>
              <h3 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.35rem]">
                최근 관찰을 바로 다시 볼 수 있게 정리합니다
              </h3>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] bg-soft p-4 sm:p-5">
            <p className="text-sm leading-7 text-text/80">“{detail.feedback.note}”</p>
            <p className="mt-4 text-sm leading-6 text-muted">{detail.feedback.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">
                {detail.feedback.attitude}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                {detail.feedback.nextCheck}
              </span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="text-sm font-semibold text-brand transition hover:text-[#ea3d4d]"
            >
              노트 추가 작성 +
            </button>
          </div>
        </article>

        <article className="rounded-[32px] border border-border/80 bg-[#FFE44D] p-5 shadow-soft sm:p-6">
          <p className="text-sm font-extrabold tracking-[0.12em] text-text/80">다음 액션</p>
          <h3 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.35rem]">
            지금 바로 정리해둘 관리 항목
          </h3>

          <div className="mt-5 space-y-3">
            {[
              `${detail.weaknesses.topics[0]} 심화 기출 50제 배부`,
              `${detail.student.subject} 개별 보강 1회 진행`,
            ].map((item, index) => (
              <div key={item} className="rounded-[22px] border border-white/70 bg-white/30 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#847000] text-sm font-extrabold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-text">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-[18px] bg-[#8d7600] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6f5d00]"
          >
            전송 및 일정 예약
          </button>
        </article>
      </div>
    </section>
  );
}
