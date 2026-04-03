"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { routes } from "@/constants/routes";

export default function PublicGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("token")) {
      router.replace(routes.dashboard);
    }
  }, [router]);

  if (Cookies.get("token")) return null;

  return <>{children}</>;
}
