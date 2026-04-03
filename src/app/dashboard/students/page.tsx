import Link from "next/link";
import { StudentDirectory } from "@/components/students/student-directory";
import { TEACHER_STUDENTS_PAGE_MESSAGES } from "@/lib/fallbacks/teacher";
import { loadTeacherStudentsPageData } from "@/lib/services/teacher.service";

export default async function StudentsPage() {
  const data = await loadTeacherStudentsPageData();

  if (data.status === "empty") {
    return (
      <div className="space-y-6">
        <div className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
                학생 관리
              </span>
              <div>
                <h2 className="text-[1.3rem] font-extrabold tracking-tight text-text sm:text-[1.5rem]">
                  학생을 먼저 등록해서 관리 흐름을 시작하세요
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  아직 등록된 학생이 없어도, 여기서 바로 학생 등록 페이지로 이동할 수 있습니다.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/students/register"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            >
              <span className="text-base leading-none">+</span>
              학생 등록
            </Link>
          </div>
        </div>
        <section className="rounded-[28px] border border-dashed border-border bg-white px-6 py-10 text-center shadow-soft">
          <p className="text-base font-extrabold tracking-tight text-text">
            {TEACHER_STUDENTS_PAGE_MESSAGES.emptyTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {TEACHER_STUDENTS_PAGE_MESSAGES.emptyDescription}
          </p>
        </section>
      </div>
    );
  }

  if (data.status === "error") {
    return (
      <div className="space-y-6">
        <div className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
                학생 관리
              </span>
              <div>
                <h2 className="text-[1.3rem] font-extrabold tracking-tight text-text sm:text-[1.5rem]">
                  학생 목록을 불러오지 못해도 등록 화면은 바로 열 수 있습니다
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  목록 조회 오류와 별개로 학생 등록 플로우는 계속 진행할 수 있게 연결했습니다.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/students/register"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            >
              <span className="text-base leading-none">+</span>
              학생 등록
            </Link>
          </div>
        </div>
        <section className="rounded-[28px] border border-brand/25 bg-brand/5 px-6 py-10 text-center shadow-soft">
          <p className="text-base font-extrabold tracking-tight text-brand">
            {TEACHER_STUDENTS_PAGE_MESSAGES.errorTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {TEACHER_STUDENTS_PAGE_MESSAGES.errorDescription}
          </p>
          <p className="mt-2 text-xs text-muted">{data.message}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentDirectory students={data.students} />
    </div>
  );
}
