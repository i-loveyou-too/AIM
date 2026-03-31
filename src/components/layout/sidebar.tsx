"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sidebarMenu, sidebarNotice, type SidebarMenuItem } from "@/lib/layout-config";

function isChildHrefActive(
  href: string,
  pathname: string,
): boolean {
  const [pathWithQuery] = href.split("#");
  const [targetPath] = pathWithQuery.split("?");
  if (pathname !== targetPath) return false;
  return true;
}

// 상위 메뉴가 활성 상태인지 판단 (자신 경로 or 하위 메뉴 경로 포함)
function isMenuActive(
  item: SidebarMenuItem,
  pathname: string,
): boolean {
  if (item.href && pathname === item.href) return true;
  if (item.children) {
    return item.children.some((c) => isChildHrefActive(c.href, pathname));
  }
  return false;
}

// 데스크탑 아코디언 사이드바 아이템
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
      {/* 상위 메뉴 행 */}
      {isEnabled ? (
        <Link
          href={item.href!}
          onClick={hasChildren ? onToggle : undefined}
          className={`group flex w-full items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 transition ${
            active
              ? "border-brand/20 bg-brand text-white shadow-soft"
              : "border-transparent bg-transparent text-text hover:border-border hover:bg-background/80"
          }`}
        >
          <span className="text-base leading-none">{item.emoji}</span>
          <span className="flex-1 text-sm font-medium">{item.label}</span>
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
        <div className="flex items-center gap-2.5 rounded-2xl border border-transparent px-3.5 py-2.5 text-text/45">
          <span className="text-base leading-none">{item.emoji}</span>
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-muted/70 shadow-sm">
            준비 중
          </span>
        </div>
      )}

      {/* 하위 메뉴 (아코디언) */}
      {hasChildren && isOpen && (
        <ul className="mt-1 ml-3 space-y-0.5 border-l-2 border-brand/15 pl-3">
          {item.children!.map((child) => {
            const isChildActive = isChildHrefActive(child.href, pathname);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition ${
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
                  {child.label}
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

  // 현재 경로에 해당하는 메뉴를 초기 열림 상태로
  const initialOpen =
    sidebarMenu.find((item) => item.children?.length && isMenuActive(item, pathname))?.label ?? null;
  const [openKey, setOpenKey] = useState<string | null>(initialOpen);

  function handleToggle(label: string) {
    setOpenKey((prev) => (prev === label ? null : label));
  }

  return (
    <div className="w-full lg:w-72 lg:shrink-0">
      {/* 데스크탑 로고 (aside 바깥) */}
      <div className="mb-4 hidden items-center gap-3 rounded-[26px] border border-border/80 bg-white/80 px-4 py-4 shadow-soft lg:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-border">
          <Image
            src="/aim-on-logo.png"
            alt="Aim ON 로고"
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            priority
          />
        </div>
        <div>
          <p className="text-[1.95rem] font-black leading-none tracking-[-0.02em]">
            <span className="text-[#f07a86]">Aim</span>{" "}
            <span className="text-[#eb5f74]">ON</span>
          </p>
          <p className="mt-2 text-sm text-muted">교사용 운영 대시보드</p>
        </div>
      </div>

      {/* 모바일: 가로 스크롤 칩 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        <div className="mr-2 flex items-center gap-3 rounded-full border border-border bg-white/80 px-3 py-2 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-border">
            <Image
              src="/aim-on-logo.png"
              alt="Aim ON 로고"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
          </div>
          <div className="pr-1">
            <p className="text-base font-black leading-none tracking-[-0.01em]">
              <span className="text-[#f07a86]">Aim</span>{" "}
              <span className="text-[#eb5f74]">ON</span>
            </p>
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
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true">{item.emoji}</span>
                <span>{item.label}</span>
              </span>
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

      {/* 데스크탑: 아코디언 사이드바 */}
      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] flex-col rounded-[30px] border border-border/80 bg-white/80 p-5 shadow-soft backdrop-blur lg:flex">
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

        <div className="mt-4 rounded-3xl border border-brand/15 bg-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            운영 메모
          </p>
          <p className="mt-3 text-sm leading-6 text-text">{sidebarNotice}</p>
        </div>
      </aside>
    </div>
  );
}
