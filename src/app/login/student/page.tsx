import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentLoginPage } from "@/components/auth/student-login-page";

export const metadata: Metadata = {
  title: "학생 로그인 | Aim ON",
  description: "Aim ON 학생 포털 로그인 페이지",
};

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] text-sm font-medium text-muted">
      로그인 화면을 불러오는 중입니다...
    </div>
  );
}

export default function StudentLoginRoute() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <StudentLoginPage />
    </Suspense>
  );
}
