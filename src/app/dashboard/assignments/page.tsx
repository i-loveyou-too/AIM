import { getTeacherAssignmentsOverview } from "@/lib/api/teacher";
import { AssignmentsPageContent } from "@/components/assignments/assignments-page-content";

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

  let data: unknown = null;
  try {
    data = await getTeacherAssignmentsOverview();
  } catch {
    data = null;
  }

  if (data === null) {
    return (
      <main className="space-y-6">
        <section className="rounded-[24px] border border-[#f6cfcf] bg-[#fff7f7] px-6 py-5">
          <p className="text-sm font-bold text-[#9f3d3d]">과제 관리 데이터를 불러오지 못했습니다.</p>
          <p className="mt-1 text-sm text-[#9f3d3d]">
            `/api/teacher/assignments/overview` 응답 상태를 확인한 뒤 다시 새로고침해 주세요.
          </p>
        </section>
      </main>
    );
  }

  return <AssignmentsPageContent initialTab={initialTab} data={data} />;
}
