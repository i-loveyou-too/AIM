import Link from "next/link";
import { getTeacherClassDetail, toDisplayGrade, toDisplayTrack } from "@/lib/api/teacher";

type PageProps = {
  params: {
    id: string;
  };
};

function displayValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "-";
    return String(value);
  }
  return String(value);
}

function formatNumber(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined || !Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}${suffix}`;
}

function formatExam(examDaysLeft: number | null | undefined, nextExamDate: string | null | undefined) {
  if (typeof examDaysLeft === "number" && Number.isFinite(examDaysLeft)) {
    return `D-${Math.max(0, examDaysLeft)}`;
  }
  return nextExamDate ?? "-";
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-soft/40 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-text">{value}</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-10 shadow-soft">
        <p className="text-base font-extrabold tracking-tight text-text">반 정보를 찾을 수 없습니다</p>
        <p className="mt-2 text-sm text-muted">요청한 class_group_id에 해당하는 데이터가 없습니다.</p>
        <Link
          href="/dashboard/classes"
          className="mt-4 inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand"
        >
          반 목록으로 돌아가기
        </Link>
      </section>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-brand/25 bg-brand/5 px-6 py-10 shadow-soft">
        <p className="text-base font-extrabold tracking-tight text-brand">현재 데이터를 불러올 수 없습니다</p>
        <p className="mt-2 text-sm text-muted">`/api/teacher/classes/{'{id}'}` 연결 상태를 확인해 주세요.</p>
        <p className="mt-2 text-xs text-muted">{message}</p>
      </section>
    </main>
  );
}

export default async function ClassDetailPage({ params }: PageProps) {
  const classGroupId = Number(params.id);
  if (!Number.isInteger(classGroupId) || classGroupId <= 0) {
    return <NotFoundState />;
  }

  try {
    const result = await getTeacherClassDetail(classGroupId);
    if (result.status === 404 || !result.data) {
      return <NotFoundState />;
    }

    const data = result.data;

    return (
      <main className="space-y-6">
        <section className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">반 상세</p>
              <h1 className="mt-1 text-[2rem] font-extrabold tracking-tight text-text sm:text-[2.3rem]">
                {displayValue(data.class_name)}
              </h1>
              <p className="mt-1 text-sm text-muted">반 ID {data.class_group_id}</p>
            </div>
            <Link
              href="/dashboard/classes"
              className="inline-flex rounded-full border border-border bg-soft px-4 py-2 text-xs font-semibold text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
            >
              ← 반 목록
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailField label="class_name" value={displayValue(data.class_name)} />
            <DetailField label="teacher_name" value={displayValue(data.teacher_name)} />
            <DetailField label="grade" value={toDisplayGrade(data.grade)} />
            <DetailField label="track" value={toDisplayTrack(data.track)} />
            <DetailField label="level" value={displayValue(data.level)} />
            <DetailField label="enrolled_count" value={displayValue(data.enrolled_count)} />
            <DetailField label="max_students" value={displayValue(data.max_students)} />
            <DetailField label="avg_score" value={formatNumber(data.avg_score, "점")} />
            <DetailField label="avg_assignment_rate" value={formatNumber(data.avg_assignment_rate, "%")} />
            <DetailField label="curriculum_status" value={displayValue(data.curriculum_status)} />
            <DetailField label="actual_progress" value={displayValue(data.actual_progress)} />
            <DetailField label="planned_progress" value={displayValue(data.planned_progress)} />
            <DetailField label="next_exam_date" value={displayValue(data.next_exam_date)} />
            <DetailField label="exam_days_left" value={formatExam(data.exam_days_left, data.next_exam_date)} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    return <ErrorState message={error instanceof Error ? error.message : "unknown error"} />;
  }
}
