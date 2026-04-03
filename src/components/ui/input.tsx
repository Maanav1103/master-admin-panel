import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, required, error, errorMessage, id, icon, iconPosition = "right", ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordField = type === "password";
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={id}
            className="text-body-sm font-medium text-dark dark:text-white"
          >
            {label}
            {required && <span className="ml-1 select-none text-red">*</span>}
          </label>
        )}
        <div className="relative mt-1 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2">
          <input
            id={id}
            ref={ref}
            type={isPasswordField ? (showPassword ? "text" : "password") : type}
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-2 text-sm text-dark shadow-sm outline-none placeholder:text-dark-6 focus:outline-none focus:ring-1 dark:text-white",
              iconPosition === "left" && "pl-12",
              (iconPosition === "right" || isPasswordField) && "pr-12",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-violet-500 focus:ring-violet-500",
            )}
            {...props}
          />
          
          {icon && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 text-gray-500",
              iconPosition === "left" ? "left-3" : "right-3"
            )}>
              {icon}
            </div>
          )}
          
          {isPasswordField && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1 text-sm font-[14px] text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
