import { getTeacherAssignmentsOverview } from "@/lib/api/teacher";
import { AssignmentsPageContent } from "@/components/assignments/assignments-page-content";
import { FeatureComingSoon } from "@/components/common/feature-coming-soon";

type ViewTab = "class" | "student" | "unsubmitted" | "dueToday";

const VALID_TABS: ViewTab[] = ["class", "student", "unsubmitted", "dueToday"];

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tabParamRaw = searchParams?.tab;
  const tabParam = Array.isArray(tabParamRaw) ? tabParamRaw[0] : tabParamRaw;
  const initialTab: ViewTab = tabParam && VALID_TABS.includes(tabParam as ViewTab) ? (tabParam as ViewTab) : "class";

  let data: any = null;
  try {
    data = await getTeacherAssignmentsOverview();
  } catch {
    data = null;
  }

  if (data === null) {
    return (
      <main className="space-y-6">
        <FeatureComingSoon
          title="기능 준비중"
          description="과제 관리 데이터 연동이 아직 완료되지 않았습니다. SQL/VIEW 반영 후 활성화됩니다."
        />
      </main>
    );
  }

  return <AssignmentsPageContent initialTab={initialTab} data={data} />;
}
