"use client";

// 수업별 준비 카드
// 헤더는 항상 보이고, 버튼 클릭으로 상세 내용을 열고 닫을 수 있음

import { useState } from "react";

type LessonStatus = "집중 관리" | "정상" | "보강 필요" | "시험 임박";
type HomeworkStatus = "완료" | "미완료" | "부분 완료";
type AchievementLevel = "우수" | "보통" | "미흡";
type LessonPrep = {
  id: string;
  studentName: string;
  grade: string;
  subject: string;
  time: string;
  dDay: string;
  status: LessonStatus;
  recentAchievement: AchievementLevel;
  progress: {
    todayUnit: string;
    completedRange: string;
    targetRange: string;
    curriculumPosition: string;
    isDelayed: boolean;
    planComparison?: string;
    delayNote?: string;
  };
  explanation: {
    conceptType: string;
    keyConcepts: string[];
    confusionPoints: string[];
    misconceptions: string[];
  };
  materials: {
    priorityTag: string;
    mainTextbook: string;
    workbooks: string[];
    printouts: string[];
  };
  weaknesses: {
    weakUnits: string[];
    repeatMistakes: string[];
    todayFocusCheck: string[];
    attentionPoints: string[];
  };
  homework: {
    status: HomeworkStatus;
    completionRate: number;
    warning?: string;
    errorTendencies: string[];
    homeworkBasedExplanation: string[];
  };
  lessonMemo: {
    preClassCheck: string[];
    questionPrompts: string[];
    nextLessonConnection: string;
  };
};
type LessonNextAction = {
  lessonId: string;
  beforeClass: string[];
  duringClass: string[];
  afterClass: string[];
  nextLessonPrep: string[];
};

// ── 스타일 맵 ─────────────────────────────────────────────────

const statusStyles: Record<LessonStatus, { badge: string; dot: string }> = {
  "시험 임박": { badge: "bg-brand text-white",          dot: "bg-brand"        },
  "집중 관리": { badge: "bg-accent/15 text-accent",     dot: "bg-accent"       },
  "보강 필요": { badge: "bg-warm/70 text-[#7a6200]",    dot: "bg-yellow-400"   },
  정상:        { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
};

const achievementStyles: Record<AchievementLevel, string> = {
  우수: "text-emerald-600 bg-emerald-50",
  보통: "text-[#8a6200] bg-warm/50",
  미흡: "text-brand bg-brand/10",
};

const homeworkStyles: Record<HomeworkStatus, { label: string; style: string }> = {
  완료:       { label: "완료",      style: "text-emerald-600 bg-emerald-50" },
  "부분 완료": { label: "부분 완료", style: "text-[#8a6200] bg-warm/50"     },
  미완료:     { label: "미완료",    style: "text-brand bg-brand/10"         },
};

// ── 공통 소컴포넌트 ───────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
      {children}
    </p>
  );
}

function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warning" | "focus";
}) {
  const styles = {
    default: "bg-soft text-text border border-border/60",
    warning: "bg-brand/10 text-brand border border-brand/20",
    focus:   "bg-accent/10 text-accent border border-accent/20",
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}

function BulletList({
  items,
  variant = "default",
}: {
  items: string[];
  variant?: "default" | "warning" | "check";
}) {
  const icon  = { default: "·", warning: "⚠", check: "✓" };
  const color = { default: "text-muted", warning: "text-brand", check: "text-emerald-500" };
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-6 text-text">
          <span className={`mt-0.5 shrink-0 text-xs font-bold ${color[variant]}`}>
            {icon[variant]}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── 메인 카드 ─────────────────────────────────────────────────

export function LessonPrepCard({
  lesson,
  index,
  nextActions,
}: {
  lesson: LessonPrep;
  index: number;
  nextActions: LessonNextAction[];
}) {
  const [open, setOpen] = useState(true);

  const st  = statusStyles[lesson.status];
  const ach = achievementStyles[lesson.recentAchievement];
  const hw  = homeworkStyles[lesson.homework.status];

  return (
    <article
      id={lesson.id}
      className="overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-soft"
    >
      {/* ── 헤더 (항상 표시) ──────────────────────────────────── */}
      <div className={`px-7 py-6 sm:px-8 ${open ? "border-b border-border/60" : ""}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">

          {/* 좌측: 번호 + 이름 + 기본 정보 */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-lg font-extrabold text-brand">
              {index + 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight text-text">
                  {lesson.studentName}
                </h3>
                <span className="text-sm font-medium text-muted">
                  {lesson.grade} · {lesson.subject}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-muted">🕐 {lesson.time}</span>
                <span className="text-muted/40">·</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    lesson.status === "시험 임박" ? "bg-brand/10 text-brand" : "bg-soft text-muted"
                  }`}
                >
                  시험 {lesson.dDay}
                </span>
              </div>
            </div>
          </div>

          {/* 우측: 뱃지 + 토글 버튼 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${st.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              {lesson.status}
            </span>
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${ach}`}>
              최근 성취도: {lesson.recentAchievement}
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ml-1 flex items-center gap-1.5 rounded-full border border-border bg-soft px-4 py-2 text-xs font-semibold text-text transition hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
            >
              <span>{open ? "접기" : "자세히 보기"}</span>
              <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                ↓
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* ── 상세 내용 (open 시에만 표시) ──────────────────────── */}
      {open && (<>
        <div className="grid gap-0 lg:grid-cols-2">

          {/* ── 좌측 컬럼 ──────────────────────────────────────── */}
          <div className="divide-y divide-border/50">

            {/* 1. 오늘 수업 진도 */}
            <div className="px-7 py-6 sm:px-8">
              <SectionLabel>오늘 수업 진도</SectionLabel>
              <div className="space-y-4">
                <div className="rounded-2xl bg-soft p-4">
                  <p className="text-xs font-semibold text-muted">오늘 나갈 단원</p>
                  <p className="mt-1 text-sm font-bold text-text">{lesson.progress.todayUnit}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-muted">완료 범위</p>
                    <p className="mt-1 text-xs leading-5 text-text">{lesson.progress.completedRange}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted">오늘 목표 범위</p>
                    <p className="mt-1 text-xs leading-5 text-text">{lesson.progress.targetRange}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 text-[11px] font-medium text-muted">
                    {lesson.progress.curriculumPosition}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{
                        width: `${lesson.progress.curriculumPosition.match(/(\d+)%/)?.[1] ?? 50}%`,
                      }}
                    />
                  </div>
                </div>
                {lesson.progress.isDelayed && (
                  <div className="flex items-start gap-2 rounded-xl bg-brand/5 px-4 py-3">
                    <span className="mt-0.5 text-xs text-brand">⚠</span>
                    <div>
                      <p className="text-xs font-bold text-brand">{lesson.progress.planComparison}</p>
                      {lesson.progress.delayNote && (
                        <p className="mt-0.5 text-xs text-muted">{lesson.progress.delayNote}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. 오늘 설명할 내용 */}
            <div className="px-7 py-6 sm:px-8">
              <SectionLabel>오늘 설명할 내용</SectionLabel>
              <div className="space-y-5">
                <Tag variant="focus">{lesson.explanation.conceptType}</Tag>
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">꼭 설명해야 할 핵심 개념</p>
                  <BulletList items={lesson.explanation.keyConcepts} variant="check" />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">학생이 헷갈릴 수 있는 포인트</p>
                  <BulletList items={lesson.explanation.confusionPoints} variant="warning" />
                </div>
                {lesson.explanation.misconceptions.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-bold text-text">주의해서 짚어줄 오개념</p>
                    <BulletList items={lesson.explanation.misconceptions} variant="warning" />
                  </div>
                )}
              </div>
            </div>

            {/* 3. 자료 / 리소스 */}
            <div className="px-7 py-6 sm:px-8">
              <SectionLabel>자료 / 리소스</SectionLabel>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white">
                  <span>★</span>
                  <span>오늘 꼭 사용 — {lesson.materials.priorityTag}</span>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-soft px-4 py-3">
                  <span className="mt-0.5 text-sm">📖</span>
                  <div>
                    <p className="text-[11px] font-semibold text-muted">메인 교재</p>
                    <p className="mt-0.5 text-sm font-semibold text-text">{lesson.materials.mainTextbook}</p>
                  </div>
                </div>
                {lesson.materials.workbooks.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold text-muted">문제집 / 기출</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lesson.materials.workbooks.map((wb, i) => <Tag key={i}>{wb}</Tag>)}
                    </div>
                  </div>
                )}
                {lesson.materials.printouts.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold text-muted">프린트 / 정리 자료</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lesson.materials.printouts.map((pr, i) => <Tag key={i} variant="focus">{pr}</Tag>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── 우측 컬럼 ──────────────────────────────────────── */}
          <div className="divide-y divide-border/50 border-t border-border/50 lg:border-l lg:border-t-0">

            {/* 4. 학생 약점 */}
            <div className="px-7 py-6 sm:px-8">
              <SectionLabel>학생 약점 / 집중 체크</SectionLabel>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">취약 단원</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.weaknesses.weakUnits.map((u, i) => <Tag key={i} variant="warning">{u}</Tag>)}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">반복 실수 패턴</p>
                  <BulletList items={lesson.weaknesses.repeatMistakes} variant="warning" />
                </div>
                <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
                  <p className="mb-2 text-[11px] font-bold text-brand">오늘 집중 체크 포인트</p>
                  <BulletList items={lesson.weaknesses.todayFocusCheck} />
                </div>
                {lesson.weaknesses.attentionPoints.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-bold text-text">추가 주의 포인트</p>
                    <BulletList items={lesson.weaknesses.attentionPoints} />
                  </div>
                )}
              </div>
            </div>

            {/* 5. 숙제 반영 */}
            <div className="px-7 py-6 sm:px-8">
              <SectionLabel>숙제 반영</SectionLabel>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${hw.style}`}>
                    {hw.label}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
                      <div
                        className={`h-full rounded-full transition-all ${
                          lesson.homework.completionRate >= 90
                            ? "bg-emerald-500"
                            : lesson.homework.completionRate >= 60
                              ? "bg-yellow-400"
                              : "bg-brand"
                        }`}
                        style={{ width: `${lesson.homework.completionRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-text">
                      {lesson.homework.completionRate}%
                    </span>
                  </div>
                </div>
                {lesson.homework.warning && (
                  <div className="flex items-start gap-2 rounded-xl bg-brand/5 px-4 py-3">
                    <span className="mt-0.5 text-xs text-brand">⚠</span>
                    <p className="text-xs font-semibold text-brand">{lesson.homework.warning}</p>
                  </div>
                )}
                {lesson.homework.errorTendencies.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-bold text-text">오답 경향</p>
                    <BulletList items={lesson.homework.errorTendencies} variant="warning" />
                  </div>
                )}
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">오늘 수업에 연결할 포인트</p>
                  <BulletList items={lesson.homework.homeworkBasedExplanation} variant="check" />
                </div>
              </div>
            </div>

            {/* 6. 수업 운영 메모 */}
            <div className="px-7 py-6 sm:px-8">
              <SectionLabel>수업 운영 메모</SectionLabel>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">수업 전 확인사항</p>
                  <BulletList items={lesson.lessonMemo.preClassCheck} variant="check" />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-bold text-text">질문 유도 포인트</p>
                  <div className="space-y-1.5">
                    {lesson.lessonMemo.questionPrompts.map((q, i) => (
                      <div key={i} className="rounded-xl bg-soft px-4 py-2.5 text-xs font-medium leading-5 text-text">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
                  <p className="text-[11px] font-bold text-accent">다음 수업 연결 포인트</p>
                  <p className="mt-1.5 text-xs leading-5 text-text">
                    {lesson.lessonMemo.nextLessonConnection}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── 단계별 액션 플랜 ──────────────────────────────── */}
        {(() => {
          const actions = nextActions.find((a) => a.lessonId === lesson.id);
          if (!actions) return null;

          const phases = [
            { key: "beforeClass"    as const, label: "수업 전 준비",   icon: "📋", headerColor: "text-brand",     iconBg: "bg-brand/10 text-brand",     bullet: "text-brand"     },
            { key: "duringClass"    as const, label: "수업 중 강조",   icon: "🎯", headerColor: "text-accent",    iconBg: "bg-accent/10 text-accent",   bullet: "text-accent"    },
            { key: "afterClass"     as const, label: "수업 후 기록",   icon: "✏️", headerColor: "text-[#8a6200]", iconBg: "bg-warm/60 text-[#8a6200]",  bullet: "text-[#8a6200]" },
            { key: "nextLessonPrep" as const, label: "다음 수업 준비", icon: "→",  headerColor: "text-muted",     iconBg: "bg-soft text-muted",         bullet: "text-muted"     },
          ];

          return (
            <div className="border-t border-border/60">
              <div className="px-6 py-4">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  단계별 액션 플랜
                </p>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {phases.map((phase, idx) => {
                    const items = actions[phase.key];
                    return (
                      <div key={phase.key} className="rounded-2xl border border-border/50 bg-soft/40 px-4 py-3.5">
                        <div className="mb-3 flex items-center gap-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${phase.iconBg}`}>
                            {phase.icon}
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted/70">STEP {idx + 1}</p>
                            <p className={`text-xs font-extrabold ${phase.headerColor}`}>{phase.label}</p>
                          </div>
                        </div>
                        <ul className="space-y-1.5">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className={`mt-0.5 shrink-0 text-[10px] font-black ${phase.bullet}`}>·</span>
                              <p className="text-xs leading-5 text-text">{item}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </>)}
    </article>
  );
}
