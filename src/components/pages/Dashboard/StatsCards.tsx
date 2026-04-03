"use client";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/utils/helpers/commonHelpers";

export type StatItem = {
  label: string;
  value: number;
  change: number; // percentage, positive = up, negative = down
  icon: LucideIcon;
  prefix?: string;
};

export function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isUp = stat.change >= 0;
        return (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
          >
            {/* gradient accent top-left */}
            <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-gradient-brand opacity-10 blur-2xl" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {stat.prefix}{formatNumber(stat.value)}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-md shadow-primary/20">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
              {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{Math.abs(stat.change)}% vs last period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
