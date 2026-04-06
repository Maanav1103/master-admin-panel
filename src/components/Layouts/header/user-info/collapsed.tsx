"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Loader2 } from "lucide-react";
import { routes } from "@/constants/routes";
import { FallbackImage } from "@/components/custom-elements/FallbackImages";
import { LocalStorageGetItem } from "@/utils/helpers";
import { logout } from "@/services/auth.service";

export function CollapsedUserInfo() {
  const [adminDetails, setAdminDetails] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setAdminDetails(LocalStorageGetItem("adminDetails"));
  }, []);

  useEffect(() => {
    const sync = () => setAdminDetails(LocalStorageGetItem("adminDetails"));
    window.addEventListener("storage", sync);
    window.addEventListener("adminDetailsUpdated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("adminDetailsUpdated", sync);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("adminDetails");
      router.replace(routes.auth.signIn);
      setIsLoggingOut(false);
    }
  };

  if (!isClient || !adminDetails) {
    return <div className="size-8 rounded-full bg-gray-200 animate-pulse mx-auto" />;
  }

  return (
    <>
      <Link
        href={routes.profile}
        title={adminDetails?.fullName || adminDetails?.username}
        className="rounded-full transition-opacity hover:opacity-80"
      >
        <FallbackImage
          src={adminDetails?.profile_image}
          alt={adminDetails?.fullName || adminDetails?.username || "Profile"}
          width={200}
          height={200}
          className="size-8"
        />
      </Link>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        title="Log out"
        className="flex items-center justify-center size-8 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      </button>
    </>
  );
}
