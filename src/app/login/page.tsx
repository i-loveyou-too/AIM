import type { Metadata } from "next";
import { Suspense } from "react";
import { InstructorLoginPage } from "@/components/auth/instructor-login-page";

export const metadata: Metadata = {
  title: "교사용 로그인 | Aim ON",
  description: "Aim ON 교사용 로그인 페이지",
};

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] text-sm font-medium text-muted">
      로그인 화면을 불러오는 중입니다...
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <InstructorLoginPage />
    </Suspense>
  );
}
