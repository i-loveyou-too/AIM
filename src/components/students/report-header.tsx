import Link from "next/link";
import type { StudentDetailData } from "@/types/student-detail";

export function ReportHeader({ detail, studentId }: { detail: StudentDetailData; studentId?: string }) {
  const { student } = detail;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white px-6 py-5 shadow-soft">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted">
        <Link href="/dashboard/students" className="transition-colors hover:text-brand">학생 관리</Link>
        <span className="text-border">›</span>
        {studentId && (
          <>
            <Link href={`/dashboard/students/${studentId}`} className="transition-colors hover:text-brand">
              학생 상세
            </Link>
            <span className="text-border">›</span>
          </>
        )}
        <span className="text-text">리포트</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: name + context */}
        <div className="space-y-2">
          <h1 className="text-[1.9rem] font-extrabold tracking-tight text-text sm:text-[2.25rem]">
            {student.name}
          </h1>
          <p className="text-base font-medium text-muted">2024년 10월 종합 분석</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
            <span>{student.grade} · {student.subject} 중심 분석</span>
            <span className="text-border/60">·</span>
            <span>2024년 5월~10월 누적 데이터</span>
            <span className="text-border/60">·</span>
            <span>수능 {detail.dDayLabel} 기준</span>
          </div>
        </div>

        {/* Right: badge + actions */}
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warm px-3.5 py-1.5 text-xs font-bold text-text shadow-sm">
            ★ Achievement: Top 0.5%
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-text px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-text/85"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 8.5L1.5 4l1-1L6 6.5 9.5 3l1 1L6 8.5zM1.5 10h9v1h-9z"/></svg>
            PDF 리포트 다운로드
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            학부모용 공유
          </button>
        </div>
      </div>
    </section>
  );
}
