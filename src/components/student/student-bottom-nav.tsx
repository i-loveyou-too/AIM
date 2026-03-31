"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/student", label: "홈", icon: "🏠" },
  { href: "/student/tasks", label: "과제", icon: "📋" },
  { href: "/student/submissions", label: "제출", icon: "📤" },
  { href: "/student/reports", label: "리포트", icon: "📊" },
  { href: "/student/coach", label: "AI코치", icon: "🤖" },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white">
      <ul className="flex h-16 items-stretch">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  isActive ? "text-brand" : "text-muted"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
