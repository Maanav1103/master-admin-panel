import { SettingsPageLayout } from "@/components/pages/Settings/SettingsPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <SettingsPageLayout />;
}
