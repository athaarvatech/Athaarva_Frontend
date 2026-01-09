"use client";

import * as React from "react";
import { Tabs } from "@ark-ui/react/tabs";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface TabsPillsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

function TabsPills({ 
  tabs, 
  defaultValue, 
  onValueChange, 
  children,
  className 
}: TabsPillsProps) {
  return (
    <Tabs.Root 
      defaultValue={defaultValue || tabs[0]?.value} 
      onValueChange={(details) => onValueChange?.(details.value)}
      className={cn("w-full", className)}
    >
      <Tabs.List className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                "text-gray-600 dark:text-gray-300",
                "data-[selected]:bg-white dark:data-[selected]:bg-gray-700",
                "data-[selected]:text-gray-900 dark:data-[selected]:text-white",
                "data-[selected]:shadow-sm",
                "hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded-full min-w-[18px] text-center">
                  {tab.badge}
                </span>
              )}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {children}
    </Tabs.Root>
  );
}

const TabsContent = Tabs.Content;

export { TabsPills, TabsContent, type TabItem };
