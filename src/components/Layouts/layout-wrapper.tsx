"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Layouts/sidebar";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { publicRoutes } from "@/constants/routes";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPage = (publicRoutes as readonly string[]).includes(pathname);

  useEffect(() => {
    const handleChunkError = (e: ErrorEvent) => {
      if (e?.message?.includes("Loading chunk")) {
        console.warn("Chunk load error - reloading page");
        window.location.reload();
      }
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      if (
        event?.reason?.message?.includes("Loading chunk") ||
        event?.reason?.toString().includes("ChunkLoadError")
      ) {
        console.warn("Unhandled rejection due to chunk load - reloading");
        window.location.reload();
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  return (
    <>
      <NextTopLoader color="#882F92" showSpinner={false} />
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          success: {
            style: {
              background: "linear-gradient(90deg, #CDEBDB 0%, #F0F0F0 100%)",
              color: "black",
              fontWeight: "600",
            },
          },
          error: {
            style: {
              background:
                "linear-gradient(90.05deg, #FADCDC 0.04%, #F8EAEA 97.58%)",

              color: "black",
              fontWeight: "600",
            },
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {isPublicPage ? (
            <main>{children}</main>
          ) : (
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="w-full bg-[#f3f4f6] overflow-x-hidden">
                  <main className="w-full max-w-screen-full overflow-hidden p-2 md:p-4 xl:p-6">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}
