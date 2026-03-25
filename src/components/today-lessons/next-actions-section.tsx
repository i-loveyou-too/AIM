"use client";

// 다음 액션 섹션 — 수업별로 분리된 탭
// 학생/반 탭을 선택하면 해당 수업의 4단계 액션 플랜만 표시

import { useState } from "react";
import { lessonNextActions, todaySchedule } from "@/lib/mock-data/today-lessons";

type Phase = {
  key: keyof Omit<(typeof lessonNextActions)[0], "lessonId" | "studentName">;
  label: string;
  icon: string;
  color: string;
};

const phases: Phase[] = [
  { key: "beforeClass",    label: "수업 전 준비", icon: "📋", color: "brand"  },
  { key: "duringClass",    label: "수업 중 강조", icon: "🎯", color: "accent" },
  { key: "afterClass",     label: "수업 후 기록", icon: "✏️", color: "warm"   },
  { key: "nextLessonPrep", label: "다음 수업 준비", icon: "→", color: "soft"  },
];

const phaseStyles: Record<string, { header: string; icon: string; bullet: string }> = {
  brand:  { header: "text-brand",     icon: "bg-brand/10 text-brand",     bullet: "text-brand"     },
  accent: { header: "text-accent",    icon: "bg-accent/10 text-accent",   bullet: "text-accent"    },
  warm:   { header: "text-[#8a6200]", icon: "bg-warm/60 text-[#8a6200]",  bullet: "text-[#8a6200]" },
  soft:   { header: "text-muted",     icon: "bg-soft text-muted",         bullet: "text-muted"     },
};

const bulletChar: Record<string, string> = {
  beforeClass:    "·",
  duringClass:    "·",
  afterClass:     "✓",
  nextLessonPrep: "→",
};

// 오늘 일정 순서에 맞춰 탭 목록 생성 (데이터 없는 lesson은 제외)
const tabList = todaySchedule.filter((s) =>
  lessonNextActions.some((a) => a.lessonId === s.id)
);

export function NextActionsSection() {
  const [activeId, setActiveId] = useState(tabList[0]?.id ?? "lesson-1");

  const current = lessonNextActions.find((a) => a.lessonId === activeId);
  const scheduleItem = todaySchedule.find((s) => s.id === activeId);

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      {/* ── 섹션 헤더 ────────────────────────────────────── */}
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          다음 액션
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          수업별 단계별 액션 플랜
        </h2>
        <p className="mt-1 text-sm text-muted">
          학생을 선택하면 해당 수업의 수업 전·중·후 액션을 확인할 수 있습니다.
        </p>
      </div>

      {/* ── 수업별 탭 ────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto border-b border-border/60 px-6 py-3">
        {tabList.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand text-white shadow-soft"
                  : "border border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
              }`}
            >
              <span>{s.studentName}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-white text-muted"
                }`}
              >
                {s.time.split("–")[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 선택된 수업 서브 헤더 ────────────────────────── */}
      {scheduleItem && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 bg-soft/50 px-6 py-3">
          <span className="text-sm font-extrabold text-text">{scheduleItem.studentName}</span>
          <span className="text-xs text-muted">{scheduleItem.grade} · {scheduleItem.subject}</span>
          <span className="text-xs text-muted">🕐 {scheduleItem.time}</span>
          <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-bold text-muted">
            시험 {scheduleItem.dDay}
          </span>
          <span className="ml-auto text-xs text-muted">
            오늘 목표: <span className="font-semibold text-text">{scheduleItem.todayGoal}</span>
          </span>
        </div>
      )}

      {/* ── 4단계 액션 그리드 ────────────────────────────── */}
      {current && (
        <div className="grid gap-0 divide-y divide-border/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {phases.map((phase, idx) => {
            const styles = phaseStyles[phase.color];
            const items = current[phase.key] as string[];
            return (
              <div key={phase.key} className="px-5 py-6">
                {/* 단계 헤더 */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${styles.icon}`}
                  >
                    {phase.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted">STEP {idx + 1}</p>
                    <p className={`text-sm font-extrabold ${styles.header}`}>{phase.label}</p>
                  </div>
                </div>

                {/* 액션 리스트 */}
                {items.length > 0 ? (
                  <ul className="space-y-2.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-1 shrink-0 text-[10px] font-black ${styles.bullet}`}>
                          {bulletChar[phase.key]}
                        </span>
                        <p className="text-xs leading-5 text-text">{item}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted">해당 항목 없음</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 하단 흐름 바 ─────────────────────────────────── */}
      <div className="border-t border-border/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <p className="shrink-0 text-[11px] font-semibold text-muted">수업 흐름</p>
          <div className="flex flex-1 items-center gap-1">
            {["수업 전 준비", "수업 진행", "수업 후 기록", "다음 수업 반영"].map((step, i, arr) => (
              <div key={step} className="flex flex-1 items-center gap-1">
                <div
                  className={`flex-1 rounded-full px-2 py-1.5 text-center text-[10px] font-bold ${
                    i === 0 ? "bg-brand text-white"
                    : i === 1 ? "bg-accent/15 text-accent"
                    : i === 2 ? "bg-warm/60 text-[#7a6200]"
                    : "bg-soft text-muted"
                  }`}
                >
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <span className="text-xs text-muted/40">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
