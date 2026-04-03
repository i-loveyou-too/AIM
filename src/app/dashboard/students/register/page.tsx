import { StudentRegisterFormV2 } from "@/components/students/student-register-form-v2";

export default function StudentRegisterPage() {
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="rounded-[28px] border border-border/80 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
            STUDENT MANAGEMENT
          </span>
          <h2 className="text-[1.3rem] font-extrabold tracking-tight text-text sm:text-[1.5rem]">
            학생 등록
          </h2>
          <p className="text-sm leading-6 text-muted">
            학생 기본 정보를 입력하고 학원/반에 연결합니다. 모든 정보는 관리자 승인 후 즉시 반영됩니다.
          </p>
        </div>
      </div>

      {/* Form */}
      <StudentRegisterFormV2 />
    </div>
  );
}
