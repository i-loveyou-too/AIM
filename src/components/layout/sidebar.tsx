"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { sidebarMenu, sidebarNotice, type SidebarMenuItem } from "@/lib/layout-config";

function isChildHrefActive(href: string, pathname: string): boolean {
  const [pathWithHashRemoved] = href.split("#");
  const [targetPath] = pathWithHashRemoved.split("?");
  return pathname === targetPath;
}

function isMenuActive(item: SidebarMenuItem, pathname: string): boolean {
  if (item.href && pathname === item.href) return true;
  if (item.children) {
    return item.children.some((child) => isChildHrefActive(child.href, pathname));
  }
  return false;
}

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <>
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function BrandCardLink({
  href,
  isCurrent,
  compact = false,
}: {
  href: string;
  isCurrent: boolean;
  compact?: boolean;
}) {
  const sizeClass = compact ? "h-9 w-9 p-1" : "h-10 w-10 p-1.5";
  const textWrapClass = compact ? "min-w-0 pr-1" : "min-w-0";
  const wrapperClassName = compact
    ? `flex min-w-0 flex-1 items-center gap-2.5 rounded-[20px] border bg-white/88 px-3 py-2.5 shadow-sm outline-none transition duration-200 ${
        isCurrent
          ? "cursor-default border-brand/20"
          : "cursor-pointer border-border hover:border-brand/25 hover:bg-white focus-visible:border-brand/30 focus-visible:ring-2 focus-visible:ring-brand/15"
      }`
    : `mb-4 hidden items-center gap-3 rounded-[22px] border bg-white/80 px-4 py-4 shadow-soft outline-none transition duration-200 lg:flex ${
        isCurrent
          ? "cursor-default border-brand/20"
          : "cursor-pointer border-border/80 hover:-translate-y-0.5 hover:border-brand/25 hover:bg-white hover:shadow-[0_18px_40px_rgba(235,95,116,0.12)] focus-visible:border-brand/30 focus-visible:ring-2 focus-visible:ring-brand/15"
      }`;

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      onClick={isCurrent ? (event) => event.preventDefault() : undefined}
      className={wrapperClassName}
    >
      <div className={`flex shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-border ${sizeClass}`}>
        <Image
          src="/aim-on-logo.png"
          alt="Aim ON 로고"
          width={compact ? 28 : 40}
          height={compact ? 28 : 40}
          className={compact ? "h-7 w-7 object-contain" : "h-8 w-8 object-contain"}
          priority
        />
      </div>
      <div className={textWrapClass}>
        <p
          className={
            compact
              ? "whitespace-nowrap text-sm font-black leading-none tracking-[-0.01em]"
              : "text-[1.55rem] font-black leading-none tracking-[-0.02em]"
          }
        >
          <span className="text-[#f07a86]">Aim</span>{" "}
          <span className="text-[#eb5f74]">ON</span>
        </p>
        <p className={compact ? "truncate text-[11px] text-muted" : "mt-1.5 text-xs text-muted"}>
          교사용 운영 대시보드
        </p>
      </div>
    </Link>
  );
}

function AccordionItem({
  item,
  pathname,
  isOpen,
  onToggle,
}: {
  item: SidebarMenuItem;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const active = isMenuActive(item, pathname);
  const hasChildren = Boolean(item.children?.length);
  const isEnabled = Boolean(item.href);

  return (
    <li>
      {isEnabled ? (
        <Link
          href={item.href!}
          onClick={hasChildren ? onToggle : undefined}
          className={`group flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 transition ${
            active
              ? "border-brand/20 bg-brand text-white shadow-soft"
              : "border-transparent bg-transparent text-text hover:border-border hover:bg-background/80"
          }`}
        >
          <span className="text-sm leading-none">{item.emoji}</span>
          <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
          {!hasChildren && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                active ? "bg-white/20 text-white" : "bg-white text-muted shadow-sm"
              }`}
            >
              {active ? "현재" : "이동"}
            </span>
          )}
        </Link>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2.5 text-text/45">
          <span className="text-sm leading-none">{item.emoji}</span>
          <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-muted/70 shadow-sm">
            준비 중
          </span>
        </div>
      )}

      {hasChildren && isOpen && (
        <ul className="mt-1 ml-2.5 space-y-1 border-l-2 border-brand/15 pl-2.5">
          {item.children!.map((child) => {
            const isChildActive = isChildHrefActive(child.href, pathname);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
                    isChildActive
                      ? "font-bold text-brand"
                      : "font-medium text-muted hover:bg-soft hover:text-text"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      isChildActive ? "bg-brand" : "bg-border"
                    }`}
                  />
                  <span className="min-w-0">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dashboardHomeHref = sidebarMenu.find((item) => item.href === "/dashboard")?.href ?? "/dashboard";
  const isDashboardHome = pathname === dashboardHomeHref;

  const initialOpen = useMemo(
    () => sidebarMenu.find((item) => item.children?.length && isMenuActive(item, pathname))?.label ?? null,
    [pathname],
  );
  const [openKey, setOpenKey] = useState<string | null>(initialOpen);

  useEffect(() => {
    setOpenKey(initialOpen);
    setIsMobileMenuOpen(false);
  }, [initialOpen, pathname]);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    router.replace("/login");
    setIsLoggingOut(false);
  }

  function handleToggle(label: string) {
    setOpenKey((prev) => (prev === label ? null : label));
  }

  return (
    <div className="w-full lg:w-64 lg:shrink-0">
      <BrandCardLink href={dashboardHomeHref} isCurrent={isDashboardHome} />

      <div className="mb-4 lg:hidden">
        <div className="flex items-center gap-3">
          <BrandCardLink href={dashboardHomeHref} isCurrent={isDashboardHome} compact />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="teacher-mobile-nav"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-white/88 text-text shadow-sm transition hover:border-brand/25 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15"
          >
            <MenuToggleIcon open={isMobileMenuOpen} />
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div
            id="teacher-mobile-nav"
            className="mt-3 rounded-[24px] border border-border/80 bg-white/92 p-4 shadow-soft backdrop-blur"
          >
            <nav>
              <ul className="space-y-1.5">
                {sidebarMenu.map((item) => (
                  <AccordionItem
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    isOpen={openKey === item.label}
                    onToggle={() => handleToggle(item.label)}
                  />
                ))}
              </ul>
            </nav>

            <div className="mt-4 rounded-2xl border border-brand/15 bg-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">운영 메모</p>
              <p className="mt-2 text-xs leading-5 text-text">{sidebarNotice}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border bg-white text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : null}
      </div>

      <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] flex-col rounded-[26px] border border-border/80 bg-white/80 p-5 shadow-soft backdrop-blur lg:flex">
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarMenu.map((item) => (
              <AccordionItem
                key={item.label}
                item={item}
                pathname={pathname}
                isOpen={openKey === item.label}
                onToggle={() => handleToggle(item.label)}
              />
            ))}
          </ul>
        </nav>

        <div className="mt-4 rounded-2xl border border-brand/15 bg-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">운영 메모</p>
          <p className="mt-2.5 text-xs leading-5 text-text">{sidebarNotice}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-border bg-white text-sm font-semibold text-text shadow-sm transition hover:border-brand/30 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </aside>
    </div>
  );
}
