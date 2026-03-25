// 이슈함 — 상단 KPI 요약 카드

import { issueSummary } from "@/lib/mock-data/issue-mock-data";

const cards = [
  { id: "unread",       label: "미확인 이슈",          value: issueSummary.unreadCount,          icon: "🔴", tone: "brand"  as const, note: "즉시 확인 필요" },
  { id: "urgent",       label: "오늘 긴급 이슈",        value: issueSummary.urgentTodayCount,      icon: "⚡", tone: "alert"  as const, note: "오늘 내 처리" },
  { id: "exam",         label: "시험 임박 이슈",        value: issueSummary.examImminentCount,     icon: "📅", tone: "warn"   as const, note: "D-21 이내 학생" },
  { id: "assignment",   label: "과제 관련 이슈",        value: issueSummary.assignmentIssueCount,  icon: "📋", tone: "accent" as const, note: "미제출·검토·오답" },
  { id: "reflection",   label: "수업 반영 필요",        value: issueSummary.lessonReflectionCount, icon: "🎯", tone: "soft"   as const, note: "다음 수업 반영" },
  { id: "focusStudent", label: "집중 관리 학생",        value: issueSummary.focusStudentCount,     icon: "👤", tone: "soft"   as const, note: "개별 챙김 필요" },
];

const toneStyle: Record<string, { icon: string; value: string; hover: string }> = {
  brand:  { icon: "bg-brand/10 text-brand",    value: "text-brand",     hover: "hover:border-brand/30"  },
  alert:  { icon: "bg-brand/10 text-brand",    value: "text-brand",     hover: "hover:border-brand/40"  },
  warn:   { icon: "bg-warm/60 text-[#7a6200]", value: "text-[#7a6200]", hover: "hover:border-warm/60"   },
  accent: { icon: "bg-accent/10 text-accent",  value: "text-accent",    hover: "hover:border-accent/30" },
  soft:   { icon: "bg-soft text-muted",        value: "text-text",      hover: "hover:border-border"    },
};

export function IssueSummaryCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => {
        const t = toneStyle[c.tone];
        return (
          <div
            key={c.id}
            className={`rounded-[24px] border border-border/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 ${t.hover}`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${t.icon}`}>
              {c.icon}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted">{c.label}</p>
            <p className={`mt-1 text-[1.55rem] font-extrabold tracking-tight ${t.value}`}>
              {c.value}건
            </p>
            <p className="mt-2 text-[11px] leading-5 text-muted">{c.note}</p>
          </div>
        );
      })}
    </section>
  );
}
