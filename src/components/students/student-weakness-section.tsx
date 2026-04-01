import type { StudentDetailData } from "@/types/student-detail";

export function StudentWeaknessSection({ detail }: { detail: StudentDetailData }) {
  return (
    <section className="rounded-[30px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <p className="text-sm font-semibold text-muted">집중 보완 단원</p>
      <h2 className="mt-1.5 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.4rem]">
        이번 수업 교사 체크 포인트
      </h2>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <article className="rounded-[24px] border border-border bg-background/60 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Focused Weak Topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.weaknesses.topics.map((topic) => (
              <span key={topic} className="rounded-full border border-border bg-white px-3 py-1 text-sm font-semibold text-text shadow-sm">
                #{topic}
              </span>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-border bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">반복 실수 유형</p>
            <ul className="mt-3 space-y-2">
              {detail.weaknesses.repeatMistakes.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-[24px] border border-warm/70 bg-[#fff8dd] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a6200]">Teacher Attention</p>
          <p className="mt-3 text-sm leading-7 text-text/85">{detail.weaknesses.note}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.weaknesses.attentionFlags.map((flag) => (
              <span key={flag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
                {flag}
              </span>
            ))}
          </div>
          <p className="mt-4 rounded-[16px] border border-white bg-white/80 px-3 py-2 text-xs text-muted">
            다음 수업 시작 전 5분: 핵심 단원 체크 질문 + 최근 실수 유형 재확인
          </p>
        </article>
      </div>
    </section>
  );
}
