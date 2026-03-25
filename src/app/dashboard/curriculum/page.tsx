import type { Metadata } from "next";
import { CurriculumExamCalendar } from "@/components/curriculum/curriculum-exam-calendar";
import { CurriculumNextActions } from "@/components/curriculum/curriculum-next-actions";
import { CurriculumPageHeader } from "@/components/curriculum/curriculum-page-header";
import { CurriculumPlanVsActualSection } from "@/components/curriculum/curriculum-plan-vs-actual-section";
import { CurriculumPlanningNotesSection } from "@/components/curriculum/curriculum-planning-notes-section";
import { CurriculumRoadmapBoard } from "@/components/curriculum/curriculum-roadmap-board";
import { CurriculumRiskSection } from "@/components/curriculum/curriculum-risk-section";
import { CurriculumReversePlanSection } from "@/components/curriculum/curriculum-reverse-plan-section";
import { CurriculumSummaryCards } from "@/components/curriculum/curriculum-summary-cards";
import { curriculumPageData } from "@/lib/curriculum-mock-data";

export const metadata: Metadata = {
  title: "계획 / 커리큘럼 | Aim ON",
  description: "시험일까지 역산한 학습 계획, 현재 진도 비교, 위험 단원과 다음 수업 액션을 확인합니다.",
};

export default function CurriculumPage() {
  return (
    <main className="space-y-6">
      <CurriculumPageHeader overview={curriculumPageData.overview} />

      <CurriculumSummaryCards cards={curriculumPageData.summaryCards} />

      <div className="grid gap-6 xl:grid-cols-2">
        <CurriculumReversePlanSection reversePlan={curriculumPageData.reversePlan} />
        <CurriculumExamCalendar calendar={curriculumPageData.calendar} />
      </div>

      <CurriculumPlanVsActualSection comparison={curriculumPageData.comparison} />

      <CurriculumRoadmapBoard roadmap={curriculumPageData.roadmap} />

      <CurriculumNextActions nextActions={curriculumPageData.nextActions} />

      <CurriculumRiskSection risks={curriculumPageData.risks} />

      <CurriculumPlanningNotesSection notes={curriculumPageData.notes} />
    </main>
  );
}
