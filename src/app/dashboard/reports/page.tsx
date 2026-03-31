import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportHubHeader } from "@/components/reports/report-hub-header";
import { ReportHubSummaryCards } from "@/components/reports/report-hub-summary-cards";
import { ReportHubTabs } from "@/components/reports/report-hub-tabs";
import { getTeacherReportsOverview } from "@/lib/api/teacher";

export const metadata: Metadata = {
  title: "리포트 | Aim ON",
  description:
    "학생별, 반별, 시험 대비, 기간별 리포트를 모아서 학습 상태와 운영 흐름을 분석하는 허브 화면입니다.",
};

export default async function ReportsPage() {
  let data: any = null;
  try {
    data = await getTeacherReportsOverview();
  } catch {
    data = null;
  }

  const safeData = data ?? {
    summaryCards: [],
    studentReports: [],
    classReports: [],
    examReadinessStudents: [],
    examReadinessClasses: [],
    periodReports: {},
  };

  return (
    <main className="space-y-6">
      {/* 페이지 헤더 */}
      <ReportHubHeader />

      {/* 상단 요약 카드 6개 */}
      <ReportHubSummaryCards cards={safeData.summaryCards} />

      {/* 메인 탭: 학생별 / 반별 / 시험 대비 / 기간별 */}
      <Suspense fallback={<div className="h-14 rounded-[20px] border border-border/70 bg-white/70" />}>
        <ReportHubTabs data={safeData} />
      </Suspense>
    </main>
  );
}
