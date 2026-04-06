import { CMSPageLayout } from "@/components/pages/CMS/CMSPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "CMS" };

export default function CMSPage() {
  return <CMSPageLayout />;
}
