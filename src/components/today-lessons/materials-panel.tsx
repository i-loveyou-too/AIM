"use client";

// 오늘 사용할 자료 패널
// 항목별 준비 상태(준비 완료 / 준비 필요)를 직접 체크할 수 있음

import { useState } from "react";
import { todayMaterials } from "@/lib/mock-data/today-lessons";

type MaterialType = "교재" | "프린트" | "정리표" | "기출" | "링크";
type Priority = "필수" | "참고";

const typeIcon: Record<MaterialType, string> = {
  교재: "📖",
  프린트: "🖨️",
  정리표: "📋",
  기출: "📄",
  링크: "🔗",
};

const priorityStyles: Record<Priority, { badge: string; border: string; borderReady: string }> = {
  필수: {
    badge: "bg-brand text-white",
    border: "border-brand/20 bg-brand/5",
    borderReady: "border-emerald-200 bg-emerald-50/60",
  },
  참고: {
    badge: "bg-soft text-muted",
    border: "border-border/60 bg-white",
    borderReady: "border-emerald-100 bg-emerald-50/40",
  },
};

// 과목별로 자료를 그룹핑
function groupBySubject(materials: typeof todayMaterials) {
  return materials.reduce<Record<string, typeof todayMaterials>>((acc, mat) => {
    if (!acc[mat.subject]) acc[mat.subject] = [];
    acc[mat.subject].push(mat);
    return acc;
  }, {});
}

export function MaterialsPanel() {
  // 각 자료 id를 키로 준비 완료 여부 관리
  const [readyMap, setReadyMap] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setReadyMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const grouped = groupBySubject(todayMaterials);
  const subjectKeys = Object.keys(grouped);

  const readyCount = Object.values(readyMap).filter(Boolean).length;
  const totalCount = todayMaterials.length;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            자료 / 리소스
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
            오늘 사용할 자료 목록
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* 전체 준비 진행 현황 */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-soft px-4 py-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: totalCount > 0 ? `${(readyCount / totalCount) * 100}%` : "0%" }}
              />
            </div>
            <span className="text-xs font-bold text-text">
              {readyCount}/{totalCount} 준비 완료
            </span>
          </div>
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
            필수 {todayMaterials.filter((m) => m.priority === "필수").length}개
          </span>
          <span className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-muted">
            참고 {todayMaterials.filter((m) => m.priority === "참고").length}개
          </span>
        </div>
      </div>

      {/* 과목별 그룹 */}
      <div className="divide-y divide-border/50">
        {subjectKeys.map((subject) => (
          <div key={subject} className="px-6 py-5">
            {/* 과목 라벨 */}
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-text">
                {subject}
              </span>
              <span className="text-xs text-muted">{grouped[subject][0].student}</span>
            </div>

            {/* 자료 리스트 */}
            <div className="grid gap-3 sm:grid-cols-2">
              {grouped[subject].map((mat) => {
                const isReady = !!readyMap[mat.id];
                const pStyles = priorityStyles[mat.priority];
                const icon = typeIcon[mat.type as MaterialType] ?? "📄";
                const borderClass = isReady ? pStyles.borderReady : pStyles.border;

                return (
                  <div
                    key={mat.id}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors duration-200 ${borderClass}`}
                  >
                    {/* 자료 아이콘 */}
                    <span className={`mt-0.5 text-base ${isReady ? "opacity-50" : ""}`}>
                      {icon}
                    </span>

                    {/* 자료 정보 */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-semibold leading-5 transition-colors ${
                            isReady ? "text-muted line-through decoration-muted/50" : "text-text"
                          }`}
                        >
                          {mat.title}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isReady ? "bg-soft text-muted/60" : pStyles.badge
                          }`}
                        >
                          {mat.priority}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-medium text-muted">
                          {mat.type}
                        </span>
                        {mat.note && (
                          <p className="truncate text-[11px] text-muted">{mat.note}</p>
                        )}
                      </div>

                      {/* 준비 상태 토글 버튼 */}
                      <button
                        type="button"
                        onClick={() => toggle(mat.id)}
                        className={`mt-2.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                          isReady
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-soft text-muted hover:bg-brand/8 hover:text-brand border border-border hover:border-brand/20"
                        }`}
                      >
                        {isReady ? (
                          <>
                            <span>✓</span>
                            <span>준비 완료</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px]">○</span>
                            <span>준비 필요</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
