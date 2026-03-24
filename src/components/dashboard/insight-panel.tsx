"use client";

import { useEffect, useMemo, useState } from "react";

type ClassInsight = {
  label: string;
  school: string;
  className: string;
  metricLabel: string;
  metricValue: string;
  delta: string;
  note: string;
  chartBars: number[];
  focusLabel: string;
  focusValue: string;
};

type StudentInsight = {
  label: string;
  title: string;
  subtitle: string;
  students: Array<{
    name: string;
    className: string;
    badge: string;
    note: string;
  }>;
};

type InsightPanelProps = {
  classInsights: ClassInsight[];
  studentInsight: StudentInsight;
};

const badgeStyles: Record<string, string> = {
  상승: "bg-brand/10 text-brand",
  주의: "bg-warm/70 text-text",
  확인: "bg-soft text-brand",
};

export function InsightPanel({ classInsights, studentInsight }: InsightPanelProps) {
  const schoolOptions = useMemo(
    () => Array.from(new Set(classInsights.map((item) => item.school))),
    [classInsights],
  );
  const [selectedSchool, setSelectedSchool] = useState(schoolOptions[0] ?? "");
  const classOptions = classInsights.filter((item) => item.school === selectedSchool);
  const [selectedClassName, setSelectedClassName] = useState(classOptions[0]?.className ?? "");

  useEffect(() => {
    const nextClasses = classInsights.filter((item) => item.school === selectedSchool);
    setSelectedClassName(nextClasses[0]?.className ?? "");
  }, [classInsights, selectedSchool]);

  const selectedInsight =
    classInsights.find(
      (item) => item.school === selectedSchool && item.className === selectedClassName,
    ) ?? classOptions[0] ?? classInsights[0];

  if (!selectedInsight) {
    return null;
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
              {selectedInsight.label}
            </span>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-2 text-sm text-muted">
                <span className="text-xs font-semibold text-muted">학교</span>
                <select
                  value={selectedSchool}
                  onChange={(event) => setSelectedSchool(event.target.value)}
                  className="bg-transparent text-sm font-semibold text-text outline-none"
                >
                  {schoolOptions.map((school) => (
                    <option key={school} value={school} className="text-text">
                      {school}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-2 text-sm text-muted">
                <span className="text-xs font-semibold text-muted">반</span>
                <select
                  value={selectedClassName}
                  onChange={(event) => setSelectedClassName(event.target.value)}
                  className="bg-transparent text-sm font-semibold text-text outline-none"
                >
                  {classOptions.map((classItem) => (
                    <option key={`${classItem.school}-${classItem.className}`} value={classItem.className} className="text-text">
                      {classItem.className}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm text-muted">
              {selectedInsight.school} · {selectedInsight.className}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-2xl">
            📈
          </div>
        </div>

        <div className="mt-5 flex items-end gap-4">
          <div>
            <p className="text-sm font-medium text-muted">{selectedInsight.metricLabel}</p>
            <p className="mt-1 text-[2.2rem] font-extrabold tracking-tight text-text sm:text-[2.55rem]">
              {selectedInsight.metricValue}
            </p>
          </div>
          <span className="mb-2 rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
            {selectedInsight.delta}
          </span>
        </div>

        <h3 className="mt-4 max-w-2xl text-[1.1rem] font-extrabold leading-tight tracking-tight text-text sm:text-[1.35rem]">
          {selectedInsight.note}
        </h3>

        <div className="mt-6 flex items-end gap-2">
          {selectedInsight.chartBars.map((height, index) => (
            <div
              key={`${height}-${index}`}
              className={`w-10 rounded-t-2xl ${
                index === selectedInsight.chartBars.length - 1
                  ? "bg-brand"
                  : index === selectedInsight.chartBars.length - 2
                    ? "bg-brand/20"
                    : "bg-soft"
              }`}
              style={{ height }}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-2 w-44 rounded-full bg-soft">
            <div className="h-2 w-[88%] rounded-full bg-brand" />
          </div>
          <p className="text-sm font-medium text-muted">{selectedInsight.focusLabel}</p>
          <p className="text-sm font-semibold text-brand">{selectedInsight.focusValue}</p>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="rounded-full bg-text px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
          >
            반 리포트 보기 →
          </button>
        </div>
      </article>

      <article className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-soft px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
            {studentInsight.label}
          </span>
          <h3 className="text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
            {studentInsight.title}
          </h3>
          <p className="text-sm leading-6 text-muted">{studentInsight.subtitle}</p>
        </div>

        <div className="mt-5 space-y-3">
          {studentInsight.students.map((student) => (
            <div
              key={`${student.name}-${student.className}`}
              className="rounded-[24px] border border-border bg-background/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1.05rem] font-extrabold tracking-tight text-text">
                    {student.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{student.className}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    badgeStyles[student.badge] ?? "bg-soft text-brand"
                  }`}
                >
                  {student.badge}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{student.note}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
