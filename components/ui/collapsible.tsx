"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "@ark-ui/react/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    showIcon?: boolean;
  }
>(({ className, children, showIcon = true, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200",
      className
    )}
    {...props}
  >
    {children}
    {showIcon && (
      <CollapsiblePrimitive.Indicator className="transition-transform duration-200 data-[state=open]:rotate-180">
        <ChevronDownIcon className="w-4 h-4" />
      </CollapsiblePrimitive.Indicator>
    )}
  </CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1",
      className
    )}
    {...props}
  />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
