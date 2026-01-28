"use client";

import React from "react";
import {
  ArrowUpDown,
  Star,
  MapPin,
  Clock,
  Building2,
  Grid3X3,
  List,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "rating-desc"
  | "rating-asc"
  | "city-asc"
  | "recent";

export type ViewMode = "grid" | "list" | "compact";

interface HospitalSortViewProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  className?: string;
}

const sortOptions: { value: SortOption; label: string; icon: React.ElementType }[] = [
  { value: "name-asc", label: "Name (A-Z)", icon: Building2 },
  { value: "name-desc", label: "Name (Z-A)", icon: Building2 },
  { value: "rating-desc", label: "Highest Rated", icon: Star },
  { value: "rating-asc", label: "Lowest Rated", icon: Star },
  { value: "city-asc", label: "City (A-Z)", icon: MapPin },
  { value: "recent", label: "Recently Added", icon: Clock },
];

export function HospitalSortView({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  className,
}: HospitalSortViewProps) {
  const currentSort = sortOptions.find((o) => o.value === sortBy);

  return (
    <div
      className={cn(
        "flex items-center justify-between flex-wrap gap-3",
        className
      )}
    >
      {/* Results count */}
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{totalCount}</span>{" "}
        hospital{totalCount !== 1 ? "s" : ""} found
      </div>

      <div className="flex items-center gap-3">
        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-gray-200">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sort by:</span>
              <span className="font-medium ml-1">{currentSort?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  sortBy === option.value && "bg-healthcare-primary/5 text-healthcare-primary"
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View mode toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
          className="border rounded-lg p-1 bg-gray-50 hidden sm:flex"
        >
          <ToggleGroupItem
            value="grid"
            aria-label="Grid view"
            className={cn(
              "h-7 w-7 p-0",
              viewMode === "grid" && "bg-white shadow-sm"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="list"
            aria-label="List view"
            className={cn(
              "h-7 w-7 p-0",
              viewMode === "list" && "bg-white shadow-sm"
            )}
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="compact"
            aria-label="Compact view"
            className={cn(
              "h-7 w-7 p-0",
              viewMode === "compact" && "bg-white shadow-sm"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

export default HospitalSortView;
