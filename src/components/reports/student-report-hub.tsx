"use client";

// 탭 1: 학생별 리포트 허브
// 학생 리포트 목록을 검색/필터링해서 탐색하는 인덱스 허브

import { useState, useMemo } from "react";
import Link from "next/link";

type StudentReportItem = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  className: string;
  status: "양호" | "주의" | "위험" | "관리 필요";
  examReadiness: "양호" | "주의" | "위험";
  examUpcoming: boolean;
  dDay: string;
  achievement: number;
  homework: number;
  progress: number;
  lastUpdated: string;
  insight: string;
};

const statusStyle: Record<StudentReportItem["status"], { bg: string; text: string }> = {
  양호: { bg: "bg-emerald-50", text: "text-emerald-600" },
  주의: { bg: "bg-warm/50", text: "text-[#7a6200]" },
  위험: { bg: "bg-brand/10", text: "text-brand" },
  "관리 필요": { bg: "bg-brand/10", text: "text-brand" },
};

const examReadinessStyle: Record<StudentReportItem["examReadiness"], { bg: string; text: string }> = {
  양호: { bg: "bg-emerald-50", text: "text-emerald-600" },
  주의: { bg: "bg-warm/50", text: "text-[#7a6200]" },
  위험: { bg: "bg-brand/10", text: "text-brand" },
};

function ProgressBar({ value, color = "bg-brand" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function StudentReportHub({ data }: { data: StudentReportItem[] }) {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("전체");
  const [subjectFilter, setSubjectFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [examFilter, setExamFilter] = useState(false);

  const grades = ["전체", ...Array.from(new Set(data.map((s) => s.grade)))];
  const subjects = ["전체", ...Array.from(new Set(data.map((s) => s.subject)))];
  const statuses = ["전체", "양호", "주의", "위험", "관리 필요"];

  const filtered = useMemo(() => {
    return data.filter((s) => {
      if (search && !s.name.includes(search)) return false;
      if (gradeFilter !== "전체" && s.grade !== gradeFilter) return false;
      if (subjectFilter !== "전체" && s.subject !== subjectFilter) return false;
      if (statusFilter !== "전체" && s.status !== statusFilter) return false;
      if (examFilter && !s.examUpcoming) return false;
      return true;
    });
  }, [data, search, gradeFilter, subjectFilter, statusFilter, examFilter]);

  return (
    <div id="student-report" className="space-y-4">
      {/* 필터 영역 */}
      <div className="rounded-[20px] border border-border/80 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          {/* 이름 검색 */}
          <input
            type="text"
            placeholder="학생 이름 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-full border border-border bg-soft px-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand/30"
          />

          {/* 학년 필터 */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="h-9 rounded-full border border-border bg-soft px-4 text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand/30"
          >
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* 과목 필터 */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-9 rounded-full border border-border bg-soft px-4 text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand/30"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-full border border-border bg-soft px-4 text-sm text-text focus:outline-none focus:ring-1 focus:ring-brand/30"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* 시험 임박 필터 */}
          <button
            type="button"
            onClick={() => setExamFilter((v) => !v)}
            className={`h-9 rounded-full border px-4 text-sm font-semibold transition ${
              examFilter
                ? "border-brand bg-brand text-white"
                : "border-border bg-soft text-muted hover:border-brand/30 hover:text-brand"
            }`}
          >
            시험 임박만 보기
          </button>

          <span className="ml-auto text-xs text-muted">
            {filtered.length}명 표시 중
          </span>
        </div>
      </div>

      {/* 학생 카드 목록 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((student) => {
          const ss = statusStyle[student.status];
          const er = examReadinessStyle[student.examReadiness];

          return (
            <div
              key={student.id}
              className="rounded-[24px] border border-border/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-glow"
            >
              {/* 상단: 이름 + 배지 */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-text">{student.name}</h3>
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-muted">
                      {student.grade}
                    </span>
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-muted">
                      {student.subject}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{student.className}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ss.bg} ${ss.text}`}>
                    {student.status}
                  </span>
                  {student.examUpcoming && (
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">
                      {student.dDay}
                    </span>
                  )}
                </div>
              </div>

              {/* 지표 바 */}
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-muted">
                    <span>성취도</span>
                    <span className="font-bold text-text">{student.achievement}%</span>
                  </div>
                  <ProgressBar value={student.achievement} color="bg-brand" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-muted">
                    <span>숙제 수행률</span>
                    <span className="font-bold text-text">{student.homework}%</span>
                  </div>
                  <ProgressBar value={student.homework} color="bg-emerald-500" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-muted">
                    <span>진도 달성률</span>
                    <span className="font-bold text-text">{student.progress}%</span>
                  </div>
                  <ProgressBar value={student.progress} color="bg-accent" />
                </div>
              </div>

              {/* 시험 준비도 + 업데이트일 */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted">시험 준비도</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${er.bg} ${er.text}`}>
                    {student.examReadiness}
                  </span>
                </div>
                <span className="text-[11px] text-muted">업데이트 {student.lastUpdated}</span>
              </div>

              {/* 인사이트 */}
              <div className="mt-3 rounded-xl border border-border/50 bg-soft/50 px-3.5 py-2.5">
                <p className="text-[11px] font-bold text-brand mb-0.5">한 줄 인사이트</p>
                <p className="text-xs leading-5 text-text">{student.insight}</p>
              </div>

              {/* 리포트 보기 버튼 */}
              <div className="mt-4">
                <Link
                  href={`/dashboard/students/${student.id}/report`}
                  className="block w-full rounded-full border border-brand bg-brand py-2 text-center text-xs font-bold text-white shadow-soft transition hover:shadow-glow"
                >
                  리포트 보기
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-[24px] border border-border/80 bg-white py-16 text-center shadow-soft">
          <p className="text-sm font-semibold text-muted">조건에 맞는 학생이 없습니다.</p>
          <p className="mt-1 text-xs text-muted/70">필터를 조정해 다시 검색해보세요.</p>
        </div>
      )}
    </div>
  );
}
