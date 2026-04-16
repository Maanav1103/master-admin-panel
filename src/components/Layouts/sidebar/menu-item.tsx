import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

const menuItemBaseStyles = cva(
  "rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200",
  {
    variants: {
      isActive: {
        true: "bg-[rgba(54,101,214,0.1)] text-[#3665D6] hover:bg-[rgba(54,101,214,0.15)]",
        false: "hover:bg-gray-100 hover:text-gray-800",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & (
    | { as?: "button"; onClick: (e: React.MouseEvent) => void }
    | { as: "link"; href: string; onClick?: (e: React.MouseEvent) => void }
  )
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={(e) => {
          // Call the custom onClick handler if provided
          if (props.onClick) {
            props.onClick(e);
          }
          // Close sidebar on clicking link if it's mobile
          if (isMobile) {
            toggleSidebar();
          }
        }}
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
            className: "flex w-full items-center gap-3 py-2",
          }),
          props.className
        )}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={menuItemBaseStyles({
        isActive: props.isActive,
        className: "flex w-full items-center gap-3 py-3",
      })}
    >
      {props.children}
    </button>
  );
}
