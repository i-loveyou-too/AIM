"use client";

import { useState } from "react";
import type { StudentDetailData } from "@/types/student-detail";

const actionToneStyles = {
  rose: "bg-brand/10 text-brand",
  gold: "bg-warm/70 text-text",
  peach: "bg-accent/10 text-accent",
  soft: "bg-soft text-brand",
};

export function StudentProgressSection({ detail }: { detail: StudentDetailData }) {
  const [expandedTodo, setExpandedTodo] = useState(false);
  const visibleActions = expandedTodo ? detail.nextActions : detail.nextActions.slice(0, 2);

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">최근 진도 / 학습 흐름</p>
            <h2 className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
              현재 {detail.student.subject} 흐름을 한눈에 확인합니다
            </h2>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {detail.progress.delayStatus}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-[24px] border border-border bg-soft p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">최근 완료한 학습 내용</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.progress.completedUnits.map((unit) => (
                <span key={unit} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-text shadow-sm">
                  {unit}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">현재 진행 중인 단원</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                {detail.progress.recentUnit}
              </span>
              <span className="rounded-full bg-soft px-3 py-1 text-sm font-semibold text-text">
                {detail.progress.currentUnit}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{detail.progress.progressNote}</p>
          </div>

          <div className="rounded-[24px] border border-border bg-white p-4">
            <div className="flex items-end justify-between gap-4">
              <p className="text-sm font-semibold text-text">최근 성취도 흐름</p>
              <p className="text-sm font-semibold text-brand">{detail.progress.progressRate}%</p>
            </div>
            <div className="mt-4 flex items-end gap-2">
              {detail.progress.progressBars.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={`w-10 rounded-t-2xl ${index === detail.progress.progressBars.length - 1 ? "bg-brand" : "bg-soft"}`}
                  style={{ height }}
                />
              ))}
            </div>
          </div>

          {/* 해야 할 일은 가장 급한 2개만 먼저 보여주고, 화살표로 전체 순서를 펼쳐봅니다. */}
          <div className="rounded-[24px] border border-border bg-soft p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-muted">지금 해야 할 일</p>
                <h3 className="mt-2 text-[1.05rem] font-extrabold tracking-tight text-text">
                  제일 먼저 처리할 항목부터 순서대로 확인합니다
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExpandedTodo((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-brand shadow-sm transition hover:border-brand/30 hover:text-[#ea3d4d]"
              >
                {expandedTodo ? "접기" : "더보기"}
                <span className={`transition-transform duration-200 ${expandedTodo ? "rotate-180" : ""}`} aria-hidden="true">
                  ▾
                </span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {visibleActions.map((action, index) => {
                return (
                  <div
                    key={action.label}
                    className={`rounded-[20px] border p-4 shadow-sm transition ${index === 0 ? "border-brand/20 bg-white" : "border-border bg-white/70"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-extrabold text-brand">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold tracking-tight text-text">{action.label}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{action.description}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${actionToneStyles[action.tone]}`}>
                        {action.tone === "rose"
                          ? "우선"
                          : action.tone === "gold"
                            ? "점검"
                            : action.tone === "peach"
                              ? "조정"
                              : "유지"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {!expandedTodo ? (
              <p className="mt-3 text-xs font-medium text-muted">화살표를 누르면 전체 순서를 더 자세히 볼 수 있습니다.</p>
            ) : null}
          </div>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-soft p-5 shadow-none">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand">진도 체크</p>
        <h3 className="mt-2 text-[1.05rem] font-extrabold tracking-tight text-text sm:text-[1.2rem]">
          진도 지연 여부와 현재 위치
        </h3>

        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">역산 계획상 위치</p>
            <p className="mt-2 text-[1.3rem] font-extrabold tracking-tight text-text">
              {detail.progress.currentUnit}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">{detail.progress.delayStatus}</p>
          </div>

          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">현재 진도율</p>
            <div className="mt-3 h-3 rounded-full bg-soft">
              <div
                className="h-3 rounded-full bg-brand transition-[width] duration-300"
                style={{ width: `${detail.progress.progressRate}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-muted">
              완료 흐름은 좋고, 남은 단원은 시험 전 점검으로 정리하면 됩니다.
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">정리 메모</p>
            <p className="mt-2 text-sm leading-6 text-muted">{detail.progress.progressNote}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
