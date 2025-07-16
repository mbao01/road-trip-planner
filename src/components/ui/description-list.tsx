import * as React from "react";
import { cn } from "@/lib/utils";

const DescriptionList = React.forwardRef<HTMLDListElement, React.HTMLAttributes<HTMLDListElement>>(
  ({ className, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-y-6", className)}
      {...props}
    />
  )
);
DescriptionList.displayName = "DescriptionList";

const DescriptionItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("sm:col-span-1", className)} {...props} />
  )
);
DescriptionItem.displayName = "DescriptionItem";

const DescriptionTerm = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <dt
      ref={ref}
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  )
);
DescriptionTerm.displayName = "DescriptionTerm";

const DescriptionDetail = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <dd ref={ref} className={cn("mt-1 text-sm text-foreground", className)} {...props} />
  )
);
DescriptionDetail.displayName = "DescriptionDetail";

export { DescriptionList, DescriptionItem, DescriptionTerm, DescriptionDetail };
