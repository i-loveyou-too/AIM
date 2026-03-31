"use client";

// 리포트 허브 메인 탭 컨테이너 (client component)
// URL ?tab= 파라미터로 탭 상태를 관리해 사이드바 직접 링크 진입 가능

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { StudentReportHub } from "@/components/reports/student-report-hub";
import { ClassReportHub } from "@/components/reports/class-report-hub";
import { ExamReadinessHub } from "@/components/reports/exam-readiness-hub";
import { PeriodReportHub } from "@/components/reports/period-report-hub";

type TabKey = "student" | "class" | "exam" | "period";

const VALID_TABS: TabKey[] = ["student", "class", "exam", "period"];

const TABS: { key: TabKey; label: string; description: string; emoji: string }[] = [
  { key: "student", label: "학생별 리포트",   description: "학생 리포트 인덱스 허브", emoji: "👤" },
  { key: "class",   label: "반별 리포트",     description: "반 단위 운영 분석",       emoji: "🏫" },
  { key: "exam",    label: "시험 대비 리포트", description: "준비도 · 위험도 분석",    emoji: "📅" },
  { key: "period",  label: "기간별 리포트",   description: "추이 · 변화 분석",        emoji: "📈" },
];

type Props = {
  data: {
    studentReports: any[];
    classReports: any[];
    examReadinessStudents: any[];
    examReadinessClasses: any[];
    periodReports: Record<string, any>;
  };
};

export function ReportHubTabs({ data }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "student";

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) return;
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="space-y-5">
      {/* 탭 내비게이션 */}
      <div className="rounded-[20px] border border-border/80 bg-white p-1.5 shadow-soft">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`flex flex-col items-center gap-1 rounded-[14px] px-3 py-3 transition duration-200 ${
                  isActive
                    ? "bg-brand text-white shadow-soft"
                    : "text-muted hover:bg-soft hover:text-text"
                }`}
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span className="text-xs font-bold leading-tight">{tab.label}</span>
                <span className={`text-[10px] leading-tight ${isActive ? "text-white/70" : "text-muted/70"}`}>
                  {tab.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === "student" && <StudentReportHub data={data.studentReports} />}
        {activeTab === "class"   && <ClassReportHub data={data.classReports} />}
        {activeTab === "exam"    && (
          <ExamReadinessHub
            studentData={data.examReadinessStudents}
            classData={data.examReadinessClasses}
          />
        )}
        {activeTab === "period"  && <PeriodReportHub data={data.periodReports} />}
      </div>
    </div>
  );
}
