import type { StudentDetailData } from "@/types/student-detail";

export function StudentAssignmentSection({ detail }: { detail: StudentDetailData }) {
  const actions = [
    { label: "피드백 추가", note: "오늘 수업 평가 기록", icon: "✚" },
    { label: "학습 플랜 조정", note: "로드맵 및 진도 변경", icon: "🗓" },
    { label: "상세 성적표 조회", note: "월간 리포트 및 데이터 분석", icon: "📊" },
    { label: "학부모 메시지 전송", note: "최근 학습 상태 공유", icon: "✉" },
  ];

  return (
    <section className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.12em] text-muted">학생 관리 액션</p>
          <h3 className="mt-1.5 text-[1.25rem] font-extrabold tracking-tight text-text">빠른 실행</h3>
          <p className="mt-1 text-xs text-muted">다음 수업 반영에 필요한 작업을 바로 실행합니다.</p>
        </div>
        <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-brand">
          {detail.assignments.completionRate}%
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            type="button"
            className={`group flex w-full items-center justify-between rounded-[16px] border px-4 py-3 text-left shadow-sm transition ${
              index === 3
                ? "border-warm/70 bg-warm/30 hover:border-[#d2b200]"
                : "border-border bg-soft/40 hover:border-brand/30 hover:bg-white"
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-brand">
                {action.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-text">{action.label}</span>
                <span className="mt-0.5 block truncate text-xs text-muted">{action.note}</span>
              </span>
            </span>
            <span className="text-muted transition group-hover:text-brand">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}
