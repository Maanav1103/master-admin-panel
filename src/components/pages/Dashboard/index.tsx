'use client'
import { Users, ShoppingBag, BarChart2, DollarSign, FileText, Settings, Layout, Bell } from "lucide-react";
import { StatsCards, StatItem } from "./StatsCards";
import { AnalyticsChart } from "./AnalyticsChart";
import { QuickLinks, QuickLinkItem } from "./QuickLinks";
import Breadcrumb from "@/components/custom-elements/Breadcrumb";

// ── Configure these per project ───────────────────────────────────────────────
const stats: StatItem[] = [
  { label: "Total Users",    value: 24521, change: 12.5,  icon: Users,        },
  { label: "Total Orders",   value: 1893,  change: -3.2,  icon: ShoppingBag,  },
  { label: "Revenue",        value: 48320, change: 8.1,   icon: DollarSign, prefix: "$" },
  { label: "Page Views",     value: 98741, change: 21.4,  icon: BarChart2,    },
];

const quickLinks: QuickLinkItem[] = [
  { label: "Manage Users",    description: "View, edit and manage users",      href: "/users",    icon: Users       },
  { label: "Orders",          description: "Track and manage orders",           href: "/orders",   icon: ShoppingBag },
  { label: "CMS Pages",       description: "Edit website content pages",        href: "/cms",      icon: FileText    },
  { label: "Analytics",       description: "Detailed reports and insights",     href: "/analytics",icon: BarChart2   },
  { label: "Notifications",   description: "Manage alerts and notifications",   href: "/notifications", icon: Bell  },
  { label: "Settings",        description: "App configuration and preferences", href: "/settings", icon: Settings    },
  { label: "Appearance",      description: "Theme, logo and branding",          href: "/appearance",icon: Layout     },
];
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb pageName="Dashboard" />
      <StatsCards stats={stats} />
      <AnalyticsChart />
    </div>
  );
}
