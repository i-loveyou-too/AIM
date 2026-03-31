"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { StudentEmptyState, StudentErrorState } from "@/components/student/student-empty-state";
import { StudentHeader } from "@/components/student/student-header";
import { fetchAssignments } from "@/lib/api/student";
import type { StudentAssignment } from "@/types/student";

function toAssignmentStatus(assignment: StudentAssignment) {
  if (assignment.status) {
    return assignment.status;
  }
  if (assignment.is_submitted) {
    return "completed";
  }
  return "pending";
}

function formatDueDate(dateText?: string | null) {
  if (!dateText) {
    return "기한 없음";
  }
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }
  return date.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function compareByDueDate(a?: string | null, b?: string | null) {
  if (!a && !b) {
    return 0;
  }
  if (!a) {
    return 1;
  }
  if (!b) {
    return -1;
  }
  return new Date(a).getTime() - new Date(b).getTime();
}

export default function StudentTasksPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssignments();
      const sorted = [...data].sort((a, b) => {
        const aPending = toAssignmentStatus(a) === "pending" ? 1 : 0;
        const bPending = toAssignmentStatus(b) === "pending" ? 1 : 0;
        if (aPending !== bPending) {
          return bPending - aPending;
        }
        return compareByDueDate(a.due_date, b.due_date);
      });
      setAssignments(sorted);
    } catch (err) {
      setAssignments([]);
      setError(err instanceof Error ? err.message : "과제 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const pendingAssignments = useMemo(
    () => assignments.filter((assignment) => toAssignmentStatus(assignment) === "pending"),
    [assignments],
  );
  const completedAssignments = useMemo(
    () => assignments.filter((assignment) => toAssignmentStatus(assignment) !== "pending"),
    [assignments],
  );

  return (
    <>
      <StudentHeader title="내 과제" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">미제출/진행 과제</p>
          {loading ? <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p> : null}
          {!loading && error ? <StudentErrorState message={error} onRetry={loadAssignments} /> : null}
          {!loading && !error && pendingAssignments.length === 0 ? (
            <StudentEmptyState message="미제출 과제가 없습니다." />
          ) : null}
          {!loading && !error && pendingAssignments.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {pendingAssignments.map((assignment) => (
                <li key={assignment.assignment_id} className="rounded-xl border border-brand/30 bg-brand/5 p-3">
                  <p className="text-sm font-semibold text-brand">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted">마감 {formatDueDate(assignment.due_date)}</p>
                  <p className="mt-1 text-xs font-semibold text-brand">상태: pending</p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">완료된 과제</p>
          {loading ? <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p> : null}
          {!loading && !error && completedAssignments.length === 0 ? (
            <StudentEmptyState message="완료된 과제가 없습니다." />
          ) : null}
          {!loading && !error && completedAssignments.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {completedAssignments.map((assignment) => (
                <li key={assignment.assignment_id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-semibold text-text">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted">마감 {formatDueDate(assignment.due_date)}</p>
                  <p className="mt-1 text-xs text-muted">
                    상태: {toAssignmentStatus(assignment)}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </>
  );
}
