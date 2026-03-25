import type { Metadata } from "next";
import { CurriculumContent } from "@/components/curriculum/curriculum-content";

export const metadata: Metadata = {
  title: "계획 / 커리큘럼 | Aim ON",
  description: "시험일까지 역산한 학습 계획, 현재 진도 비교, 위험 단원과 다음 수업 액션을 확인합니다.",
};

export default function CurriculumPage() {
  return (
    <main>
      <CurriculumContent />
    </main>
  );
}
