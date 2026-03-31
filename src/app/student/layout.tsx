import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StudentBottomNav } from "@/components/student/student-bottom-nav";

export const metadata: Metadata = {
  title: "Aim ON | 학생",
  description: "Aim ON 학생용 앱",
};

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-soft pb-16">
      <main className="mx-auto max-w-lg">{children}</main>
      <StudentBottomNav />
    </div>
  );
}
