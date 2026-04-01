"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { StudentEmptyState, StudentErrorState } from "@/components/student/student-empty-state";
import { StudentHeader } from "@/components/student/student-header";
import { loadStudentReportData } from "@/lib/services/student.service";
import type { StudentLatestReport } from "@/types/student";

export default function StudentReportsPage() {
  const [report, setReport] = useState<StudentLatestReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    const result = await loadStudentReportData();
    setReport(result.report);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const weakTopics = useMemo(() => {
    if (!report?.weak_topics || report.weak_topics.length === 0) {
      return [];
    }
    return report.weak_topics;
  }, [report]);

  return (
    <>
      <StudentHeader title="내 리포트" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-muted">최신 리포트</p>
              {!loading && report?.period ? (
                <p className="mt-1 text-xs text-muted">{report.period}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={loadReport}
              disabled={loading}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-text disabled:cursor-not-allowed disabled:opacity-60"
            >
              새로고침
            </button>
          </div>

          {loading ? <p className="mt-3 text-sm text-muted">리포트를 불러오는 중입니다...</p> : null}

          {!loading && error ? <StudentErrorState message={error} onRetry={loadReport} /> : null}

          {!loading && !error && !report ? (
            <StudentEmptyState message="표시할 리포트가 없습니다." />
          ) : null}

          {!loading && !error && report ? (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-soft p-3">
                  <p className="text-xs text-muted">성취도</p>
                  <p className="mt-1 text-lg font-extrabold text-text">
                    {typeof report.achievement_score === "number" ? report.achievement_score : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-soft p-3">
                  <p className="text-xs text-muted">제출률</p>
                  <p className="mt-1 text-lg font-extrabold text-text">
                    {typeof report.submission_rate === "number" ? `${report.submission_rate}%` : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-xs font-semibold text-muted">취약 단원</p>
                {weakTopics.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {weakTopics.map((topic, index) => (
                      <span
                        key={`${topic}-${index}`}
                        className="rounded-full border border-border bg-soft px-2.5 py-1 text-xs font-medium text-text"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">취약 단원이 없습니다.</p>
                )}
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-xs font-semibold text-muted">AI 요약</p>
                <p className="mt-2 text-sm text-text">{report.ai_insight || "요약 데이터가 없습니다."}</p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
