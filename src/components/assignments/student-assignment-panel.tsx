// 과제 관리 — 학생별 제출 상태 패널
// 반 카드 안에서 drill-down으로 표시

import type { StudentSubmission } from "@/lib/mock-data/assignment-mock-data";

const submitStatusStyle: Record<string, { bg: string; text: string }> = {
  완료:      { bg: "bg-emerald-50",  text: "text-emerald-700" },
  미완료:    { bg: "bg-brand/10",    text: "text-brand"       },
  "부분 완료": { bg: "bg-warm/50",   text: "text-[#7a6200]"   },
};

const typeStyle: Record<string, string> = {
  "사진 제출": "bg-accent/10 text-accent",
  "OMR 제출":  "bg-brand/10 text-brand",
};

type Props = {
  submissions: StudentSubmission[];
  expandedId: string | null;
  onToggle: (id: string) => void;
};

export function StudentAssignmentPanel({ submissions, expandedId, onToggle }: Props) {
  return (
    <div className="space-y-2">
      {submissions.map((s) => {
        const st      = submitStatusStyle[s.status] ?? submitStatusStyle["미완료"];
        const isOpen  = expandedId === s.id;
        const hasOmr  = s.omrResult && s.omrResult.length > 0;

        return (
          <div
            key={s.id}
            className="overflow-hidden rounded-2xl border border-border/60 bg-white"
          >
            {/* 행 헤더 */}
            <button
              type="button"
              onClick={() => onToggle(s.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-soft/60"
            >
              {/* 이름 */}
              <span className="w-16 shrink-0 text-sm font-bold text-text">{s.studentName}</span>

              {/* 상태 */}
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${st.bg} ${st.text}`}>
                {s.status}
              </span>

              {/* 제출 방식 */}
              {s.submissionType ? (
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${typeStyle[s.submissionType]}`}>
                  {s.submissionType}
                </span>
              ) : (
                <span className="shrink-0 text-[11px] text-muted">—</span>
              )}

              {/* OMR 점수 요약 */}
              {hasOmr && s.correctCount !== undefined && (
                <span className="text-[11px] font-semibold text-text">
                  {s.correctCount}/{s.totalQuestions}정답
                </span>
              )}

              {/* 질문 뱃지 */}
              {s.question && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                  💬 질문
                </span>
              )}

              {/* 반복 미제출 */}
              {s.isRepeatNonSubmit && (
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                  반복 미제출
                </span>
              )}

              {/* 검토 필요 */}
              {s.needsReview && (
                <span className="rounded-full bg-warm/50 px-2 py-0.5 text-[10px] font-semibold text-[#7a6200]">
                  검토 필요
                </span>
              )}

              {/* 제출 시간 */}
              {s.submittedAt && (
                <span className="ml-auto shrink-0 text-[11px] text-muted">{s.submittedAt}</span>
              )}

              {/* 토글 화살표 */}
              <span
                className="ml-auto shrink-0 text-muted transition-transform"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}
              >
                ↓
              </span>
            </button>

            {/* 상세 내용 */}
            {isOpen && (
              <div className="border-t border-border/50 px-4 py-4 space-y-4 bg-soft/30">

                {/* OCR 요약 */}
                {s.ocrSummary && (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand">
                      📷 사진 제출 OCR 결과 요약
                    </p>
                    <p className="rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5 text-xs leading-5 text-text">
                      {s.ocrSummary}
                    </p>
                  </div>
                )}

                {/* OMR 결과 */}
                {hasOmr && s.omrResult && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-brand">
                      📝 OMR 제출 결과
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.omrResult.map((item) => (
                        <div
                          key={item.questionNum}
                          className={`flex flex-col items-center rounded-xl px-2.5 py-2 text-center ${
                            item.correct
                              ? "bg-emerald-50 border border-emerald-100"
                              : "bg-brand/10 border border-brand/20"
                          }`}
                        >
                          <span className={`text-[10px] font-bold ${item.correct ? "text-emerald-600" : "text-brand"}`}>
                            {item.questionNum}번
                          </span>
                          <span className="text-[11px] font-semibold text-text">{item.studentAnswer}</span>
                          {!item.correct && (
                            <span className="text-[9px] text-muted">정답 {item.correctAnswer}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-muted">
                      정답률: {s.correctCount}/{s.totalQuestions} ({Math.round((s.correctCount! / s.totalQuestions!) * 100)}%)
                    </p>
                  </div>
                )}

                {/* 학생 질문 */}
                {s.question && (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                      💬 학생 질문
                    </p>
                    <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5">
                      <p className="text-xs leading-5 text-text">{s.question}</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
