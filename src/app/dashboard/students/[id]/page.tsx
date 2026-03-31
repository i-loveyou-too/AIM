import type { Metadata } from "next";
import Link from "next/link";
import { getTeacherStudentDetail, toDisplayGrade, toDisplayStatus } from "@/lib/api/teacher";
import type { TeacherStudentDetail } from "@/types/teacher";

type PageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "학생 상세 | Aim ON",
  description: "교사용 학생 상세 실데이터 화면",
};

function displayValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return String(value);
}

function formatWeakTopics(value: TeacherStudentDetail["weak_topics"]) {
  if (!value || value.length === 0) return "-";
  const topics = value
    .map((item) => item?.topic)
    .filter((topic): topic is string => Boolean(topic));
  return topics.length > 0 ? topics.join(", ") : "-";
}

function formatStudytiTags(value: TeacherStudentDetail["studyti_tags"]) {
  if (!value || value.length === 0) return "-";
  return value.join(", ");
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
        <p className="text-base font-extrabold tracking-tight text-text">학생을 찾을 수 없습니다</p>
        <p className="mt-2 text-sm text-muted">요청한 student_id에 해당하는 데이터가 없습니다.</p>
        <Link
          href="/dashboard/students"
          className="mt-4 inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand"
        >
          학생 목록으로 돌아가기
        </Link>
      </section>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-brand/25 bg-brand/5 px-6 py-10 shadow-soft">
        <p className="text-base font-extrabold tracking-tight text-brand">학생 상세를 불러오지 못했습니다</p>
        <p className="mt-2 text-sm text-muted">`/api/teacher/students/{'{id}'}` 연결 상태를 확인해 주세요.</p>
        <p className="mt-2 text-xs text-muted">{message}</p>
      </section>
    </main>
  );
}

export default async function StudentDetailPage({ params }: PageProps) {
  const studentId = Number(params.id);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    return <NotFoundState />;
  }

  try {
    const result = await getTeacherStudentDetail(studentId);
    if (result.status === 404 || !result.data) {
      return <NotFoundState />;
    }

    const data = result.data;

    return (
      <main className="space-y-6">
        <section className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {displayValue(data.class_name)}
              </p>
              <h1 className="mt-1 text-[2rem] font-extrabold tracking-tight text-text sm:text-[2.3rem]">
                {displayValue(data.name)}
              </h1>
              <p className="mt-1 text-sm text-muted">
                학생 코드 {displayValue(data.student_code)} · 학생 ID {data.student_id}
              </p>
            </div>
            <Link
              href="/dashboard/students"
              className="inline-flex rounded-full border border-border bg-soft px-4 py-2 text-xs font-semibold text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
            >
              ← 학생 목록
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailField label="name" value={displayValue(data.name)} />
            <DetailField label="student_code" value={displayValue(data.student_code)} />
            <DetailField label="school_name" value={displayValue(data.school_name)} />
            <DetailField label="grade" value={toDisplayGrade(data.grade)} />
            <DetailField label="status" value={toDisplayStatus(data.status)} />
            <DetailField label="class_name" value={displayValue(data.class_name)} />
            <DetailField label="current_score" value={displayValue(data.current_score)} />
            <DetailField label="recent_progress_unit" value={displayValue(data.recent_progress_unit)} />
            <DetailField label="recent_tag" value={displayValue(data.recent_tag)} />
            <DetailField label="goal_score" value={displayValue(data.goal_score)} />
            <DetailField label="study_goal" value={displayValue(data.study_goal)} />
            <DetailField label="studyti_summary" value={displayValue(data.studyti_summary)} />
            <DetailField label="weak_topics" value={formatWeakTopics(data.weak_topics)} />
            <DetailField label="studyti_tags" value={formatStudytiTags(data.studyti_tags)} />
            <DetailField label="latest_feedback" value={displayValue(data.latest_feedback)} />
            <DetailField label="latest_next_action" value={displayValue(data.latest_next_action)} />
            <DetailField label="next_exam_date" value={displayValue(data.next_exam_date)} />
            <DetailField label="exam_readiness" value={displayValue(data.exam_readiness)} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    return <ErrorState message={error instanceof Error ? error.message : "unknown error"} />;
  }
}
