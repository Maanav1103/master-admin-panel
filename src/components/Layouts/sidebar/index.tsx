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
import { X } from "lucide-react";
import { routes } from "@/constants/routes";

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
  const { setIsOpen, isOpen, toggleSidebar } = useSidebarContext();
  const isBelowLg = useBelowLg();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

  return (
    <>
      {/* Overlay on mobile */}
      {isBelowLg && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "w-[260px] shrink-0 border-r border-border bg-surface-card transition-transform duration-200 ease-linear",
          isBelowLg ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isBelowLg && !isOpen && "-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex items-center mx-auto px-5 py-5 border-border">
            <Link href={routes.dashboard} onClick={() => isBelowLg && toggleSidebar()}>
              <Logo/>
            </Link>
            {isBelowLg && (
              <button onClick={toggleSidebar} className="rounded-lg p-1 hover:bg-surface text-muted hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            )}
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
                            isActive={pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url! + "/"))}
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
        </div>
      </aside>
    </>
  );
}
