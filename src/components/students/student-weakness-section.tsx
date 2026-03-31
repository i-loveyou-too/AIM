import type { StudentDetailData } from "@/types/student-detail";

export function StudentWeaknessSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <p className="text-sm font-medium text-muted">취약 단원 / 위험 요소</p>
        <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
          반복 관리가 필요한 포인트를 모아봅니다
        </h2>

        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] border border-border bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">취약 단원</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.weaknesses.topics.map((topic) => (
                <span key={topic} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-text shadow-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">반복 실수 유형</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {detail.weaknesses.repeatMistakes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-soft p-5 shadow-none">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand">선생님 주의 포인트</p>
        <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-text">최근 피드백 기반 체크</p>
          <p className="mt-2 text-sm leading-6 text-muted">{detail.weaknesses.note}</p>
        </div>

        <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">집중 관리 플래그</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.weaknesses.attentionFlags.map((flag) => (
              <span key={flag} className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                {flag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted">집중 관리 메모</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            반복 실수와 취약 단원은 다음 수업에서 우선적으로 확인해야 합니다.
          </p>
        </div>
      </article>
    </section>
  );
}
