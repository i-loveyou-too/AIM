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
  const { status, isAuthenticated, user } = useAuth();

  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/student/login";
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

  const greetingName = user?.greeting_name ?? user?.display_name ?? user?.username ?? null;
  const resolvedProfile = user
    ? {
        name: user.header_name ?? (greetingName ? `${greetingName} 선생님` : profile.name),
        role: user.role_label ?? profile.role,
        initials: user.initials ?? profile.initials,
      }
    : profile;
  const resolvedGreeting = greetingName ? `${greetingName} 선생님, 안녕하세요! 👋` : greeting;

  return (
    <div className="min-h-screen bg-clean-dots">
      <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col gap-5 overflow-x-clip px-4 pt-7 pb-4 sm:px-6 sm:pt-9 sm:pb-5 lg:flex-row lg:gap-6 lg:px-8 lg:pt-14 lg:pb-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-7 lg:gap-8">
          <AppHeader title={title} greeting={resolvedGreeting} profile={resolvedProfile} />
          <main className="min-w-0 flex-1 pb-10 lg:pb-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
