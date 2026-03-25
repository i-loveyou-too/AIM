"use client";

// 과제 관리 — 반별 과제 보드
// 각 반 카드 → 학생별 drill-down → 공통 오답 분석 → 다음 수업 반영 순으로 펼쳐짐

import { useState } from "react";
import type {
  ClassAssignment,
  ViewTab,
} from "@/lib/mock-data/assignment-mock-data";
import {
  classAssignments,
  studentSubmissions,
  commonMistakeAnalyses,
  lessonReflections,
} from "@/lib/mock-data/assignment-mock-data";
import { StudentAssignmentPanel } from "./student-assignment-panel";
import { CommonMistakeAnalysisSection } from "./common-mistake-analysis";
import { LessonReflectionSection } from "./lesson-reflection-section";

// 뷰탭 타입은 mock-data에서 직접 가져오지 않고 여기서 재선언
type LocalViewTab = ViewTab;

const statusBadge: Record<string, string> = {
  "진행 중":   "bg-emerald-50 text-emerald-700",
  "마감 임박": "bg-warm/60 text-[#7a6200]",
  "보강 필요": "bg-brand/10 text-brand",
  "검토 완료": "bg-soft text-muted",
};

type CardTab = "students" | "analysis" | "reflection";

type Props = {
  activeView: LocalViewTab;
  filterSubject: string;
  filterStatus: string;
  filterType: string;
  filterSearch: string;
  filterHasQuestion: boolean | null;
};

export function ClassAssignmentBoard({
  activeView,
  filterSubject,
  filterStatus,
  filterType,
  filterSearch,
  filterHasQuestion,
}: Props) {
  // 열린 반 카드 ID
  const [expandedClassId, setExpandedClassId] = useState<string | null>("ca-1");
  // 반 카드 내부 탭
  const [cardTab, setCardTab] = useState<Record<string, CardTab>>({});
  // 학생 상세 펼침 ID
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const toggleClass = (id: string) =>
    setExpandedClassId((prev) => (prev === id ? null : id));

  const getCardTab = (id: string): CardTab =>
    cardTab[id] ?? "students";

  const setCardTabFor = (classId: string, tab: CardTab) =>
    setCardTab((prev) => ({ ...prev, [classId]: tab }));

  // 필터링
  let filtered: ClassAssignment[] = classAssignments;

  if (activeView === "unsubmitted") {
    filtered = filtered.filter((c) => {
      const subs = studentSubmissions.filter((s) => s.classId === c.id);
      return subs.some((s) => s.status === "미완료");
    });
  } else if (activeView === "dueToday") {
    filtered = filtered.filter((c) =>
      c.status === "마감 임박" || c.dueDate === "3/24" || c.dueDate === "3/25"
    );
  }

  if (filterSubject !== "전체")
    filtered = filtered.filter((c) => c.subject === filterSubject);
  if (filterStatus !== "전체")
    filtered = filtered.filter((c) => c.status === filterStatus);

  return (
    <div className="space-y-4">
      {filtered.length === 0 && (
        <div className="rounded-[24px] border border-border/80 bg-white px-8 py-12 text-center shadow-soft">
          <p className="text-sm font-semibold text-muted">해당하는 과제가 없습니다.</p>
        </div>
      )}

      {filtered.map((cls) => {
        const isOpen   = expandedClassId === cls.id;
        const sb       = statusBadge[cls.status] ?? "bg-soft text-muted";
        const subRate  = Math.round((cls.submittedCount / cls.studentCount) * 100);
        const analysis = commonMistakeAnalyses.find((a) => a.classId === cls.id);
        const reflect  = lessonReflections.find((r) => r.classId === cls.id);

        // 이 반의 학생 목록 (필터 적용)
        let classSubs = studentSubmissions.filter((s) => s.classId === cls.id);
        if (filterType !== "전체")
          classSubs = classSubs.filter((s) => s.submissionType === filterType);
        if (filterSearch)
          classSubs = classSubs.filter((s) =>
            s.studentName.includes(filterSearch)
          );
        if (filterHasQuestion === true)
          classSubs = classSubs.filter((s) => !!s.question);
        else if (filterHasQuestion === false)
          classSubs = classSubs.filter((s) => !s.question);

        const currentTab = getCardTab(cls.id);

        return (
          <article
            key={cls.id}
            className="overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-soft"
          >
            {/* ── 반 카드 헤더 ─────────────────────────────── */}
            <div
              className={`px-6 py-5 ${isOpen ? "border-b border-border/60" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">

                {/* 좌측: 반 정보 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-xl">
                    📋
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-extrabold tracking-tight text-text">
                        {cls.className}
                      </h3>
                      <span className="text-sm font-medium text-muted">{cls.subject} · {cls.studentCount}명</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${sb}`}>
                        {cls.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-text">
                      {cls.assignmentTitle}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                      <span>배포 {cls.issuedDate}</span>
                      <span className="text-muted/40">·</span>
                      <span className={cls.status === "마감 임박" ? "font-bold text-[#7a6200]" : ""}>
                        마감 {cls.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 우측: 지표 + 토글 */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* 제출률 */}
                  <div className="flex flex-col items-center rounded-2xl bg-soft px-3.5 py-2 text-center">
                    <span className="text-xs font-extrabold text-text">{subRate}%</span>
                    <span className="text-[10px] text-muted">제출률</span>
                  </div>
                  {/* 미제출 */}
                  <div className={`flex flex-col items-center rounded-2xl px-3.5 py-2 text-center ${
                    cls.studentCount - cls.submittedCount > 0 ? "bg-brand/10" : "bg-soft"
                  }`}>
                    <span className={`text-xs font-extrabold ${cls.studentCount - cls.submittedCount > 0 ? "text-brand" : "text-text"}`}>
                      {cls.studentCount - cls.submittedCount}명
                    </span>
                    <span className="text-[10px] text-muted">미제출</span>
                  </div>
                  {/* 사진/OMR */}
                  <div className="flex items-center gap-2 rounded-2xl bg-soft px-3 py-2">
                    <span className="text-[11px] font-semibold text-muted">📷 {cls.photoSubmissions}</span>
                    <span className="text-muted/30">|</span>
                    <span className="text-[11px] font-semibold text-muted">📝 {cls.omrSubmissions}</span>
                  </div>
                  {/* 질문 */}
                  {cls.questionsCount > 0 && (
                    <div className="flex flex-col items-center rounded-2xl bg-accent/10 px-3.5 py-2 text-center">
                      <span className="text-xs font-extrabold text-accent">{cls.questionsCount}건</span>
                      <span className="text-[10px] text-accent">질문</span>
                    </div>
                  )}
                  {/* 토글 */}
                  <button
                    type="button"
                    onClick={() => toggleClass(cls.id)}
                    className="ml-1 flex items-center gap-1.5 rounded-full border border-border bg-soft px-4 py-2 text-xs font-semibold text-text transition hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                  >
                    <span>{isOpen ? "접기" : "상세 보기"}</span>
                    <span style={{ display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>↓</span>
                  </button>
                </div>
              </div>

              {/* 주요 오답 포인트 요약 (헤더에 항상 표시) */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-muted">주요 오답:</span>
                <span className="rounded-full bg-brand/10 px-3 py-0.5 text-[11px] font-semibold text-brand">
                  {cls.topMistakeTopic}
                </span>
                {cls.repeatUnsubmitCount > 0 && (
                  <span className="rounded-full bg-warm/50 px-3 py-0.5 text-[11px] font-semibold text-[#7a6200]">
                    반복 미제출 {cls.repeatUnsubmitCount}명
                  </span>
                )}
              </div>
            </div>

            {/* ── 상세 내용 ─────────────────────────────────── */}
            {isOpen && (
              <>
                {/* 내부 탭 */}
                <div className="flex gap-1.5 border-b border-border/60 px-6 py-3">
                  {([
                    { id: "students"   as CardTab, label: "학생별 제출 현황", icon: "👤" },
                    { id: "analysis"   as CardTab, label: "공통 오답 분석",   icon: "📊" },
                    { id: "reflection" as CardTab, label: "다음 수업 반영",   icon: "🎯" },
                  ]).map((tab) => {
                    const isActive = currentTab === tab.id;
                    const hasData =
                      (tab.id === "analysis"   && !!analysis)   ||
                      (tab.id === "reflection" && !!reflect)     ||
                      tab.id === "students";
                    if (!hasData) return null;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCardTabFor(cls.id, tab.id)}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                          isActive
                            ? "bg-brand text-white shadow-soft"
                            : "border border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 탭 내용 */}
                <div className="px-6 py-5">
                  {currentTab === "students" && (
                    <StudentAssignmentPanel
                      submissions={classSubs}
                      expandedId={expandedStudentId}
                      onToggle={(id) =>
                        setExpandedStudentId((prev) => (prev === id ? null : id))
                      }
                    />
                  )}
                  {currentTab === "analysis" && analysis && (
                    <CommonMistakeAnalysisSection
                      analysis={analysis}
                      totalStudents={cls.submittedCount}
                    />
                  )}
                  {currentTab === "reflection" && reflect && (
                    <LessonReflectionSection reflection={reflect} />
                  )}
                  {currentTab === "analysis" && !analysis && (
                    <p className="text-sm text-muted">분석 데이터가 없습니다.</p>
                  )}
                  {currentTab === "reflection" && !reflect && (
                    <p className="text-sm text-muted">반영 데이터가 없습니다.</p>
                  )}
                </div>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
