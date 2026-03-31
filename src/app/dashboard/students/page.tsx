import { StudentDirectory } from "@/components/students/student-directory";
import { TEACHER_STUDENTS_PAGE_MESSAGES } from "@/lib/fallbacks/teacher";
import { loadTeacherStudentsPageData } from "@/lib/services/teacher.service";

export default async function StudentsPage() {
  const data = await loadTeacherStudentsPageData();

  if (data.status === "empty") {
    return (
      <div className="space-y-6">
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
