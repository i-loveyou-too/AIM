import type { Metadata } from "next";
import { CurriculumContent } from "@/components/curriculum/curriculum-content";
import { getTeacherCurriculumOverview } from "@/lib/api/teacher";

export const metadata: Metadata = {
  title: "계획 / 커리큘럼 | Aim ON",
  description: "시험일까지 역산한 학습 계획, 현재 진도 비교, 위험 단원과 다음 수업 액션을 확인합니다.",
};

type CurriculumClassItem = {
  id: string;
  label: string;
  grade: string;
  subject: string;
  data: unknown;
};

type TeacherCurriculumOverview = {
  classes?: CurriculumClassItem[];
};

export default async function CurriculumPage() {
  let classes: CurriculumClassItem[] = [];
  let hasLoadError = false;

  try {
    const overview = (await getTeacherCurriculumOverview()) as TeacherCurriculumOverview;
    if (Array.isArray(overview?.classes)) {
      classes = overview.classes;
    }
  } catch {
    hasLoadError = true;
  }

  return (
    <main>
      <CurriculumContent classes={classes} hasLoadError={hasLoadError} />
    </main>
  );
}
