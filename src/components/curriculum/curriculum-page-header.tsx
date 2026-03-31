import Link from "next/link";
type CurriculumPageHeaderProps = {
  overview: {
    school: string;
    className: string;
    examDate: string;
    dDay: string;
  };
};

export function CurriculumPageHeader({ overview }: CurriculumPageHeaderProps) {
  return (
    <header className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            계획 · 커리큘럼
          </p>
          <h1 className="mt-1.5 text-[1.5rem] font-extrabold tracking-tight text-text sm:text-[1.8rem]">
            계획 / 커리큘럼
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            시험일까지의 남은 기간과 현재 진도를 비교해, 전체 커리큘럼 완주 가능성과 다음 수업 방향을
            한눈에 확인하는 화면입니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm">
              {overview.school}
            </span>
            <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm">
              {overview.className}
            </span>
            <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm">
              시험일 {overview.examDate}
            </span>
            <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">
              {overview.dDay}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
          <button
            type="button"
            className="rounded-full border border-brand bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            계획 조정
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            진도 업데이트
          </button>
          <Link
            href="/dashboard/today-lessons"
            className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            다음 수업 보기
          </Link>
        </div>
      </div>
    </header>
  );
}
