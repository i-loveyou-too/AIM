"use client";

import { useState } from "react";

import { StudentHeader } from "@/components/student/student-header";
import { updateGoals } from "@/lib/api/student";
import type { StudentGoalsUpdatePayload } from "@/types/student";

export default function StudentProfilePage() {
  const [examDate, setExamDate] = useState("");
  const [targetScore, setTargetScore] = useState("90");
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState("120");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSave() {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload: StudentGoalsUpdatePayload = {
      exam_date: examDate || null,
      target_score: targetScore === "" ? null : Number(targetScore),
      daily_study_minutes: dailyStudyMinutes === "" ? null : Number(dailyStudyMinutes),
    };

    try {
      const response = await updateGoals(payload);
      setSuccessMessage(response.detail ?? "저장되었습니다.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StudentHeader title="내 정보" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-text">시험 목표 설정</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted" htmlFor="exam-date">
                시험일
              </label>
              <input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-text focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted" htmlFor="target-score">
                목표 점수
              </label>
              <input
                id="target-score"
                type="number"
                min={0}
                max={100}
                value={targetScore}
                onChange={(event) => setTargetScore(event.target.value)}
                placeholder="예: 90"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-text focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted" htmlFor="daily-minutes">
                하루 가능 학습 시간 (분)
              </label>
              <input
                id="daily-minutes"
                type="number"
                min={0}
                max={1440}
                value={dailyStudyMinutes}
                onChange={(event) => setDailyStudyMinutes(event.target.value)}
                placeholder="예: 120"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-text focus:border-brand focus:outline-none"
              />
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleSave}
              className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "저장 중..." : "저장"}
            </button>

            {successMessage ? (
              <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="rounded-xl border border-brand/30 bg-brand/5 px-3 py-2 text-sm text-brand">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
