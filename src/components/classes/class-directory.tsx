"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toDisplayGrade, toDisplayTrack } from "@/lib/api/teacher";
import type { TeacherClassListItem } from "@/types/teacher";

type ClassDirectoryProps = {
  classes: TeacherClassListItem[];
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function displayExam(item: TeacherClassListItem) {
  if (typeof item.exam_days_left === "number" && Number.isFinite(item.exam_days_left)) {
    return `D-${Math.max(0, item.exam_days_left)}`;
  }
  return item.next_exam_date ?? "-";
}

function OptionField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ClassDirectory({ classes }: ClassDirectoryProps) {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("전체");
  const [track, setTrack] = useState("전체");

  const gradeOptions = useMemo(() => {
    const values = Array.from(new Set(classes.map((item) => toDisplayGrade(item.grade))));
    return ["전체", ...values];
  }, [classes]);

  const trackOptions = useMemo(() => {
    const values = Array.from(new Set(classes.map((item) => toDisplayTrack(item.track))));
    return ["전체", ...values];
  }, [classes]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return classes.filter((item) => {
      const gradeLabel = toDisplayGrade(item.grade);
      const trackLabel = toDisplayTrack(item.track);

      if (grade !== "전체" && gradeLabel !== grade) return false;
      if (track !== "전체" && trackLabel !== track) return false;

      if (!query) return true;
      const target = `${item.class_name ?? ""} ${item.teacher_name ?? ""} ${gradeLabel} ${trackLabel}`.toLowerCase();
      return target.includes(query);
    });
  }, [classes, grade, search, track]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
            반 관리
          </span>
          <h2 className="text-[1.3rem] font-extrabold tracking-tight text-text sm:text-[1.5rem]">
            반 목록을 실데이터로 확인하세요
          </h2>
          <p className="text-sm leading-6 text-muted">반명, 학년, 트랙 기준으로 운영 상태를 빠르게 조회할 수 있습니다.</p>
        </div>
      </div>

      <section className="rounded-[28px] border border-border/80 bg-soft p-4 shadow-none sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm xl:min-w-[360px]">
            <span className="text-lg text-muted">🔎</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="반명 검색"
              className="w-full bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted/70"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <OptionField label="학년" value={grade} options={gradeOptions} onChange={setGrade} />
            <OptionField label="트랙" value={track} options={trackOptions} onChange={setTrack} />
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setGrade("전체");
                setTrack("전체");
              }}
              className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
            >
              초기화
            </button>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
          <div className="rounded-[28px] border border-dashed border-border bg-soft px-6 py-10 text-center">
            <p className="text-base font-extrabold tracking-tight text-text">조건에 맞는 반이 없습니다</p>
            <p className="mt-2 text-sm leading-6 text-muted">검색어나 필터를 조정해 다시 확인해 주세요.</p>
          </div>
        </section>
      ) : (
        <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">반 리스트</p>
              <h3 className="mt-1 text-[1.1rem] font-extrabold tracking-tight text-text sm:text-[1.3rem]">
                반별 핵심 지표
              </h3>
            </div>
            <p className="text-sm font-semibold text-brand">총 {filtered.length}개</p>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] border border-border">
            <div className="hidden bg-background/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr_1fr_1fr_1.1fr_1fr]">
              <span>반명</span>
              <span>담당 교사</span>
              <span>학생 수</span>
              <span>평균 점수</span>
              <span>평균 제출률</span>
              <span>커리큘럼 상태</span>
              <span>시험 일정</span>
              <span>학년 / 트랙</span>
            </div>

            <div className="divide-y divide-border">
              {filtered.map((item) => {
                const avgScore = toNumber(item.avg_score);
                const avgAssignmentRate = toNumber(item.avg_assignment_rate);
                return (
                  <article
                    key={item.class_group_id}
                    className="grid gap-4 px-4 py-4 transition duration-200 hover:bg-background/60 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr_1fr_1fr_1.1fr_1fr] md:items-center"
                  >
                    <div>
                      <Link
                        href={`/dashboard/classes/${item.class_group_id}`}
                        className="text-[1.02rem] font-extrabold tracking-tight text-text transition hover:text-brand"
                      >
                        {item.class_name ?? "-"}
                      </Link>
                      <p className="mt-1 text-xs text-muted">반 ID: {item.class_group_id}</p>
                    </div>
                    <p className="text-sm font-semibold text-text">{item.teacher_name ?? "-"}</p>
                    <p className="text-sm font-semibold text-text">
                      {item.enrolled_count} / {item.max_students ?? "-"}
                    </p>
                    <p className="text-sm font-semibold text-text">{avgScore === null ? "-" : `${avgScore.toFixed(1)}점`}</p>
                    <p className="text-sm font-semibold text-text">
                      {avgAssignmentRate === null ? "-" : `${avgAssignmentRate.toFixed(1)}%`}
                    </p>
                    <p className="text-sm font-semibold text-text">{item.curriculum_status ?? "-"}</p>
                    <p className="text-sm font-semibold text-text">{displayExam(item)}</p>
                    <p className="text-sm font-semibold text-text">
                      {toDisplayGrade(item.grade)} · {toDisplayTrack(item.track)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
