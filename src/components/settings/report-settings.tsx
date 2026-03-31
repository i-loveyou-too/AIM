"use client";

// 설정 > 리포트 기본 설정 섹션

import { useState } from "react";

type ReportPeriod = "1주" | "2주" | "4주";
type ReportView = "학생별" | "반별";
type ExamDDay = "D-7" | "D-14" | "D-21";

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              value === opt
                ? "border-brand bg-brand text-white"
                : "border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

type ReportSettingState = {
  defaultPeriod: ReportPeriod;
  defaultView: ReportView;
  examEmphasisDDay: ExamDDay;
};

export function ReportSettingsSection({ initialSettings }: { initialSettings: ReportSettingState }) {
  const [period, setPeriod] = useState<ReportPeriod>(initialSettings.defaultPeriod);
  const [view, setView] = useState<ReportView>(initialSettings.defaultView);
  const [dDay, setDDay] = useState<ExamDDay>(initialSettings.examEmphasisDDay);

  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">리포트</p>
        <h2 className="mt-1 text-base font-extrabold text-text">리포트 기본 설정</h2>
        <p className="mt-1 text-xs text-muted">리포트 탭에서 기본으로 사용하는 기간 및 보기 방식을 설정합니다.</p>
      </div>
      <div className="space-y-5 px-6 py-5">
        <RadioGroup<ReportPeriod>
          label="기본 리포트 기간"
          options={["1주", "2주", "4주"]}
          value={period}
          onChange={setPeriod}
        />
        <RadioGroup<ReportView>
          label="기본 보기 방식"
          options={["학생별", "반별"]}
          value={view}
          onChange={setView}
        />
        <RadioGroup<ExamDDay>
          label="시험 대비 강조 기준"
          options={["D-7", "D-14", "D-21"]}
          value={dDay}
          onChange={setDDay}
        />
      </div>
    </section>
  );
}
