"use client";

type Option = {
  label: string;
  value: string;
};

type StudentFiltersProps = {
  school: string;
  grade: string;
  subject: string;
  status: string;
  sortBy: string;
  search: string;
  quickFilterLabel?: string;
  schoolOptions: Option[];
  gradeOptions: Option[];
  subjectOptions: Option[];
  statusOptions: Option[];
  sortOptions: Option[];
  onSearchChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
};

function FilterField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-semibold text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-semibold text-text outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-text">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StudentFilters({
  school,
  grade,
  subject,
  status,
  sortBy,
  search,
  quickFilterLabel,
  schoolOptions,
  gradeOptions,
  subjectOptions,
  statusOptions,
  sortOptions,
  onSearchChange,
  onSchoolChange,
  onGradeChange,
  onSubjectChange,
  onStatusChange,
  onSortChange,
  onReset,
}: StudentFiltersProps) {
  const activeCount = [school, grade, subject, status]
    .filter((value) => value !== "전체")
    .length + (quickFilterLabel && quickFilterLabel !== "전체 학생" ? 1 : 0);

  return (
    <section className="rounded-[28px] border border-border/80 bg-soft p-4 shadow-none sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm xl:min-w-[360px]">
          <span className="text-lg text-muted">🔎</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="학생 이름, 학교, 반, 과목 검색"
            className="w-full bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted/70"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <FilterField label="학교" value={school} options={schoolOptions} onChange={onSchoolChange} />
          <FilterField label="학년" value={grade} options={gradeOptions} onChange={onGradeChange} />
          <FilterField label="과목" value={subject} options={subjectOptions} onChange={onSubjectChange} />
          <FilterField label="상태" value={status} options={statusOptions} onChange={onStatusChange} />
          <FilterField label="정렬" value={sortBy} options={sortOptions} onChange={onSortChange} />

          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
          활성 필터 {activeCount}개
        </span>
        {quickFilterLabel && quickFilterLabel !== "전체 학생" ? (
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand shadow-sm">
            빠른 필터 · {quickFilterLabel}
          </span>
        ) : null}
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
          학교 선택 필터 지원
        </span>
      </div>
    </section>
  );
}
