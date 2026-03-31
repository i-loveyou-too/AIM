// 과제 관리 — 다음 수업 반영 포인트 섹션
// 이 페이지의 핵심 차별점: 과제 → 수업 반영 흐름 연결

type FeedbackTarget = {
  studentName: string;
  reason: string;
};

type LessonReflection = {
  urgency: string;
  reExplainTopics: string[];
  reinforcementItems: string[];
  individualFeedbackNeeded: FeedbackTarget[];
  questionReflectionItems: string[];
  homeworkFollowUp: string;
};

const urgencyStyle: Record<string, { bg: string; text: string; border: string }> = {
  높음: { bg: "bg-brand/10",  text: "text-brand",       border: "border-brand/20"   },
  중간: { bg: "bg-warm/50",   text: "text-[#7a6200]",   border: "border-warm/50"    },
  낮음: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
};

type Props = {
  reflection: LessonReflection;
};

export function LessonReflectionSection({ reflection }: Props) {
  const ug = urgencyStyle[reflection.urgency];

  return (
    <div className="space-y-5">

      {/* 긴급도 배너 */}
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${ug.bg} ${ug.border}`}>
        <span className="text-lg">🎯</span>
        <div>
          <p className={`text-xs font-bold ${ug.text}`}>수업 반영 긴급도 — {reflection.urgency}</p>
          <p className="text-[11px] text-muted">아래 항목들을 다음 수업에서 반드시 다뤄주세요.</p>
        </div>
      </div>

      {/* 재설명 필요 개념 */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-brand/10 text-sm">📖</span>
          <p className="text-xs font-bold text-text">재설명 필요 개념</p>
        </div>
        <ul className="space-y-2">
          {reflection.reExplainTopics.map((t, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl border border-brand/15 bg-brand/5 px-4 py-2.5">
              <span className="mt-0.5 text-xs font-black text-brand">→</span>
              <span className="text-xs leading-5 text-text">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 보강 항목 */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-accent/10 text-sm">🔧</span>
          <p className="text-xs font-bold text-text">보강 항목</p>
        </div>
        <ul className="space-y-2">
          {reflection.reinforcementItems.map((r, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-soft/60 px-4 py-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-xs leading-5 text-text">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 개별 피드백 필요 학생 */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-warm/60 text-sm">👤</span>
          <p className="text-xs font-bold text-text">개별 피드백 필요 학생</p>
        </div>
        <div className="space-y-2">
          {reflection.individualFeedbackNeeded.map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-warm/40 bg-warm/20 px-4 py-2.5">
              <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#7a6200] shadow-sm">
                {s.studentName}
              </span>
              <span className="text-xs leading-5 text-text">{s.reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 질문 반영 항목 */}
      {reflection.questionReflectionItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-accent/10 text-sm">💬</span>
            <p className="text-xs font-bold text-text">질문 반영 필요 항목</p>
          </div>
          <ul className="space-y-2">
            {reflection.questionReflectionItems.map((q, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5">
                <span className="mt-0.5 text-xs font-bold text-accent">💬</span>
                <span className="text-xs leading-5 text-text">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 숙제 방향 */}
      <div className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">다음 숙제 방향</p>
        <p className="text-xs leading-5 text-text">{reflection.homeworkFollowUp}</p>
      </div>
    </div>
  );
}
