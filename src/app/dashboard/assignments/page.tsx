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

  let data: any = null;
  try {
    data = await getTeacherAssignmentsOverview();
  } catch {
    data = null;
  }

  return <AssignmentsPageContent initialTab={initialTab} data={data} />;
}
