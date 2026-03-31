import { ClassDirectory } from "@/components/classes/class-directory";
import { getTeacherClasses } from "@/lib/api/teacher";

export default async function ClassesPage() {
  try {
    const classes = await getTeacherClasses();

    if (classes.length === 0) {
      return (
        <div className="space-y-6">
          <section className="rounded-[28px] border border-dashed border-border bg-white px-6 py-10 text-center shadow-soft">
            <p className="text-base font-extrabold tracking-tight text-text">반 데이터가 없습니다</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              `/api/teacher/classes` 응답이 비어 있습니다. DB seed 또는 VIEW 결과를 확인해 주세요.
            </p>
          </section>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <ClassDirectory classes={classes} />
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border border-brand/25 bg-brand/5 px-6 py-10 text-center shadow-soft">
          <p className="text-base font-extrabold tracking-tight text-brand">현재 데이터를 불러올 수 없습니다</p>
          <p className="mt-2 text-sm leading-6 text-muted">`/api/teacher/classes` 연결 상태를 확인해 주세요.</p>
          <p className="mt-2 text-xs text-muted">{error instanceof Error ? error.message : "unknown error"}</p>
        </section>
      </div>
    );
  }
}
