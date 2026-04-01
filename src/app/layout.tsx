import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/layout/sidebar";
import { getTeacherProfile } from "@/lib/api/teacher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aim ON | 교사용 대시보드",
  description: "Aim ON 교사용 대시보드 MVP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  let profile: { name: string; role: string; initials: string } = {
    name: "김민정 선생님",
    role: "교사용 관리자",
    initials: "김",
  };

  try {
    const teacher = await getTeacherProfile();
    profile = {
      name: teacher?.header?.name ?? profile.name,
      role: teacher?.header?.role ?? profile.role,
      initials: teacher?.header?.initials ?? profile.initials,
    };
  } catch {
    // fallback profile 유지
  }

  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-clean-dots">
          <div className="mx-auto flex min-h-screen max-w-[1480px] gap-5 px-3 py-3 sm:px-5 lg:px-6">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <AppHeader
                title="오늘도 학생들의 흐름을 안정적으로 정리해볼까요?"
                greeting="김민정 선생님, 안녕하세요! 👋"
                profile={profile}
              />
              <main className="min-w-0 flex-1 pb-6">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
