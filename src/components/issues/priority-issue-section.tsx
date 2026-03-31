// 이슈함 — 오늘 우선순위 섹션
// 선생님이 첫눈에 가장 먼저 처리해야 할 이슈 강조 표시

import Link from "next/link";
import type { Issue } from "@/types/issues";

const urgencyDot: Record<string, string> = {
  긴급: "bg-brand",
  높음: "bg-accent",
  중간: "bg-warm",
  낮음: "bg-soft border border-border",
};

const typeBadge: Record<string, string> = {
  "미제출":       "bg-brand/10 text-brand",
  "시험 임박":    "bg-warm/60 text-[#7a6200]",
  "공통 오답 반영": "bg-accent/10 text-accent",
  "OCR 검토 필요": "bg-brand/10 text-brand",
  "질문 있음":    "bg-accent/10 text-accent",
  "OMR 오답 다수": "bg-brand/10 text-brand",
  "집중 관리":    "bg-soft text-muted",
  "진도 지연":    "bg-warm/60 text-[#7a6200]",
  "계획 조정 필요": "bg-soft text-muted",
};

export function PriorityIssueSection({ issues = [] }: { issues?: Issue[] }) {
  const urgent = issues.filter((i) => i.urgency === "긴급" && i.status !== "처리 완료");

  return (
    <section className="rounded-[28px] border border-brand/25 bg-brand/5 shadow-soft">
      <div className="border-b border-brand/15 px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">오늘 바로 확인할 이슈</p>
        </div>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          긴급 이슈 {urgent.length}건 — 수업 전 확인 필요
        </h2>
        <p className="mt-1 text-sm text-muted">
          시험 임박, 공통 오답 미반영, 반복 미제출, OCR 검토 미완료 항목입니다.
        </p>
      </div>

      <div className="divide-y divide-brand/10 px-0">
        {urgent.map((issue) => (
          <div key={issue.id} className="flex flex-wrap items-start gap-4 px-6 py-4">
            {/* 긴급도 도트 */}
            <div className="mt-1 flex shrink-0 flex-col items-center gap-1">
              <span className={`h-3 w-3 rounded-full ${urgencyDot[issue.urgency]}`} />
            </div>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${typeBadge[issue.type] ?? "bg-soft text-muted"}`}>
                  {issue.type}
                </span>
                {issue.studentName && (
                  <span className="text-sm font-bold text-text">{issue.studentName}</span>
                )}
                <span className="text-xs text-muted">{issue.className} · {issue.subject}</span>
              </div>
              <p className="text-sm font-semibold text-text">{issue.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-muted">{issue.description}</p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex shrink-0 flex-wrap gap-1.5 self-center">
              {issue.actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    action.style === "primary"
                      ? "bg-brand text-white hover:bg-brand/90"
                      : "border border-border bg-white text-text hover:border-brand/30 hover:text-brand"
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
