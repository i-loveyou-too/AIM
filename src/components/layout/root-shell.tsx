"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
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
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <main className="min-h-screen bg-[#f6f6f8]">{children}</main>;
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
