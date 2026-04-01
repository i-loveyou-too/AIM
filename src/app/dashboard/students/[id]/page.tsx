import type { Metadata } from "next";
import Link from "next/link";
import { StudentAssignmentSection } from "@/components/students/student-assignment-section";
import { StudentAssignmentInsightSection } from "@/components/students/student-assignment-insight-section";
import { StudentAiInsightSection } from "@/components/students/student-ai-insight-section";
import { StudentDetailHeader } from "@/components/students/student-detail-header";
import { StudentExamSection } from "@/components/students/student-exam-section";
import { StudentFeedbackSection } from "@/components/students/student-feedback-section";
import { StudentProgressSection } from "@/components/students/student-progress-section";
import { StudentStatusCards } from "@/components/students/student-status-cards";
import { StudentWeaknessSection } from "@/components/students/student-weakness-section";
import { getTeacherStudentDetail } from "@/lib/api/teacher";
import { toStudentDetailData } from "@/lib/services/student-detail.service";

type PageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "학생 상세 | Aim ON",
  description: "학생 진도, 과제, 시험 준비 상태를 한 화면에서 확인합니다.",
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

    const detail = toStudentDetailData(result.data);

    return (
      <main className="space-y-6">
        <StudentDetailHeader detail={detail} />
        <StudentStatusCards cards={detail.sectionCards} />
        <StudentProgressSection detail={detail} />
        <StudentAiInsightSection detail={detail} />
        <StudentExamSection detail={detail} />
        <StudentAssignmentSection detail={detail} />
        <StudentAssignmentInsightSection detail={detail} />
        <StudentWeaknessSection detail={detail} />
        <StudentFeedbackSection detail={detail} />
      </main>
    );
  } catch (error) {
    return <ErrorState message={error instanceof Error ? error.message : "unknown error"} />;
  }
}
