// 리포트 허브 페이지 헤더
// 제목, 설명 영역

export function ReportHubHeader() {
  return (
    <header className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            리포트 허브
          </p>
          <h1 className="mt-1.5 text-[1.5rem] font-extrabold tracking-tight text-text sm:text-[1.8rem]">
            리포트
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            학생별, 반별, 시험 대비, 기간별 리포트를 모아서 학습 상태와 운영 흐름을 분석하는 허브 화면입니다.
          </p>
        </div>
      </div>
    </header>
  );
}
