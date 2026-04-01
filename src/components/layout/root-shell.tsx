"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/layout/sidebar";

type RootShellProps = {
  children: ReactNode;
  profile: {
    name: string;
    role: string;
    initials: string;
  };
  title: string;
  greeting: string;
};

export function RootShell({ children, profile, title, greeting }: RootShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, isAuthenticated } = useAuth();

  const isAuthPage = pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isCheckingAuth = isProtectedRoute && status === "loading";

  useEffect(() => {
    if (status === "loading") return;

    if (isAuthPage && isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    if (isProtectedRoute && !isAuthenticated) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [status, isAuthPage, isProtectedRoute, isAuthenticated, pathname, router]);

  if (isAuthPage) {
    return <main className="min-h-screen bg-[#f6f6f8]">{children}</main>;
  }

  if (isCheckingAuth || (isProtectedRoute && !isAuthenticated)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6f8]">
        <div className="rounded-2xl border border-border bg-white px-6 py-4 text-sm font-medium text-muted shadow-soft">
          인증 상태를 확인하는 중입니다...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-clean-dots">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <AppHeader title={title} greeting={greeting} profile={profile} />
          <main className="min-w-0 flex-1 pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
