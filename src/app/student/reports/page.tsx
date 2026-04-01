import { FeatureComingSoon } from "@/components/common/feature-coming-soon";
import { StudentHeader } from "@/components/student/student-header";

export default function StudentReportsPage() {
  return (
    <>
      <StudentHeader title="내 리포트" />
      <div className="space-y-4 px-4 py-5">
        <FeatureComingSoon
          title="기능 준비중"
          description="학생 상세 리포트 화면은 DB 리포트 데이터 확정 후 활성화됩니다."
        />
      </div>
    </>
  );
}
