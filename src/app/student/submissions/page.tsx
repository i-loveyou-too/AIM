"use client";

import { useCallback, useEffect, useState } from "react";

import { StudentEmptyState, StudentErrorState } from "@/components/student/student-empty-state";
import { StudentHeader } from "@/components/student/student-header";
import {
  formatStudentSubmissionDateTime,
  loadStudentSubmissionsData,
  toStudentSubmissionStatusLabel,
} from "@/lib/services/student.service";
import type { StudentSubmission } from "@/types/student";

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    const result = await loadStudentSubmissionsData();
    setSubmissions(result.submissions);
    setError(result.error);
    setLoading(false);
  }, []);

  // 업로드 API 연동 시 업로드 성공 콜백에서 loadSubmissions()를 호출해 재조회한다.
  const refreshSubmissions = loadSubmissions;

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  return (
    <>
      <StudentHeader title="숙제 제출" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-muted">제출 이력</p>
              {!loading && !error ? (
                <p className="mt-1 text-xs text-muted">총 {submissions.length}건</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={refreshSubmissions}
              disabled={loading}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-text disabled:cursor-not-allowed disabled:opacity-60"
            >
              새로고침
            </button>
          </div>

          {loading ? <p className="mt-3 text-sm text-muted">제출 이력을 불러오는 중입니다...</p> : null}

          {!loading && error ? <StudentErrorState message={error} onRetry={refreshSubmissions} /> : null}

          {!loading && !error && submissions.length === 0 ? (
            <StudentEmptyState message="아직 제출한 과제가 없습니다." />
          ) : null}

          {!loading && !error && submissions.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {submissions.map((submission) => (
                <li key={submission.submission_id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-text">
                      {submission.assignment_title ?? "과제명 없음"}
                    </p>
                    <span className="rounded-full bg-soft px-2 py-1 text-xs text-muted">
                      {toStudentSubmissionStatusLabel(submission.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    제출 시각 {formatStudentSubmissionDateTime(submission.submitted_at)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    파일 {submission.file_name ?? "-"} · 점수{" "}
                    {typeof submission.score === "number" ? submission.score : "-"}
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
