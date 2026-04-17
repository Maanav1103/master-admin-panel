import { Loader } from "@/components/custom-elements/Loader";
import { Suspense } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="space-y-6"><Loader /></div>}>
      {children}
    </Suspense>
  );
}