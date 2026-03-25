"use client";

// 과제 관리 — 필터 바
// 반 / 과목 / 상태 / 제출방식 / 질문 여부 / 학생 검색

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  subject: string;
  onSubjectChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  submissionType: string;
  onSubmissionTypeChange: (v: string) => void;
  hasQuestion: boolean | null;
  onHasQuestionChange: (v: boolean | null) => void;
};

const subjectOptions = ["전체", "수학", "영어", "국어", "과학"];
const statusOptions  = ["전체", "진행 중", "마감 임박", "보강 필요", "검토 완료"];
const typeOptions    = ["전체", "사진 제출", "OMR 제출"];

function Select({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-text outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function AssignmentFilterBar({
  search, onSearchChange,
  subject, onSubjectChange,
  status, onStatusChange,
  submissionType, onSubmissionTypeChange,
  hasQuestion, onHasQuestionChange,
}: Props) {
  return (
    <div className="rounded-[20px] border border-border/80 bg-white px-5 py-4 shadow-soft">
      <div className="flex flex-wrap items-end gap-4">

        {/* 학생 검색 */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            학생 검색
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-soft px-3 py-2 transition focus-within:border-brand/40">
            <span className="text-muted">🔎</span>
            <input
              type="search"
              placeholder="학생 이름"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted/60"
            />
          </label>
        </div>

        <Select label="과목" value={subject} options={subjectOptions} onChange={onSubjectChange} />
        <Select label="상태" value={status}  options={statusOptions}  onChange={onStatusChange}  />
        <Select label="제출 방식" value={submissionType} options={typeOptions} onChange={onSubmissionTypeChange} />

        {/* 질문 여부 토글 */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            질문 있음
          </label>
          <div className="flex gap-1.5">
            {([null, true, false] as (boolean | null)[]).map((val) => {
              const label = val === null ? "전체" : val ? "있음" : "없음";
              const isActive = hasQuestion === val;
              return (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => onHasQuestionChange(val)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand text-white"
                      : "border border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
