"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";

type AppHeaderProps = {
  title: string;
  greeting: string;
  profile: {
    name: string;
    role: string;
    initials: string;
  };
};

export function AppHeader({ title, greeting, profile }: AppHeaderProps) {
  const pathname = usePathname();
  const isStudentPage = pathname.startsWith("/dashboard/students");

  // 학생 페이지는 상단 검색 바와 알림/프로필 중심으로 보여줍니다.
  if (isStudentPage) {
    return (
      <header className="px-1 py-1 sm:px-2">
        <div className="rounded-[28px] border border-border/80 bg-white/85 px-4 py-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex items-center gap-3 rounded-full border border-border bg-soft px-4 py-3 shadow-sm xl:min-w-[420px] xl:max-w-[560px]">
              <span className="text-lg text-muted">🔎</span>
              <input
                type="search"
                placeholder="학생 이름을 검색하세요"
                className="w-full bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted/70"
              />
            </label>

            <div className="flex items-center gap-2 self-end xl:self-auto">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="알림"
              >
                🔔
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition hover:border-brand/30 hover:text-brand"
                aria-label="도움말"
              >
                ?
              </button>

              <div className="ml-1 flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-soft">
                  {profile.initials}
                </div>
                <div className="pr-1">
                  <p className="text-sm font-semibold text-text">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return <Header title={title} greeting={greeting} profile={profile} />;
}
