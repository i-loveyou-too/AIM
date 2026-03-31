"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { StudentEmptyState, StudentErrorState } from "@/components/student/student-empty-state";
import { StudentHeader } from "@/components/student/student-header";
import {
  formatStudentAssignmentDueDate,
  loadStudentTasksData,
  partitionStudentAssignments,
  toStudentAssignmentStatus,
} from "@/lib/services/student.service";
import type { StudentAssignment } from "@/types/student";

export default function StudentTasksPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    const result = await loadStudentTasksData();
    setAssignments(result.assignments);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const { pendingAssignments, completedAssignments } = useMemo(
    () => partitionStudentAssignments(assignments),
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
                  <p className="mt-1 text-xs text-muted">마감 {formatStudentAssignmentDueDate(assignment.due_date)}</p>
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
                  <p className="mt-1 text-xs text-muted">마감 {formatStudentAssignmentDueDate(assignment.due_date)}</p>
                  <p className="mt-1 text-xs text-muted">상태: {toStudentAssignmentStatus(assignment)}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </>
  );
}
