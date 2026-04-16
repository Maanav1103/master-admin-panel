"use client";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { UserInfo } from "./user-info";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { toggleSidebar, isOpen } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-stroke bg-white px-4 py-5 shadow-1 md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border border-border px-1.5 py-1 text-foreground hover:bg-surface transition-colors lg:hidden"
      >
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {/* Desktop collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex items-center justify-center rounded-lg border border-border p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", !isOpen && "rotate-180")} />
      </button>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
