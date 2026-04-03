"use client";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

export type QuickLinkItem = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function QuickLinks({ links }: { links: QuickLinkItem[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-foreground">Quick Links</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-sm shadow-primary/20">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{link.label}</p>
                <p className="truncate text-xs text-muted">{link.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
