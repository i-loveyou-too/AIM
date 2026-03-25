"use client";

// 커리큘럼 페이지 콘텐츠 — 학년/반 2단계 선택 + 데이터 전달
import { useState, useRef, useEffect } from "react";
import { curriculumClasses } from "@/lib/curriculum-mock-data";
import { CurriculumExamCalendar } from "@/components/curriculum/curriculum-exam-calendar";
import { CurriculumNextActions } from "@/components/curriculum/curriculum-next-actions";
import { CurriculumPageHeader } from "@/components/curriculum/curriculum-page-header";
import { CurriculumPlanVsActualSection } from "@/components/curriculum/curriculum-plan-vs-actual-section";
import { CurriculumPlanningNotesSection } from "@/components/curriculum/curriculum-planning-notes-section";
import { CurriculumRoadmapBoard } from "@/components/curriculum/curriculum-roadmap-board";
import { CurriculumRiskSection } from "@/components/curriculum/curriculum-risk-section";
import { CurriculumReversePlanSection } from "@/components/curriculum/curriculum-reverse-plan-section";
import { CurriculumSummaryCards } from "@/components/curriculum/curriculum-summary-cards";

// 고유 학년 목록
const grades = [...new Set(curriculumClasses.map((c) => c.grade))];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 드롭다운 컴포넌트
function Dropdown({
  label,
  sublabel,
  open,
  onToggle,
  children,
}: {
  label: string;
  sublabel: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
          open
            ? "border-brand bg-brand text-white shadow-soft"
            : "border-border bg-white text-text hover:border-brand/40 hover:bg-soft"
        }`}
      >
        <span className={`text-[10px] font-bold ${open ? "text-white/70" : "text-muted"}`}>
          {sublabel}
        </span>
        {label}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[140px] rounded-2xl border border-border/80 bg-white p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {children}
        </div>
      )}
    </div>
  );
}

export function CurriculumContent() {
  const [selectedId, setSelectedId] = useState(curriculumClasses[0].id);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);

  const selected = curriculumClasses.find((c) => c.id === selectedId)!;
  const classesForGrade = curriculumClasses.filter((c) => c.grade === selected.grade);
  const data = selected.data;

  function selectGrade(grade: string) {
    const first = curriculumClasses.find((c) => c.grade === grade)!;
    setSelectedId(first.id);
    setGradeOpen(false);
  }

  function selectClass(id: string) {
    setSelectedId(id);
    setClassOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* 클래스 선택 바 */}
      <div className="rounded-[24px] border border-border/80 bg-white px-5 py-4 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              클래스 선택
            </p>
            <p className="mt-0.5 text-sm text-muted">
              현재 &nbsp;
              <span className="font-bold text-text">{selected.grade} · {selected.label}</span>
              &nbsp; 커리큘럼
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* 1단계: 학년 선택 */}
            <Dropdown
              label={selected.grade}
              sublabel="학년"
              open={gradeOpen}
              onToggle={() => { setGradeOpen((v) => !v); setClassOpen(false); }}
            >
              {grades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => selectGrade(grade)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    grade === selected.grade
                      ? "bg-brand text-white font-bold"
                      : "text-text hover:bg-soft font-medium"
                  }`}
                >
                  {grade}
                  {grade === selected.grade && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </Dropdown>

            {/* 구분 화살표 */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-muted/50">
              <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* 2단계: 반 선택 */}
            <Dropdown
              label={selected.label}
              sublabel={selected.subject}
              open={classOpen}
              onToggle={() => { setClassOpen((v) => !v); setGradeOpen(false); }}
            >
              {classesForGrade.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => selectClass(cls.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    cls.id === selectedId
                      ? "bg-brand text-white font-bold"
                      : "text-text hover:bg-soft font-medium"
                  }`}
                >
                  <span className={`text-[10px] ${cls.id === selectedId ? "text-white/70" : "text-muted"}`}>
                    {cls.subject}
                  </span>
                  {cls.label}
                  {cls.id === selectedId && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>

      {/* 페이지 헤더 */}
      <CurriculumPageHeader overview={data.overview} />

      {/* 요약 카드 */}
      <CurriculumSummaryCards cards={data.summaryCards} />

      {/* 역산 계획 + 캘린더 */}
      <div id="reverse-plan" className="grid gap-6 xl:grid-cols-2">
        <CurriculumReversePlanSection reversePlan={data.reversePlan} />
        <CurriculumExamCalendar calendar={data.calendar} />
      </div>

      {/* 계획 vs 실제 */}
      <div id="plan-vs-actual">
        <CurriculumPlanVsActualSection comparison={data.comparison} />
      </div>

      {/* 로드맵 */}
      <div id="roadmap">
        <CurriculumRoadmapBoard roadmap={data.roadmap} />
      </div>

      {/* 다음 수업 액션 */}
      <CurriculumNextActions nextActions={data.nextActions} />

      {/* 위험 신호 */}
      <div id="risk">
        <CurriculumRiskSection risks={data.risks} />
      </div>

      {/* 운영 메모 */}
      <CurriculumPlanningNotesSection notes={data.notes} />
    </div>
  );
}
