import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentAssignmentSection } from "@/components/students/student-assignment-section";
import { StudentAssignmentInsightSection } from "@/components/students/student-assignment-insight-section";
import { StudentAiInsightSection } from "@/components/students/student-ai-insight-section";
import { StudentDetailHeader } from "@/components/students/student-detail-header";
import { StudentExamSection } from "@/components/students/student-exam-section";
import { StudentFeedbackSection } from "@/components/students/student-feedback-section";
import { StudentProgressSection } from "@/components/students/student-progress-section";
import { StudentStatusCards } from "@/components/students/student-status-cards";
import { StudentWeaknessSection } from "@/components/students/student-weakness-section";
import { getStudentDetailById } from "@/lib/student-detail-mock-data";

type PageProps = {
  params: {
    id: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const detail = getStudentDetailById(params.id);

  if (!detail) {
    return {
      title: "학생 상세 | Aim ON",
    };
  }

  return {
    title: `${detail.student.name} 학생 상세 | Aim ON`,
    description: `${detail.student.name} 학생의 진도, 과제, 시험 준비 상태를 확인합니다.`,
  };
}

export default function StudentDetailPage({ params }: PageProps) {
  const detail = getStudentDetailById(params.id);

  if (!detail) {
    notFound();
  }

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
}
