"use client";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { ChevronUp } from "@/assets/icon/NavIcons";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { routes } from "@/constants/routes";
import { UserInfo } from "@/components/Layouts/header/user-info";
import { CollapsedUserInfo } from "@/components/Layouts/header/user-info/collapsed";

function useBelowLg() {
  const [isBelowLg, setIsBelowLg] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsBelowLg(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return isBelowLg;
}

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, toggleSidebar } = useSidebarContext();
  const isBelowLg = useBelowLg();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const collapsed = !isOpen;

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  useEffect(() => {
    NAV_DATA.some((section) =>
      section.items.some((item) =>
        item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              setExpandedItems((prev) => [...prev, item.title]);
            }
            return true;
          }
        })
      )
    );
  }, [pathname]);

  // Mobile: fixed overlay drawer
  if (isBelowLg) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Collapsed rail — always visible on mobile, triggers open */}
        <div className="sticky top-0 h-screen w-14 shrink-0 flex flex-col items-center border-r border-border bg-surface-card py-4 gap-2">
          <button
            onClick={toggleSidebar}
            title="Open sidebar"
            className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors mb-2"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
          {NAV_DATA.flatMap((s) => s.items).map((item) => {
            const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url! + "/"));
            return (
              <Link
                key={item.title}
                href={item.url ?? item.items[0]?.url ?? "#"}
                title={item.title}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                  isActive
                    ? "bg-[rgba(54,101,214,0.1)] text-[#3665D6]"
                    : "text-dark-4 hover:bg-gray-100 hover:text-gray-800"
                )}
              >
                <item.icon className="size-5 shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Drawer */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-screen w-[260px] z-50 border-r border-border bg-surface-card transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Main navigation"
        >
          <div className="flex h-full flex-col">

            {/* Logo row */}
            <div className="relative flex h-[72px] items-center justify-center border-b border-border">
              <Link href={routes.dashboard} onClick={() => setIsOpen(false)}>
                <Logo />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {NAV_DATA.map((section) => (
                <div key={section.label}>
                  {section.label && (
                    <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted">
                      {section.label}
                    </p>
                  )}
                  <nav>
                    <ul className="space-y-0.5">
                      {section.items.map((item) => (
                        <li key={item.title}>
                          {item.items.length ? (
                            <div>
                              <MenuItem
                                isActive={item.items.some(({ url }) => url === pathname)}
                                onClick={(e) => { e.preventDefault(); toggleExpanded(item.title); }}
                              >
                                <item.icon className="size-5 shrink-0" />
                                <span>{item.title}</span>
                                <ChevronUp className={cn("ml-auto rotate-180 transition-transform duration-200", expandedItems.includes(item.title) && "rotate-0")} />
                              </MenuItem>
                              {expandedItems.includes(item.title) && (
                                <ul className="ml-8 mt-0.5 space-y-0.5">
                                  {item.items.map((subItem) => (
                                    <li key={subItem.title}>
                                      <MenuItem
                                        as="link"
                                        href={subItem.url}
                                        isActive={pathname === subItem.url}
                                        onClick={() => setIsOpen(false)}
                                      >
                                        <span>{subItem.title}</span>
                                      </MenuItem>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <MenuItem
                              as="link"
                              href={item.url!}
                              isActive={pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url! + "/"))}
                              onClick={() => setIsOpen(false)}
                            >
                              <item.icon className="size-5 shrink-0" />
                              <span>{item.title}</span>
                            </MenuItem>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              ))}
            </div>

            {/* Bottom profile */}
            <div className="border-t border-border px-2 py-3">
              <UserInfo />
            </div>

          </div>
        </aside>
      </>
    );
  }

  // Desktop: inline collapsible rail
  return (
    <aside
      style={{ width: collapsed ? 56 : 260 }}
      className="sticky top-0 h-screen shrink-0 border-r border-border bg-surface-card overflow-hidden transition-[width] duration-300 ease-in-out"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col w-full">

        {/* Logo row */}
        <div className="relative flex h-[72px] items-center border-b border-border">
          <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-150", collapsed ? "opacity-0 pointer-events-none" : "opacity-100 delay-150")}>
            <Link href={routes.dashboard}>
              <Logo />
            </Link>
          </div>
          <div className={cn("absolute right-3 transition-opacity duration-150", collapsed ? "opacity-0 pointer-events-none" : "opacity-100 delay-150")}>
            <button onClick={toggleSidebar} title="Collapse sidebar" className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors">
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
          <div
            className={cn("absolute left-0 flex items-center justify-center transition-opacity duration-150", collapsed ? "opacity-100 delay-150" : "opacity-0 pointer-events-none")}
            style={{ width: 56 }}
          >
            <button onClick={toggleSidebar} title="Expand sidebar" className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors">
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {NAV_DATA.map((section) => (
            <div key={section.label}>
              {section.label && !collapsed && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted transition-opacity duration-150">
                  {section.label}
                </p>
              )}
              <nav className={cn(collapsed ? "px-2" : "px-3")}>
                <ul className={cn("space-y-0.5", collapsed && "space-y-2")}>
                  {section.items.map((item) => {
                    const isActive = item.items.length
                      ? item.items.some(({ url }) => url === pathname)
                      : pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url! + "/"));

                    if (collapsed) {
                      return (
                        <li key={item.title}>
                          <Link
                            href={item.url ?? item.items[0]?.url ?? "#"}
                            title={item.title}
                            className={cn(
                              "flex items-center justify-center w-full rounded-lg py-3 transition-colors",
                              isActive
                                ? "bg-[rgba(54,101,214,0.1)] text-[#3665D6]"
                                : "text-dark-4 hover:bg-gray-100 hover:text-gray-800"
                            )}
                          >
                            <item.icon className="size-5 shrink-0" />
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={isActive}
                              onClick={(e) => { e.preventDefault(); toggleExpanded(item.title); }}
                            >
                              <item.icon className="size-5 shrink-0" />
                              <span>{item.title}</span>
                              <ChevronUp className={cn("ml-auto rotate-180 transition-transform duration-200", expandedItems.includes(item.title) && "rotate-0")} />
                            </MenuItem>
                            {expandedItems.includes(item.title) && (
                              <ul className="ml-8 mt-0.5 space-y-0.5">
                                {item.items.map((subItem) => (
                                  <li key={subItem.title}>
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <MenuItem
                            as="link"
                            href={item.url!}
                            isActive={isActive}
                          >
                            <item.icon className="size-5 shrink-0" />
                            <span>{item.title}</span>
                          </MenuItem>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom profile */}
        <div className="relative border-t border-border py-3" style={{ minHeight: 100 }}>
          <div
            className={cn("absolute inset-y-3 left-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-150", collapsed ? "opacity-100 delay-150" : "opacity-0 pointer-events-none")}
            style={{ width: 56 }}
          >
            <CollapsedUserInfo />
          </div>
          <div className={cn("px-2 transition-opacity duration-150", collapsed ? "opacity-0 pointer-events-none" : "opacity-100 delay-150")}>
            <UserInfo />
          </div>
        </div>

      </div>
    </aside>
  );
}
