"use client";

// 탭 4: 기간별 리포트 허브
// 시간에 따른 변화 추이 분석 탭 - 차트 중심

import { useState } from "react";

type PeriodDataPoint = {
  label: string;
  value: number;
};

type PeriodKey = "1주" | "2주" | "4주" | "월간";

type PeriodIssue = {
  type: "숙제" | "성취도" | "진도" | "시험" | string;
  severity: "high" | "medium" | "low";
  date: string;
  title: string;
};

type PeriodReportBlock = {
  achievementTrend: PeriodDataPoint[];
  homeworkTrend: PeriodDataPoint[];
  progressTrend: PeriodDataPoint[];
  questionCount: PeriodDataPoint[];
  missedCount: PeriodDataPoint[];
  riskCount: PeriodDataPoint[];
  issues: PeriodIssue[];
};

const PERIOD_OPTIONS: PeriodKey[] = ["1주", "2주", "4주", "월간"];

const issueSeverityStyle = {
  high: { bg: "bg-brand/10", text: "text-brand", dot: "bg-brand" },
  medium: { bg: "bg-warm/50", text: "text-[#7a6200]", dot: "bg-warm" },
  low: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
};

const issueTypeStyle: Record<string, { bg: string; text: string }> = {
  숙제: { bg: "bg-accent/10", text: "text-accent" },
  성취도: { bg: "bg-brand/10", text: "text-brand" },
  진도: { bg: "bg-soft", text: "text-muted" },
  시험: { bg: "bg-warm/50", text: "text-[#7a6200]" },
};

// 바 차트 컴포넌트 (수평 레이블 + 바)
function BarChart({
  data,
  color,
  unit = "%",
  maxVal,
}: {
  data: PeriodDataPoint[];
  color: string;
  unit?: string;
  maxVal?: number;
}) {
  const max = maxVal ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-1.5">
      {data.map((point) => (
        <div key={point.label} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-right text-[11px] text-muted">{point.label}</span>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-5 flex-1 overflow-hidden rounded-sm bg-soft">
              <div
                className={`h-full rounded-sm transition-all ${color}`}
                style={{ width: `${(point.value / max) * 100}%` }}
              />
            </div>
            <span className="w-10 text-right text-[11px] font-bold text-text">
              {point.value}{unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 추이 통계 카드
function TrendCard({
  label,
  data,
  color,
  unit = "%",
}: {
  label: string;
  data: PeriodDataPoint[];
  color: string;
  unit?: string;
}) {
  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const diff = last - first;
  const isUp = diff > 0;
  const isFlat = diff === 0;

  return (
    <div className="rounded-[20px] border border-border/80 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-muted">{label}</p>
        <span className={`text-xs font-extrabold ${
          isFlat ? "text-muted" : isUp ? "text-emerald-600" : "text-brand"
        }`}>
          {isFlat ? "변화 없음" : `${isUp ? "+" : ""}${diff}${unit}`}
        </span>
      </div>
      <p className="mb-3 text-[1.4rem] font-extrabold tracking-tight text-text">
        {last}{unit}
      </p>
      <BarChart data={data} color={color} unit={unit} />
    </div>
  );
}

export function PeriodReportHub({ data }: { data: Partial<Record<PeriodKey, PeriodReportBlock>> }) {
  const [period, setPeriod] = useState<PeriodKey>("4주");
  const periodData: PeriodReportBlock = data?.[period] ?? {
    achievementTrend: [],
    homeworkTrend: [],
    progressTrend: [],
    questionCount: [],
    missedCount: [],
    riskCount: [],
    issues: [],
  };

  return (
    <div id="period-report" className="space-y-6">
      {/* 기간 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted">기간 선택</span>
        {PERIOD_OPTIONS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              period === p
                ? "border-brand bg-brand text-white shadow-soft"
                : "border-border bg-white text-muted hover:border-brand/30 hover:text-brand"
            }`}
          >
            최근 {p}
          </button>
        ))}
      </div>

      {/* 핵심 추이 카드 3열 */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TrendCard
          label="성취도 추이"
          data={periodData.achievementTrend}
          color="bg-brand/70"
        />
        <TrendCard
          label="숙제 수행률 추이"
          data={periodData.homeworkTrend}
          color="bg-emerald-400/70"
        />
        <TrendCard
          label="진도 달성률 추이"
          data={periodData.progressTrend}
          color="bg-accent/70"
        />
      </div>

      {/* 질문 수 · 미제출 · 위험도 변화 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TrendCard
          label="질문 수 변화"
          data={periodData.questionCount}
          color="bg-soft border border-border/60"
          unit="건"
        />
        <TrendCard
          label="미제출 변화"
          data={periodData.missedCount}
          color="bg-warm/50"
          unit="건"
        />
        <TrendCard
          label="위험 학생 수 변화"
          data={periodData.riskCount}
          color="bg-brand/40"
          unit="명"
        />
      </div>

      {/* 기간 내 주요 이슈 요약 */}
      <section className="rounded-[20px] border border-border/80 bg-white shadow-soft">
        <div className="border-b border-border/60 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">주요 이슈</p>
          <h2 className="mt-1 text-sm font-extrabold text-text">
            기간 내 주요 이슈 요약
          </h2>
        </div>
        <div className="px-5 py-4">
          <div className="relative space-y-3 pl-5">
            {/* 타임라인 세로선 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />
            {periodData.issues.map((issue, i) => {
              const sev = issueSeverityStyle[issue.severity];
              const typ = issueTypeStyle[issue.type] ?? issueTypeStyle["진도"];
              return (
                <div key={i} className="relative flex items-start gap-3">
                  <span className={`absolute -left-5 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-white ${sev.dot} ring-1 ring-border/50`} />
                  <div className="flex-1 rounded-xl border border-border/50 bg-soft/40 px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typ.bg} ${typ.text}`}>
                        {issue.type}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${sev.bg} ${sev.text}`}>
                        {issue.severity === "high" ? "긴급" : issue.severity === "medium" ? "주의" : "참고"}
                      </span>
                      <span className="text-[11px] font-semibold text-muted">{issue.date}</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-text">{issue.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
