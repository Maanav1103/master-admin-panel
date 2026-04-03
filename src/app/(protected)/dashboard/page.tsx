import { DashboardPage } from "@/components/pages/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function Dashboard() {
  return <DashboardPage />;
}
