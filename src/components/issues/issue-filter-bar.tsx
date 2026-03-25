"use client";

// 이슈함 — 탭 + 필터 바

import type { IssueType, IssueUrgency } from "@/lib/mock-data/issue-mock-data";

export type IssueTab =
  | "전체" | "과제" | "시험" | "진도" | "질문" | "OCR·검토" | "집중 관리";

const tabs: { id: IssueTab; icon: string }[] = [
  { id: "전체",    icon: "📌" },
  { id: "과제",    icon: "📋" },
  { id: "시험",    icon: "📅" },
  { id: "진도",    icon: "📈" },
  { id: "질문",    icon: "💬" },
  { id: "OCR·검토", icon: "🔍" },
  { id: "집중 관리", icon: "👤" },
];

type Props = {
  activeTab:       IssueTab;
  onTabChange:     (t: IssueTab) => void;
  search:          string;
  onSearchChange:  (v: string) => void;
  urgency:         IssueUrgency | "전체";
  onUrgencyChange: (v: IssueUrgency | "전체") => void;
  showUnread:      boolean;
  onShowUnreadChange: (v: boolean) => void;
};

const urgencyOptions: (IssueUrgency | "전체")[] = ["전체", "긴급", "높음", "중간", "낮음"];

export function IssueFilterBar({
  activeTab, onTabChange,
  search, onSearchChange,
  urgency, onUrgencyChange,
  showUnread, onShowUnreadChange,
}: Props) {
  return (
    <div className="space-y-3">
      {/* 탭 */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand text-white shadow-soft"
                  : "border border-border bg-white text-muted hover:border-brand/30 hover:text-brand"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.id}</span>
            </button>
          );
        })}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap items-end gap-3 rounded-[20px] border border-border/80 bg-white px-5 py-4 shadow-soft">
        {/* 학생 검색 */}
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">학생/반 검색</label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-soft px-3 py-2 transition focus-within:border-brand/40">
            <span className="text-muted">🔎</span>
            <input
              type="search"
              placeholder="이름·반명 입력"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted/60"
            />
          </label>
        </div>

        {/* 긴급도 */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">긴급도</label>
          <select
            value={urgency}
            onChange={(e) => onUrgencyChange(e.target.value as IssueUrgency | "전체")}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-text outline-none transition focus:border-brand/40"
          >
            {urgencyOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 미확인만 보기 */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">처리 여부</label>
          <button
            type="button"
            onClick={() => onShowUnreadChange(!showUnread)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              showUnread
                ? "bg-brand text-white"
                : "border border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
            }`}
          >
            미확인만 보기
          </button>
        </div>
      </div>
    </div>
  );
}
