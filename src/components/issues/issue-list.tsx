"use client";

// 이슈함 — 메인 이슈 리스트
// 각 이슈 row 클릭 시 상세 패널 확장

import { useState } from "react";
import Link from "next/link";
import type { Issue } from "@/lib/mock-data/issue-mock-data";

// ── 스타일 맵 ────────────────────────────────────────────────

const urgencyStyle: Record<string, { badge: string; dot: string; border: string }> = {
  긴급: { badge: "bg-brand text-white",          dot: "bg-brand",       border: "border-l-brand"      },
  높음: { badge: "bg-accent/15 text-accent",     dot: "bg-accent",      border: "border-l-accent"     },
  중간: { badge: "bg-warm/60 text-[#7a6200]",    dot: "bg-yellow-400",  border: "border-l-yellow-400" },
  낮음: { badge: "bg-soft text-muted",           dot: "bg-border",      border: "border-l-border"     },
};

const typeIcon: Record<string, string> = {
  "미제출":          "⚠️",
  "시험 임박":       "📅",
  "진도 지연":       "📈",
  "계획 조정 필요":  "🗓️",
  "질문 있음":       "💬",
  "OCR 검토 필요":   "🔍",
  "OMR 오답 다수":   "📝",
  "공통 오답 반영":  "🔴",
  "집중 관리":       "👤",
};

const statusStyle: Record<string, string> = {
  "미확인":   "bg-brand/10 text-brand",
  "확인됨":   "bg-soft text-muted",
  "처리 완료": "bg-emerald-50 text-emerald-700",
};

// ── 이슈 상세 패널 ────────────────────────────────────────────

function IssueDetailPanel({ issue }: { issue: Issue }) {
  const d = issue.detail;

  if (d.kind === "unsubmitted") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">과제명</p>
          <p className="text-sm text-text">{d.assignmentTitle}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">마감일</p>
          <p className="text-sm text-text">{d.dueDate}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">누락 횟수</p>
          <p className="text-sm font-bold text-brand">{d.missedCount}회</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">다음 액션</p>
          <p className="text-sm text-text">{d.nextAction}</p>
        </div>
        {d.teacherMemo && (
          <div className="col-span-full rounded-xl bg-soft/60 px-4 py-2.5">
            <p className="text-[10px] font-bold text-muted mb-0.5">선생님 메모</p>
            <p className="text-xs text-text">{d.teacherMemo}</p>
          </div>
        )}
      </div>
    );
  }

  if (d.kind === "exam") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">시험일 / D-day</p>
          <p className="text-sm font-bold text-brand">{d.examDate} ({d.dDay})</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">현재 진도 상태</p>
          <p className="text-sm text-text">{d.progressStatus}</p>
        </div>
        <div className="flex gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${d.needsReinforcement ? "bg-brand/10 text-brand" : "bg-emerald-50 text-emerald-700"}`}>
            보강 {d.needsReinforcement ? "필요" : "불필요"}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${d.needsPlanAdjust ? "bg-warm/60 text-[#7a6200]" : "bg-emerald-50 text-emerald-700"}`}>
            계획 조정 {d.needsPlanAdjust ? "필요" : "불필요"}
          </span>
        </div>
        {d.note && (
          <div className="col-span-full rounded-xl bg-soft/60 px-4 py-2.5">
            <p className="text-xs text-text">{d.note}</p>
          </div>
        )}
      </div>
    );
  }

  if (d.kind === "progress") {
    return (
      <div className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">계획 단원</p>
            <p className="text-xs text-muted line-through">{d.plannedUnit}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">현재 단원</p>
            <p className="text-sm font-semibold text-text">{d.actualUnit}</p>
          </div>
        </div>
        <div className="rounded-xl border border-warm/40 bg-warm/20 px-4 py-2.5">
          <p className="text-[10px] font-bold text-[#7a6200] mb-0.5">조정 필요 사항</p>
          <p className="text-xs text-text">{d.adjustmentNeeded}</p>
        </div>
      </div>
    );
  }

  if (d.kind === "question") {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
          <p className="text-[10px] font-bold text-accent mb-1">학생 질문</p>
          <p className="text-sm text-text leading-relaxed">"{d.questionText}"</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">관련 단원</p>
            <p className="text-xs text-text">{d.relatedUnit}</p>
          </div>
          {d.assignmentTitle && (
            <div>
              <p className="text-[10px] font-bold text-muted mb-0.5">관련 과제</p>
              <p className="text-xs text-text">{d.assignmentTitle}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">수업 설명</p>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${d.needsInClassExplanation ? "bg-brand/10 text-brand" : "bg-emerald-50 text-emerald-700"}`}>
              {d.needsInClassExplanation ? "다음 수업 필수" : "선택 사항"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (d.kind === "ocr") {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">과제명</p>
            <p className="text-xs text-text">{d.assignmentTitle}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">제출 시간</p>
            <p className="text-xs text-text">{d.submittedAt}</p>
          </div>
        </div>
        <div className="rounded-xl bg-soft/60 px-4 py-2.5">
          <p className="text-[10px] font-bold text-muted mb-0.5">OCR 결과 요약</p>
          <p className="text-xs text-text">{d.ocrSummary}</p>
        </div>
        <div className="rounded-xl border border-brand/15 bg-brand/5 px-4 py-2.5">
          <p className="text-[10px] font-bold text-brand mb-0.5">검토 필요 이유</p>
          <p className="text-xs text-text">{d.reviewReason}</p>
        </div>
      </div>
    );
  }

  if (d.kind === "commonMistake") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">주요 오답 문항</p>
            <p className="text-sm font-bold text-brand">{d.topMistakeQuestion}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">오류 유형</p>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">{d.mistakeType}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted mb-1.5">재설명 필요 개념</p>
          <ul className="space-y-1">
            {d.conceptToReExplain.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text">
                <span className="mt-0.5 text-brand font-bold">→</span> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5">
          <p className="text-[10px] font-bold text-accent mb-0.5">오늘 수업 반영 추천</p>
          <p className="text-xs text-text">{d.todayLessonRecommendation}</p>
        </div>
      </div>
    );
  }

  if (d.kind === "focus") {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold text-muted mb-1.5">집중 관리 이유</p>
          <ul className="space-y-1">
            {d.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl bg-soft/60 px-3 py-2 text-xs text-text">
                <span className="mt-0.5 text-brand">·</span> {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-bold text-muted mb-0.5">최근 흐름</p>
            <p className="text-xs text-text">{d.recentTrend}</p>
          </div>
        </div>
        {d.teacherNote && (
          <div className="rounded-xl border border-border/50 bg-soft/40 px-4 py-2.5">
            <p className="text-[10px] font-bold text-muted mb-0.5">선생님 메모</p>
            <p className="text-xs text-text">{d.teacherNote}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────

type Props = {
  issues: Issue[];
};

export function IssueList({ issues }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (issues.length === 0) {
    return (
      <div className="rounded-[24px] border border-border/80 bg-white px-8 py-12 text-center shadow-soft">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm font-semibold text-muted">해당하는 이슈가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const ug      = urgencyStyle[issue.urgency];
        const isOpen  = expandedId === issue.id;

        return (
          <article
            key={issue.id}
            className={`overflow-hidden rounded-[24px] border border-border/80 bg-white shadow-soft border-l-4 ${ug.border}`}
          >
            {/* ── 이슈 행 ──────────────────────────────────── */}
            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : issue.id)}
              className="flex w-full flex-wrap items-start gap-4 px-5 py-4 text-left transition hover:bg-soft/40"
            >
              {/* 아이콘 + 유형 */}
              <div className="flex shrink-0 flex-col items-center gap-1.5 pt-0.5">
                <span className="text-xl">{typeIcon[issue.type] ?? "📌"}</span>
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ug.badge}`}>
                    {issue.urgency}
                  </span>
                  <span className="rounded-full bg-soft px-2.5 py-0.5 text-[10px] font-semibold text-muted">
                    {issue.type}
                  </span>
                  {issue.studentName && (
                    <span className="text-sm font-bold text-text">{issue.studentName}</span>
                  )}
                  <span className="text-xs text-muted">{issue.className}</span>
                  <span className="text-xs text-muted">{issue.subject}</span>
                  <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyle[issue.status]}`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-text">{issue.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted">{issue.description}</p>
                <p className="mt-1 text-[10px] text-muted/70">{issue.occurredAt} 발생</p>
              </div>

              {/* 화살표 */}
              <span
                className="mt-1 shrink-0 text-muted"
                style={{ display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >↓</span>
            </button>

            {/* ── 상세 패널 ─────────────────────────────────── */}
            {isOpen && (
              <div className="border-t border-border/50 bg-soft/30 px-5 py-4 space-y-4">
                {/* 상세 정보 */}
                <IssueDetailPanel issue={issue} />

                {/* 액션 버튼 */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                  {issue.actions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
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
            )}
          </article>
        );
      })}
    </div>
  );
}
