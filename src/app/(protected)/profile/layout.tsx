import { Suspense } from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="space-y-6">Loading...</div>}>
      {children}
    </Suspense>
  );
}