"use client";

import { useEffect, useMemo, useState } from "react";
import { AssignmentSummaryCards } from "@/components/assignments/assignment-summary-cards";
import { AssignmentViewTabs } from "@/components/assignments/assignment-view-tabs";
import { AssignmentFilterBar } from "@/components/assignments/assignment-filter-bar";
import { ClassAssignmentBoard } from "@/components/assignments/class-assignment-board";
import { AssignmentInsightSection } from "@/components/assignments/assignment-insight-section";
import {
  getTeacherAssignmentBoardHeader,
  normalizeTeacherAssignmentsOverview,
  resolveTeacherAssignmentCardSelection,
} from "@/lib/services/teacher-assignments.service";
import type {
  TeacherAssignmentCardId,
  TeacherAssignmentViewTab,
} from "@/types/view/teacher";

type Props = {
  initialTab: TeacherAssignmentViewTab;
  data: unknown;
};

export function AssignmentsPageContent({ initialTab, data }: Props) {
  const overview = useMemo(() => normalizeTeacherAssignmentsOverview(data), [data]);

  const [activeTab, setActiveTab] = useState<TeacherAssignmentViewTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [submissionType, setSubmissionType] = useState("전체");
  const [hasQuestion, setHasQuestion] = useState<boolean | null>(null);
  const [activeCardId, setActiveCardId] = useState<TeacherAssignmentCardId | null>(null);

  function handleCardClick(cardId: TeacherAssignmentCardId) {
    const next = resolveTeacherAssignmentCardSelection(
      {
        activeCardId,
        activeTab,
        status,
        hasQuestion,
      },
      cardId,
    );

    setActiveCardId(next.activeCardId);
    setActiveTab(next.activeTab);
    setStatus(next.status);
    setHasQuestion(next.hasQuestion);
  }

  const boardHeader = getTeacherAssignmentBoardHeader(activeTab);

  return (
    <div className="space-y-6">
      <header className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              과제 운영 · 분석 · 반영
            </p>
            <h1 className="mt-1.5 text-[1.5rem] font-extrabold tracking-tight text-text sm:text-[1.8rem]">
              과제 관리
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              반별 과제 운영, 제출 상태 확인, 학생별 제출 방식과 질문, 공통 오답 및 다음 수업 반영 포인트를 한눈에 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
            <button
              type="button"
              className="rounded-full border border-brand bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              + 과제 등록
            </button>
          </div>
        </div>
      </header>

      <AssignmentSummaryCards
        summary={overview.summary}
        activeCardId={activeCardId}
        onCardClick={handleCardClick}
      />

      <div className="space-y-3">
        <AssignmentViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <AssignmentFilterBar
          search={search}
          onSearchChange={setSearch}
          subject={subject}
          onSubjectChange={setSubject}
          status={status}
          onStatusChange={setStatus}
          submissionType={submissionType}
          onSubmissionTypeChange={setSubmissionType}
          hasQuestion={hasQuestion}
          onHasQuestionChange={setHasQuestion}
        />
      </div>

      <section>
        <div className="mb-4 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{boardHeader.label}</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">{boardHeader.title}</h2>
          <p className="mt-1 text-sm text-muted">
            카드를 펼치면 학생별 제출 상태, 공통 오답 분석, 다음 수업 반영 포인트를 순서대로 확인할 수 있습니다.
          </p>
        </div>

        <ClassAssignmentBoard
          activeView={activeTab}
          classAssignments={overview.classAssignments}
          studentSubmissions={overview.studentSubmissions}
          commonMistakeAnalyses={overview.commonMistakeAnalyses}
          lessonReflections={overview.lessonReflections}
          filterSubject={subject}
          filterStatus={status}
          filterType={submissionType}
          filterSearch={search}
          filterHasQuestion={hasQuestion}
        />
      </section>

      <AssignmentInsightSection insights={overview.assignmentInsights} />
    </div>
  );
}
