"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Mail } from "lucide-react";
import CustomDateRangePicker from "@/components/custom-elements/CustomDateRangePicker";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import dayjs from "dayjs";

type Period = "today" | "yesterday" | "this_week" | "custom";

export type ChartDataPoint = { label: string; value: number };

// ── mock data per period ──────────────────────────────────────────────────────
const mockData: Record<Exclude<Period, "custom">, ChartDataPoint[]> = {
  today: Array.from({ length: 12 }, (_, i) => ({
    label: `${(i * 2).toString().padStart(2, "0")}:00`,
    value: Math.floor(Math.random() * 300 + 50),
  })),
  yesterday: Array.from({ length: 12 }, (_, i) => ({
    label: `${(i * 2).toString().padStart(2, "0")}:00`,
    value: Math.floor(Math.random() * 280 + 40),
  })),
  this_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
    label: d,
    value: Math.floor(Math.random() * 500 + 100),
  })),
};

const PERIODS: { key: Period; label: string }[] = [
  { key: "today",      label: "Today" },
  { key: "yesterday",  label: "Yesterday" },
  { key: "this_week",  label: "This Week" },
  { key: "custom",     label: "Custom" },
];

function exportCSV(data: ChartDataPoint[], period: string) {
  const rows = ["Period,Value", ...data.map((d) => `${d.label},${d.value}`)];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${period}-${dayjs().format("YYYY-MM-DD")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsChart() {
  const [period, setPeriod]         = useState<Period>("this_week");
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo]     = useState<Date | null>(null);
  const [customPickerOpen, setCustomPickerOpen] = useState(false);
  const [emailOpen, setEmailOpen]   = useState(false);
  const [email, setEmail]           = useState("");
  const [sending, setSending]       = useState(false);
  const [sent, setSent]             = useState(false);

  const data: ChartDataPoint[] =
    period === "custom"
      ? mockData.this_week // replace with real API call using customFrom/customTo
      : mockData[period];

  const handleSendEmail = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000)); // replace with real API call
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setEmailOpen(false); setEmail(""); }, 1500);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Analytics Overview</h3>
          <p className="text-xs text-muted mt-0.5">Visitor & engagement trends</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(data, period)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-primary hover:text-primary transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setEmailOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-primary hover:text-primary transition-colors"
          >
            <Mail className="h-3.5 w-3.5" /> Send to Email
          </button>
        </div>
      </div>

      {/* Period tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => { setPeriod(p.key); if (p.key === "custom") setCustomPickerOpen(true); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              period === p.key
                ? "bg-gradient-brand text-white shadow-sm shadow-primary/20"
                : "border border-border text-muted hover:border-primary hover:text-primary"
            }`}
          >
            {p.label}
          </button>
        ))}

        {period === "custom" && (
          <CustomDateRangePicker
            from={customFrom}
            to={customTo}
            open={customPickerOpen}
            onOpenChange={setCustomPickerOpen}
            onApply={(from, to) => { setCustomFrom(from); setCustomTo(to); }}
            onCancel={() => { setCustomFrom(null); setCustomTo(null); setPeriod("this_week"); }}
          />
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#chartGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "var(--primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Send to email dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Send Analytics Report</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted">
            Enter an email address to receive the current chart data as a report.
          </p>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <DialogFooter>
            <button
              onClick={handleSendEmail}
              disabled={!email || sending || sent}
              className="w-full rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {sent ? "Sent ✓" : sending ? "Sending..." : "Send Report"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
