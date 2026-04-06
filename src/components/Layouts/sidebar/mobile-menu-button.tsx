"use client";
import { useSidebarContext } from "./sidebar-context";
import { Menu } from "lucide-react";

export function MobileMenuButton() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden fixed top-4 left-4 z-30 rounded-lg border border-border bg-surface-card p-2 text-foreground shadow-sm hover:bg-surface transition-colors"
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
