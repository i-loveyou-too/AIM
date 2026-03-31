"use client";

// 설정 > 과제 관리 설정 섹션

import { useState } from "react";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition duration-200 ${
        enabled ? "border-brand bg-brand" : "border-border bg-soft"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

type AssignmentSettingState = {
  defaultDeadlineTime: string;
  allowPhotoSubmit: boolean;
  allowOMRSubmit: boolean;
  questionEnabled: boolean;
  ocrReviewHighlight: boolean;
  commonMistakeAlert: boolean;
};

export function AssignmentSettings({ initialSettings }: { initialSettings: AssignmentSettingState }) {
  const settings = initialSettings;
  const [deadline, setDeadline] = useState(settings.defaultDeadlineTime);
  const [photo, setPhoto] = useState(settings.allowPhotoSubmit);
  const [omr, setOMR] = useState(settings.allowOMRSubmit);
  const [question, setQuestion] = useState(settings.questionEnabled);
  const [ocr, setOCR] = useState(settings.ocrReviewHighlight);
  const [mistake, setMistake] = useState(settings.commonMistakeAlert);

  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">과제</p>
        <h2 className="mt-1 text-base font-extrabold text-text">과제 관리 설정</h2>
        <p className="mt-1 text-xs text-muted">과제 관리 페이지에 적용되는 기본 설정을 관리합니다.</p>
      </div>
      <div className="space-y-5 px-6 py-5">
        {/* 기본 제출 마감 시간 */}
        <div>
          <label htmlFor="deadline" className="mb-2 block text-xs font-semibold text-muted">
            기본 제출 마감 시간
          </label>
          <input
            id="deadline"
            type="time"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="h-9 rounded-full border border-border bg-soft px-4 text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand/30"
          />
        </div>

        {/* 허용 제출 방식 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">허용 제출 방식</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPhoto((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                photo
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
              }`}
            >
              <span>{photo ? "✓" : "○"}</span> 사진 제출
            </button>
            <button
              type="button"
              onClick={() => setOMR((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                omr
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
              }`}
            >
              <span>{omr ? "✓" : "○"}</span> OMR 제출
            </button>
          </div>
        </div>

        {/* 토글 설정들 */}
        <div className="divide-y divide-border/50">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-bold text-text">질문란 기본 활성화</p>
              <p className="mt-0.5 text-xs text-muted">과제 제출 시 학생 질문란을 기본으로 표시합니다.</p>
            </div>
            <Toggle enabled={question} onChange={() => setQuestion((v) => !v)} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-bold text-text">OCR 검토 강조 표시</p>
              <p className="mt-0.5 text-xs text-muted">OCR 검토가 필요한 항목을 목록에서 강조 표시합니다.</p>
            </div>
            <Toggle enabled={ocr} onChange={() => setOCR((v) => !v)} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-bold text-text">공통 오답 반영 알림</p>
              <p className="mt-0.5 text-xs text-muted">공통 오답 패턴이 감지될 때 과제 관리 페이지에서 알림을 표시합니다.</p>
            </div>
            <Toggle enabled={mistake} onChange={() => setMistake((v) => !v)} />
          </div>
        </div>
      </div>
    </section>
  );
}
