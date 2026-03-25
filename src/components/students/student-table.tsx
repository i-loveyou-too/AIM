import Link from "next/link";
import type { StudentRecord } from "@/lib/mock-data/index";

type StudentTableProps = {
  students: StudentRecord[];
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

const managementStyles = {
  우수: {
    badge: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
  },
  보통: {
    badge: "bg-amber-100 text-amber-700",
    bar: "bg-amber-400",
  },
  주의: {
    badge: "bg-rose-100 text-rose-700",
    bar: "bg-rose-500",
  },
};

function getInitials(name: string) {
  return name.slice(0, 1);
}

function getManagementLevel(student: StudentRecord) {
  if (student.score >= 85 && student.overdueAssignments === 0) return "우수" as const;
  if (student.status === "주의" || student.status === "시험 임박" || student.overdueAssignments >= 2) {
    return "주의" as const;
  }
  return "보통" as const;
}

export function StudentTable({
  students,
  page,
  totalPages,
  totalCount,
  onPageChange,
}: StudentTableProps) {
  if (students.length === 0) {
    return (
      <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
        <div className="rounded-[28px] border border-dashed border-border bg-soft px-6 py-10 text-center">
          <p className="text-base font-extrabold tracking-tight text-text">조건에 맞는 학생이 없습니다</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            상단의 빠른 필터나 상세 필터를 조금만 풀면 다시 학생 목록이 보입니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">학생 리스트</p>
          <h3 className="mt-1 text-[1.2rem] font-extrabold tracking-tight text-text sm:text-[1.45rem]">
            학교별로 묶지 않고, 선택 필터로 바로 확인합니다
          </h3>
        </div>
        <p className="text-sm font-semibold text-brand">총 {totalCount}명</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-border">
        <div className="hidden bg-background/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid md:grid-cols-[1.25fr_0.9fr_1.2fr_0.7fr_1fr_0.8fr_1.1fr]">
          <span>학생 정보</span>
          <span>학년 / 과목</span>
          <span>최근 진도</span>
          <span>시험일</span>
          <span>과제 상태</span>
          <span>관리 수준</span>
          <span>바로가기</span>
        </div>

        <div className="divide-y divide-border">
          {students.map((student) => {
            const managementLevel = getManagementLevel(student);
            const assignmentRate = Math.round((student.assignmentDone / student.assignmentTotal) * 100);

            return (
              <article
                key={student.id}
                className="grid gap-4 px-4 py-4 transition duration-200 hover:bg-background/60 md:grid-cols-[1.25fr_0.9fr_1.2fr_0.7fr_1fr_0.8fr_1.1fr] md:items-center"
              >
                <Link
                  href={`/dashboard/students/${student.id}`}
                  className="group flex items-center gap-3 rounded-2xl transition hover:bg-background/60"
                  aria-label={`${student.name} 학생 상세 보기`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-soft text-sm font-extrabold text-brand">
                    {getInitials(student.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[1.02rem] font-extrabold tracking-tight text-text transition group-hover:text-brand">
                      {student.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">학생 ID: {student.id}</p>
                  </div>
                </Link>

                <div className="text-sm text-muted">
                  <p className="font-semibold text-text">{student.grade}학년</p>
                  <p className="mt-1 uppercase tracking-[0.14em]">{student.subject}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-extrabold text-text">{student.recentProgress}</p>
                    <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                      {student.recentTag}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-soft">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${student.score}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted">{student.score}% 최근 성취도</p>
                </div>

                <div>
                  <p className="text-sm font-extrabold text-text">D-{student.examDays}</p>
                  <p className="mt-1 text-xs text-muted">시험까지 남음</p>
                </div>

                <div>
                  <p className="text-sm font-extrabold text-text">
                    {student.assignmentDone}/{student.assignmentTotal}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-soft">
                    <div
                      className={`h-2 rounded-full ${
                        student.overdueAssignments > 0 ? "bg-brand" : "bg-emerald-500"
                      }`}
                      style={{ width: `${assignmentRate}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {student.overdueAssignments > 0
                      ? `미완료 ${student.overdueAssignments}건`
                      : "과제 정리 완료"}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      managementStyles[managementLevel].badge
                    }`}
                  >
                    {managementLevel}
                  </span>
                  <div className="mt-2 h-2 rounded-full bg-soft">
                    <div
                      className={`h-2 rounded-full transition-all ${managementStyles[managementLevel].bar}`}
                      style={{ width: managementLevel === "우수" ? "100%" : managementLevel === "보통" ? "66%" : "32%" }}
                    />
                  </div>
                </div>

                {/* 상세 보기: 현재 운영 상태 관리 / 리포트 보기: 추이·분석 화면 */}
                <div className="flex flex-col gap-1.5">
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand shadow-sm transition hover:bg-brand/20"
                    aria-label={`${student.name} 상세 보기`}
                  >
                    <span>📋</span>
                    <span>상세 보기</span>
                  </Link>
                  <Link
                    href={`/dashboard/students/${student.id}/report`}
                    className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent shadow-sm transition hover:bg-accent/20"
                    aria-label={`${student.name} 리포트 보기`}
                  >
                    <span>📊</span>
                    <span>리포트 보기</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-muted">
          페이지 {page} / {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand disabled:opacity-40"
            disabled={page === 1}
            aria-label="이전 페이지"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold shadow-sm transition ${
                pageNumber === page
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-white text-muted hover:border-brand/30 hover:text-brand"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand disabled:opacity-40"
            disabled={page === totalPages}
            aria-label="다음 페이지"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
