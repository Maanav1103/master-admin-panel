"use client";

import { ChevronUpIcon } from "@/assets/icon/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOutIcon, SettingsIcon } from "./icons";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import Cookies from "js-cookie";
import { FallbackImage } from "@/components/custom-elements/FallbackImages";
import { LocalStorageGetItem } from "@/utils/helpers";
import { logout } from "@/services/auth.service";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminDetails, setAdminDetails] = useState<any>(null); // Start with null
  const [imageKey, setImageKey] = useState(Date.now()); // Force image refresh
  const [isClient, setIsClient] = useState(false); // Track if we're on client
  const router = useRouter();

  // Initialize adminDetails only on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const details = LocalStorageGetItem("adminDetails");
    setAdminDetails(details);
  }, []);

  // Listen for localStorage changes and update admin details
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedDetails = LocalStorageGetItem("adminDetails");
      setAdminDetails(updatedDetails);
      setImageKey(Date.now()); // Force image refresh when details change
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events
    window.addEventListener("adminDetailsUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("adminDetailsUpdated", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Cookies.remove("token");
      console.log("Token cookie removed from client");      
      localStorage.removeItem("adminDetails");
      setIsOpen(false);
      router.replace(routes.auth.signIn);
      // window.location.reload();
      setIsLoggingOut(false);
    }
  };

  // Show loading state during SSR and initial client render
  if (!isClient || !adminDetails) {
    return (
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="max-[1024px]:sr-only">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <FallbackImage
            key={`${adminDetails?.profile_image}-${imageKey}`} // Force re-render when image changes
            src={adminDetails?.profile_image}
            alt={`Avatar of ${adminDetails?.username}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{adminDetails?.username}</span>
            <ChevronUpIcon
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border shadow border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>
        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <FallbackImage
            key={`${adminDetails?.profile_image}-${imageKey}`} // Force re-render when image changes
            src={adminDetails?.profile_image}
            alt={`Avatar of ${adminDetails?.username}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {adminDetails?.username}
            </div>

            <div className="leading-none text-gray-6">
              {adminDetails?.email?.length > 20
                ? adminDetails.email.slice(0, 20) + "..."
                : adminDetails?.email}
            </div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        {/* <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={routes.settings.editProfile}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />
            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" /> */}

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-[9px] transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOutIcon />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
