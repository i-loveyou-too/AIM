"use client";

// 과제 관리 페이지
// 반별 과제 운영 → 학생별 제출 확인 → 오답 분석 → 다음 수업 반영 흐름

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ViewTab } from "@/lib/mock-data/assignment-mock-data";
import { AssignmentSummaryCards } from "@/components/assignments/assignment-summary-cards";
import { AssignmentViewTabs } from "@/components/assignments/assignment-view-tabs";
import { AssignmentFilterBar } from "@/components/assignments/assignment-filter-bar";
import { ClassAssignmentBoard } from "@/components/assignments/class-assignment-board";
import { AssignmentInsightSection } from "@/components/assignments/assignment-insight-section";

type CardId = "active" | "dueToday" | "unsubmitted" | "questions" | "avgRate" | "reinforcement";

const VALID_TABS: ViewTab[] = ["class", "student", "unsubmitted", "dueToday"];

function AssignmentsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ViewTab | null;
  const [activeTab, setActiveTab] = useState<ViewTab>("class");

  // URL ?tab= 변경 시 보기 탭 동기화
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
      return;
    }
    setActiveTab("class");
  }, [tabParam]);

  // 필터 상태
  const [search,         setSearch]         = useState("");
  const [subject,        setSubject]        = useState("전체");
  const [status,         setStatus]         = useState("전체");
  const [submissionType, setSubmissionType] = useState("전체");
  const [hasQuestion,    setHasQuestion]    = useState<boolean | null>(null);

  // 요약 카드 활성 상태
  const [activeCardId, setActiveCardId] = useState<CardId | null>(null);

  function handleCardClick(cardId: CardId) {
    // 이미 선택된 카드면 필터 해제
    if (activeCardId === cardId) {
      setActiveCardId(null);
      setActiveTab("class");
      setStatus("전체");
      setHasQuestion(null);
      return;
    }

    setActiveCardId(cardId);

    // 카드별 필터 적용
    switch (cardId) {
      case "active":
        setActiveTab("class");
        setStatus("전체");
        setHasQuestion(null);
        break;
      case "dueToday":
        setActiveTab("dueToday");
        setStatus("전체");
        setHasQuestion(null);
        break;
      case "unsubmitted":
        setActiveTab("unsubmitted");
        setStatus("전체");
        setHasQuestion(null);
        break;
      case "questions":
        setActiveTab("class");
        setHasQuestion(true);
        setStatus("전체");
        break;
      case "reinforcement":
        setActiveTab("class");
        setStatus("보강 필요");
        setHasQuestion(null);
        break;
    }
  }

  return (
    <div className="space-y-6">

      {/* ── 페이지 헤더 ──────────────────────────────────────── */}
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

      {/* ── 상단 KPI 요약 카드 ───────────────────────────────── */}
      <AssignmentSummaryCards
        activeCardId={activeCardId}
        onCardClick={handleCardClick}
      />

      {/* ── 보기 탭 + 필터 바 ────────────────────────────────── */}
      <div className="space-y-3">
        <AssignmentViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <AssignmentFilterBar
          search={search}             onSearchChange={setSearch}
          subject={subject}           onSubjectChange={setSubject}
          status={status}             onStatusChange={setStatus}
          submissionType={submissionType} onSubmissionTypeChange={setSubmissionType}
          hasQuestion={hasQuestion}   onHasQuestionChange={setHasQuestion}
        />
      </div>

      {/* ── 메인 영역: 반별 과제 보드 ────────────────────────── */}
      <section>
        <div className="mb-4 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {activeTab === "class"       ? "반별 보기"
            : activeTab === "student"    ? "학생별 보기"
            : activeTab === "unsubmitted" ? "미제출 현황"
            : "마감 임박 과제"}
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
            {activeTab === "class"        ? "반/수업 단위 과제 현황"
            : activeTab === "student"     ? "학생별 제출 상태"
            : activeTab === "unsubmitted" ? "미제출 학생이 있는 과제"
            : "오늘 및 마감 임박 과제"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            카드를 펼치면 학생별 제출 상태, 공통 오답 분석, 다음 수업 반영 포인트를 순서대로 확인할 수 있습니다.
          </p>
        </div>

        <ClassAssignmentBoard
          activeView={activeTab}
          filterSubject={subject}
          filterStatus={status}
          filterType={submissionType}
          filterSearch={search}
          filterHasQuestion={hasQuestion}
        />
      </section>

      {/* ── 운영 인사이트 ─────────────────────────────────────── */}
      <AssignmentInsightSection />

    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<div className="h-20 rounded-[28px] border border-border/80 bg-white/70" />}>
      <AssignmentsPageContent />
    </Suspense>
  );
}
