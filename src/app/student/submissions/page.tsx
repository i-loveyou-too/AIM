import { StudentHeader } from "@/components/student/student-header";

export default function StudentSubmissionsPage() {
  return (
    <>
      <StudentHeader title="숙제 제출" />
      <div className="space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
          <p className="text-sm font-semibold text-brand">사진 제출</p>
          <p className="mt-2 text-sm text-muted">숙제 사진을 찍어서 제출하세요.</p>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white"
          >
            사진 선택
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">제출 이력</p>
          <p className="mt-3 text-sm text-muted">데이터를 불러오는 중입니다...</p>
        </section>
      </div>
    </>
  );
}
