"use client";

// 과제 관리 — 보기 탭 컨트롤
// 반별 보기 / 학생별 보기 / 미제출 보기 / 마감 임박 보기

export type ViewTab = "class" | "student" | "unsubmitted" | "dueToday";

const tabs: { id: ViewTab; label: string; icon: string }[] = [
  { id: "class",       label: "반별 보기",     icon: "🏫" },
  { id: "student",     label: "학생별 보기",   icon: "👤" },
  { id: "unsubmitted", label: "미제출 보기",   icon: "⚠️" },
  { id: "dueToday",    label: "마감 임박 보기", icon: "⏰" },
];

type Props = {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
};

export function AssignmentViewTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "bg-brand text-white shadow-soft"
                : "border border-border bg-white text-muted hover:border-brand/30 hover:text-brand"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
