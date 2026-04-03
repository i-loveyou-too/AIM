"use client";

// 설정 > 알림 설정 섹션

import { useState } from "react";

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

type NotificationSetting = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export function NotificationSettings({
  initialSettings,
  onStateChange,
}: {
  initialSettings: NotificationSetting[];
  onStateChange?: (state: NotificationSetting[]) => void;
}) {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);

  const toggle = (key: string) => {
    setSettings((prev) => {
      const next = prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s));
      onStateChange?.(next);
      return next;
    });
  };

  const enabledCount = settings.filter((s) => s.enabled).length;

  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">알림</p>
            <h2 className="mt-1 text-base font-extrabold text-text">알림 설정</h2>
          </div>
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-muted">
            {enabledCount}/{settings.length} 활성화
          </span>
        </div>
      </div>
      <div className="divide-y divide-border/50 px-6">
        {settings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-bold text-text">{setting.label}</p>
              <p className="mt-0.5 text-xs text-muted">{setting.description}</p>
            </div>
            <Toggle enabled={setting.enabled} onChange={() => toggle(setting.key)} />
          </div>
        ))}
      </div>
    </section>
  );
}
