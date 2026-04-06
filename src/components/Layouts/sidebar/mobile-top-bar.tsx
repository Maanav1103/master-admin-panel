"use client";
import { useSidebarContext } from "./sidebar-context";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { routes } from "@/constants/routes";
import Link from "next/link";

export function MobileTopBar() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface-card px-4 py-3">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href={routes.dashboard}>
        <Logo />
      </Link>
      <div className="w-8" />
    </header>
  );
}
