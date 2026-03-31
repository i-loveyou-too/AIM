"use client";

// 설정 > 수업 운영 설정 섹션

import { useState } from "react";

type Duration = "60분" | "90분" | "120분";
type InfoScope = "전체" | "요약만";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition duration-200 ${
        enabled ? "border-brand bg-brand" : "border-border bg-soft"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

type LessonSettingState = {
  defaultDuration: Duration;
  todayPageInfoScope: InfoScope;
  showNextAction: boolean;
  showLessonMemo: boolean;
};

export function LessonSettings({ initialSettings }: { initialSettings: LessonSettingState }) {
  const settings = initialSettings;
  const [duration, setDuration] = useState<Duration>(settings.defaultDuration);
  const [infoScope, setInfoScope] = useState<InfoScope>(settings.todayPageInfoScope);
  const [showNextAction, setShowNextAction] = useState(settings.showNextAction);
  const [showMemo, setShowMemo] = useState(settings.showLessonMemo);

  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">수업</p>
        <h2 className="mt-1 text-base font-extrabold text-text">수업 운영 설정</h2>
        <p className="mt-1 text-xs text-muted">오늘 수업 운영 페이지에 적용되는 기본값을 설정합니다.</p>
      </div>
      <div className="space-y-5 px-6 py-5">
        {/* 기본 수업 시간 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">기본 수업 시간</p>
          <div className="flex gap-2">
            {(["60분", "90분", "120분"] as Duration[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDuration(opt)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  duration === opt
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 정보 표시 범위 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">오늘 수업 정보 표시 범위</p>
          <div className="flex gap-2">
            {(["전체", "요약만"] as InfoScope[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setInfoScope(opt)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  infoScope === opt
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 토글 설정들 */}
        <div className="divide-y divide-border/50">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-bold text-text">다음 수업 액션 기본 표시</p>
              <p className="mt-0.5 text-xs text-muted">오늘 수업 운영 페이지 하단에 다음 수업 액션을 기본으로 표시합니다.</p>
            </div>
            <Toggle enabled={showNextAction} onChange={() => setShowNextAction((v) => !v)} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-bold text-text">수업 메모 기본 활성화</p>
              <p className="mt-0.5 text-xs text-muted">수업 종료 후 메모 작성 영역을 기본으로 활성화합니다.</p>
            </div>
            <Toggle enabled={showMemo} onChange={() => setShowMemo((v) => !v)} />
          </div>
        </div>
      </div>
    </section>
  );
}
