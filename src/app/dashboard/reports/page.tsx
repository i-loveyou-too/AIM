import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportHubHeader } from "@/components/reports/report-hub-header";
import { ReportHubSummaryCards } from "@/components/reports/report-hub-summary-cards";
import { ReportHubTabs } from "@/components/reports/report-hub-tabs";
import { loadTeacherReportsPageData } from "@/lib/services/teacher.service";

export const metadata: Metadata = {
  title: "리포트 | Aim ON",
  description:
    "학생별, 반별, 시험 대비, 기간별 리포트를 모아서 학습 상태와 운영 흐름을 분석하는 허브 화면입니다.",
};

export default async function ReportsPage() {
  const { overview, loadFailed } = await loadTeacherReportsPageData();

  if (loadFailed) {
    return (
      <main className="space-y-6">
        <ReportHubHeader />
        <section className="rounded-[24px] border border-[#f6cfcf] bg-[#fff7f7] px-6 py-5">
          <p className="text-sm font-bold text-[#9f3d3d]">리포트 데이터를 불러오지 못했습니다.</p>
          <p className="mt-1 text-sm text-[#9f3d3d]">
            `/api/teacher/reports/overview` 응답 상태를 확인한 뒤 다시 새로고침해 주세요.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      {/* 페이지 헤더 */}
      <ReportHubHeader />

      {/* 상단 요약 카드 6개 */}
      <ReportHubSummaryCards cards={overview.summaryCards} />

      {/* 메인 탭: 학생별 / 반별 / 시험 대비 / 기간별 */}
      <Suspense fallback={<div className="h-14 rounded-[20px] border border-border/70 bg-white/70" />}>
        <ReportHubTabs data={overview} />
      </Suspense>
    </main>
  );
}
