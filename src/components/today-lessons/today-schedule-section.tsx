// 오늘 수업 일정 섹션
// 오늘 진행되는 모든 수업을 시간순으로 정리해 한눈에 파악

import Link from "next/link";
import type { LessonStatus } from "@/lib/mock-data/today-lessons";
import { todaySchedule } from "@/lib/mock-data/today-lessons";

// 상태별 뱃지 — 타원 자체에 연한 채우기, 테두리 없음
const statusBadge: Record<LessonStatus, string> = {
  "시험 임박": "bg-brand/10 text-brand font-bold",
  "집중 관리": "bg-accent/10 text-accent font-semibold",
  "보강 필요": "bg-warm/70 text-[#7a6200] font-semibold",
  정상: "bg-emerald-50 text-emerald-700 font-semibold",
};

export function TodayScheduleSection() {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            오늘 수업 일정
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
            오늘 진행되는 수업 전체 현황
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-soft px-4 py-2 text-sm font-semibold text-text">
          <span className="text-base">📅</span>
          <span>총 {todaySchedule.length}건</span>
        </div>
      </div>

      {/* 일정 리스트 */}
      <div className="divide-y divide-border/50">
        {todaySchedule.map((item, idx) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            scroll={true}
            className="group flex flex-col gap-3 px-6 py-4 transition hover:bg-soft/60 sm:flex-row sm:items-center sm:gap-0"
          >
            {/* 순서 번호 + 시간 */}
            <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-soft text-xs font-bold text-muted">
                {idx + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-text">{item.time}</p>
                <p className="mt-0.5 text-xs text-muted">{item.lessonType}</p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="hidden h-10 w-px shrink-0 bg-border/60 sm:block" />

            {/* 학생명 + 학년/과목 */}
            <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 px-0 sm:px-5">
              <div className="min-w-[100px]">
                <p className="text-sm font-extrabold text-text">{item.studentName}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.grade} · {item.subject}
                </p>
              </div>

              {/* 오늘 목표 */}
              <div className="flex-1">
                <p className="text-xs font-medium text-muted">오늘 목표</p>
                <p className="mt-0.5 text-sm font-semibold text-text">{item.todayGoal}</p>
              </div>
            </div>

            {/* 우측: D-day + 상태 */}
            <div className="flex items-center gap-3 sm:shrink-0">
              {/* D-day 뱃지 */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  item.status === "시험 임박"
                    ? "bg-brand/10 text-brand"
                    : "bg-soft text-muted"
                }`}
              >
                <span className="text-[10px]">시험</span>
                <span
                  className={`font-extrabold ${item.status === "시험 임박" ? "text-brand" : "text-text"}`}
                >
                  {item.dDay}
                </span>
              </div>

              {/* 상태 뱃지 — 타원 채우기 */}
              <span className={`rounded-full px-3.5 py-1.5 text-xs ${statusBadge[item.status]}`}>
                {item.status}
              </span>

              {/* 준비 카드 이동 힌트 */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-xs text-muted shadow-sm transition group-hover:border-brand/30 group-hover:text-brand">
                ↓
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
