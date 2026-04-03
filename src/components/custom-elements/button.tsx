import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition focus:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-brand text-white",
        green: "bg-green text-white hover:bg-green/90",
        dark: "bg-dark text-white dark:bg-white/10 hover:bg-dark/90",
        outlinePrimary:
          "border border-primary text-primary hover:bg-primary/10",
        outlineGreen: "border border-green text-green hover:bg-green/10",
        outline:
          "border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-100",
        outlineDark:
          "border border-dark text-dark dark:text-white dark:border-white/25 hover:bg-dark/10",
        gradient:
          "rounded-lg bg-gradient-brand text-white font-bold hover:opacity-90 xl:px-5",
        outlineGradient:
          "relative z-0 border-2 border-transparent bg-white text-primary font-bold hover:opacity-90 rounded-lg xl:px-5",
        clear:
          "bg-transparent text-primary hover:text-primary-light shadow-none border-none hover:bg-transparent p-0",
      },
      size: {
        default: "py-3.5 px-8",
        small: "py-2 px-4 text-sm",
        large: "py-4 px-10 text-lg",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-[5px]",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      shape: "default",
    },
  }
);

export interface CustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  label?: string;
  icon?: React.ReactNode;
  iconposition?: "left" | "right";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  icon,
  iconposition = "left",
  loading = false,
  variant = "gradient",
  size,
  shape,
  className,
  disabled,
  children,
  ...props
}) => {
  return (
    <ShadcnButton
      className={cn(buttonVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon && iconposition === "left" && <span>{icon}</span>}
          {label && <span>{label}</span>}
          {children}
          {icon && iconposition === "right" && <span>{icon}</span>}
        </>
      )}
    </ShadcnButton>
  );
};
