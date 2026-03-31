"use client";

import { useState } from "react";

import { StudentHeader } from "@/components/student/student-header";
import { askCoach } from "@/lib/api/student";
import type { StudentCoachQuestionType } from "@/types/student";

const questions: Array<{ id: StudentCoachQuestionType; label: string }> = [
  { id: "today_plan", label: "오늘 뭐 해야 해?" },
  { id: "why_this_task", label: "이 과제 왜 중요해?" },
  { id: "before_exam", label: "시험까지 뭐부터 해야 해?" },
];

export default function StudentCoachPage() {
  const [loadingQuestion, setLoadingQuestion] = useState<StudentCoachQuestionType | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuestionLabel, setLastQuestionLabel] = useState<string | null>(null);

  async function handleAsk(questionType: StudentCoachQuestionType, label: string) {
    setLoadingQuestion(questionType);
    setError(null);

    try {
      const response = await askCoach(questionType);
      setAnswer(response.answer);
      setLastQuestionLabel(label);
    } catch (err) {
      setAnswer(null);
      setLastQuestionLabel(label);
      setError(err instanceof Error ? err.message : "답변을 불러오지 못했습니다.");
    } finally {
      setLoadingQuestion(null);
    }
  }

  return (
    <>
      <StudentHeader title="AI 코치" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-text">무엇이 궁금한가요?</p>
          <p className="mt-1 text-xs text-muted">질문을 선택하면 AI 코치가 답변해드립니다.</p>
          <div className="mt-4 space-y-2">
            {questions.map((question) => (
              <button
                key={question.id}
                type="button"
                disabled={loadingQuestion !== null}
                onClick={() => handleAsk(question.id, question.label)}
                className="w-full rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-left text-sm font-medium text-brand transition-colors hover:bg-brand/10 disabled:opacity-60"
              >
                {loadingQuestion === question.id ? "답변 생성 중..." : question.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">답변</p>
          {error ? (
            <p className="mt-3 rounded-xl border border-brand/30 bg-brand/5 px-3 py-2 text-sm text-brand">
              {error}
            </p>
          ) : null}
          {answer ? (
            <div className="mt-3 rounded-xl border border-border bg-soft p-3">
              {lastQuestionLabel ? (
                <p className="text-xs font-semibold text-muted">질문: {lastQuestionLabel}</p>
              ) : null}
              <p className="mt-1 text-sm text-text">{answer}</p>
            </div>
          ) : null}
          {!answer && !error && loadingQuestion === null ? (
            <p className="mt-3 text-sm text-muted">질문을 선택하면 여기에 답변이 표시됩니다.</p>
          ) : null}
        </section>
      </div>
    </>
  );
}
