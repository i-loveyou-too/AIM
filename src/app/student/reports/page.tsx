import { StudentHeader } from "@/components/student/student-header";

export default function StudentReportsPage() {
  return (
    <>
      <StudentHeader title="내 리포트" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">최근 성적 추이</p>
          <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">취약 단원</p>
          <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">과제 제출률</p>
          <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p>
        </section>
      </div>
    </>
  );
}
