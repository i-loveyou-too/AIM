"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { StudentEmptyState, StudentErrorState } from "@/components/student/student-empty-state";
import { StudentHeader } from "@/components/student/student-header";
import { fetchLatestReport, fetchTodayTasks } from "@/lib/api/student";
import type { StudentLatestReport, StudentTodayTask } from "@/types/student";

function formatDateLabel(dateText?: string | null) {
  if (!dateText) {
    return "기한 없음";
  }
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }
  return date.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
}

function taskStatusLabel(status: string) {
  if (status === "completed") {
    return "완료";
  }
  if (status === "overdue") {
    return "기한 지남";
  }
  return "진행 중";
}

export default function StudentHomePage() {
  const [tasks, setTasks] = useState<StudentTodayTask[]>([]);
  const [report, setReport] = useState<StudentLatestReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [taskResult, reportResult] = await Promise.allSettled([
      fetchTodayTasks(),
      fetchLatestReport(),
    ]);

    if (taskResult.status === "fulfilled") {
      setTasks(taskResult.value);
    } else {
      setTasks([]);
    }

    if (reportResult.status === "fulfilled") {
      setReport(reportResult.value);
    } else {
      setReport(null);
    }

    if (taskResult.status === "rejected" && reportResult.status === "rejected") {
      setError("오늘 할 일과 리포트를 불러오지 못했습니다.");
    } else if (taskResult.status === "rejected") {
      setError("오늘 할 일 데이터를 불러오지 못했습니다.");
    } else if (reportResult.status === "rejected") {
      setError("리포트 요약 데이터를 불러오지 못했습니다.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const weakTopicsText = useMemo(() => {
    if (!report?.weak_topics || report.weak_topics.length === 0) {
      return "취약 단원 없음";
    }
    return report.weak_topics.join(", ");
  }, [report]);

  return (
    <>
      <StudentHeader title="오늘 할 일" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm text-muted">오늘 날짜</p>
          <p className="mt-1 text-xl font-extrabold text-text">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted">오늘 할 일</p>
            {!loading && tasks.length > 0 ? (
              <span className="text-xs text-muted">{tasks.length}건</span>
            ) : null}
          </div>
          {loading ? <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p> : null}
          {!loading && error && tasks.length === 0 ? (
            <StudentErrorState message={error} onRetry={loadData} />
          ) : null}
          {!loading && !error && tasks.length === 0 ? (
            <StudentEmptyState message="오늘 할 일이 없습니다." />
          ) : null}
          {!loading && tasks.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {tasks.map((task) => (
                <li key={task.task_id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-text">{task.title}</p>
                    <span className="rounded-full bg-soft px-2 py-1 text-xs text-muted">
                      {taskStatusLabel(task.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    기한 {formatDateLabel(task.due_date)} · 예상{" "}
                    {task.estimated_minutes ?? 0}분
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">최근 리포트 요약</p>
          {loading ? <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p> : null}
          {!loading && error && !report ? (
            <StudentErrorState message={error} onRetry={loadData} />
          ) : null}
          {!loading && !error && !report ? (
            <StudentEmptyState message="표시할 리포트가 없습니다." />
          ) : null}
          {!loading && report ? (
            <div className="mt-3 space-y-2 text-sm text-text">
              <p>
                제출률: <span className="font-semibold">{report.submission_rate ?? "-"}%</span>
              </p>
              <p>
                최근 성취도:{" "}
                <span className="font-semibold">{report.achievement_score ?? "-"}</span>
              </p>
              <p>
                취약 단원: <span className="font-semibold">{weakTopicsText}</span>
              </p>
              {report.ai_insight ? (
                <p className="rounded-xl border border-border bg-soft px-3 py-2 text-xs text-muted">
                  {report.ai_insight}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
