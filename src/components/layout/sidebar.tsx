"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sidebarMenu, sidebarNotice } from "@/lib/mock-data/index";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full lg:w-72 lg:shrink-0">
      <div className="mb-4 hidden items-center gap-3 rounded-[26px] border border-border/80 bg-white/80 px-4 py-4 shadow-soft lg:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-border">
          <Image
            src="/aim-on-logo.png"
            alt="에임 온 로고"
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            priority
          />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-brand">
            에임 온
          </p>
          <p className="mt-1 text-sm text-muted">교사용 운영 대시보드</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        <div className="mr-2 flex items-center gap-3 rounded-full border border-border bg-white/80 px-3 py-2 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-border">
            <Image
              src="/aim-on-logo.png"
              alt="에임 온 로고"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
          </div>
          <div className="pr-1">
            <p className="text-xs font-semibold text-brand">에임 온</p>
            <p className="text-[11px] text-muted">교사용 대시보드</p>
          </div>
        </div>
        {sidebarMenu.map((item) => {
          const isActive = Boolean(item.href && pathname === item.href);
          const mobileItem = (
            <div
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium ${
                isActive
                  ? "border-brand bg-brand text-white"
                  : item.href
                    ? "border-border bg-white/70 text-muted"
                    : "border-border bg-white/50 text-muted/60"
              }`}
            >
              {item.label}
            </div>
          );

          return item.href ? (
            <Link key={item.label} href={item.href} className="block">
              {mobileItem}
            </Link>
          ) : (
            <div key={item.label}>{mobileItem}</div>
          );
        })}
      </div>

      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] flex-col rounded-[30px] border border-border/80 bg-white/80 p-5 shadow-soft backdrop-blur lg:flex">
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {sidebarMenu.map((item) => {
            const isActive = Boolean(item.href && pathname === item.href);
            const isEnabled = Boolean(item.href);

            const navItem = (
              <div
                className={`group flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                  isActive
                    ? "border-brand/20 bg-brand text-white shadow-soft"
                    : isEnabled
                      ? "border-transparent bg-transparent text-text hover:border-border hover:bg-background/80"
                      : "border-transparent bg-transparent text-text/45"
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isEnabled
                        ? "bg-white text-muted shadow-sm"
                        : "bg-white/70 text-muted/70 shadow-sm"
                  }`}
                >
                  {isActive ? "현재" : isEnabled ? "이동" : "준비 중"}
                </span>
              </div>
            );

            return item.href ? (
              <Link key={item.label} href={item.href} className="block">
                {navItem}
              </Link>
            ) : (
              <div key={item.label}>{navItem}</div>
            );
          })}
        </nav>

        <div className="rounded-3xl border border-brand/15 bg-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            운영 메모
          </p>
          <p className="mt-3 text-sm leading-6 text-text">{sidebarNotice}</p>
        </div>
      </aside>
    </div>
  );
}
