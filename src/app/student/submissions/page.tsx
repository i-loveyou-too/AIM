import { FeatureComingSoon } from "@/components/common/feature-coming-soon";
import { StudentHeader } from "@/components/student/student-header";

export default function StudentSubmissionsPage() {
  return (
    <>
      <StudentHeader title="숙제 제출" />
      <div className="space-y-4 px-4 py-5">
        <FeatureComingSoon
          title="기능 준비중"
          description="학생 숙제 제출/제출 이력 화면은 DB/업로드 연동 이후 활성화됩니다."
        />
      </div>
    </>
  );
}
