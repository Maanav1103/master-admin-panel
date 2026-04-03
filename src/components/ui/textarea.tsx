import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    label?: string;
    errorMessage?: string;
  }
>(({ className, label, errorMessage, ...props }, ref) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-body-sm font-medium text-dark">
          {label}
        </label>
      )}
      <textarea
        rows={4}
        className={cn(
          "resize-none text-sm px-4 py-2 w-full rounded-lg border-2 border-stroke bg-transparent outline-none transition focus:border-violet-600 disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
          errorMessage ? "border-red-500" : "border-input",
          className
        )}
        ref={ref}
        {...props}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
