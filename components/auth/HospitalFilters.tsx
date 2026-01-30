"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  Star,
  MapPin,
  Stethoscope,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HospitalCardData } from "./HospitalCard";

export interface HospitalFilters {
  specialties: string[];
  cities: string[];
  states: string[];
  minRating: number;
}

interface HospitalFiltersProps {
  hospitals: HospitalCardData[];
  filters: HospitalFilters;
  onFiltersChange: (filters: HospitalFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

// Extract unique values from hospital data
function extractFilterOptions(hospitals: HospitalCardData[]) {
  const specialties = new Set<string>();
  const cities = new Set<string>();
  const states = new Set<string>();

  hospitals.forEach((hospital) => {
    hospital.specialties?.forEach((s) => specialties.add(s));
    if (hospital.city) cities.add(hospital.city);
    if (hospital.state) states.add(hospital.state);
  });

  return {
    specialties: Array.from(specialties).sort(),
    cities: Array.from(cities).sort(),
    states: Array.from(states).sort(),
  };
}

// Filter badge component
function FilterBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Badge
        variant="secondary"
        className="pl-2 pr-1 py-1 bg-healthcare-primary/10 text-healthcare-primary border-0 flex items-center gap-1"
      >
        <span className="text-xs">{label}</span>
        <button
          onClick={onRemove}
          className="ml-1 h-4 w-4 rounded-full hover:bg-healthcare-primary/20 flex items-center justify-center"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </motion.div>
  );
}

// Multi-select dropdown
function MultiSelectDropdown({
  label,
  icon: Icon,
  options,
  selected,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between h-10 border-gray-200 hover:border-healthcare-primary/50",
            selected.length > 0 && "border-healthcare-primary/50 bg-healthcare-primary/5"
          )}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <span className={cn("text-sm", selected.length === 0 && "text-gray-500")}>
              {selected.length > 0
                ? `${selected.length} selected`
                : placeholder || label}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <ScrollArea className="h-64">
          <div className="p-2">
            {options.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No options available
              </p>
            ) : (
              options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-md"
                >
                  <Checkbox
                    checked={selected.includes(option)}
                    onCheckedChange={() => handleToggle(option)}
                    className="data-[state=checked]:bg-healthcare-primary data-[state=checked]:border-healthcare-primary"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))
            )}
          </div>
        </ScrollArea>
        {selected.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="w-full text-xs"
            >
              Clear selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function HospitalFiltersComponent({
  hospitals,
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: HospitalFiltersProps) {
  const options = useMemo(() => extractFilterOptions(hospitals), [hospitals]);

  const activeFilterCount =
    filters.specialties.length +
    filters.cities.length +
    filters.states.length +
    (filters.minRating > 0 ? 1 : 0);

  const handleSpecialtiesChange = (specialties: string[]) => {
    onFiltersChange({ ...filters, specialties });
  };

  const handleCitiesChange = (cities: string[]) => {
    onFiltersChange({ ...filters, cities });
  };

  const handleStatesChange = (states: string[]) => {
    onFiltersChange({ ...filters, states });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, minRating: value[0] });
  };

  // Desktop filters
  const DesktopFilters = () => (
    <div className="hidden md:flex flex-wrap items-center gap-3">
      {/* Specialty filter */}
      <MultiSelectDropdown
        label="Specialties"
        icon={Stethoscope}
        options={options.specialties}
        selected={filters.specialties}
        onChange={handleSpecialtiesChange}
        placeholder="All Specialties"
      />

      {/* City filter */}
      <MultiSelectDropdown
        label="City"
        icon={MapPin}
        options={options.cities}
        selected={filters.cities}
        onChange={handleCitiesChange}
        placeholder="All Cities"
      />

      {/* State filter */}
      <MultiSelectDropdown
        label="State"
        icon={MapPin}
        options={options.states}
        selected={filters.states}
        onChange={handleStatesChange}
        placeholder="All States"
      />

      {/* Rating filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-between h-10 border-gray-200 hover:border-healthcare-primary/50",
              filters.minRating > 0 && "border-healthcare-primary/50 bg-healthcare-primary/5"
            )}
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <span className={cn("text-sm", filters.minRating === 0 && "text-gray-500")}>
                {filters.minRating > 0 ? `${filters.minRating}+ Stars` : "Any Rating"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Minimum Rating</span>
              <span className="text-sm text-healthcare-primary font-semibold">
                {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
              </span>
            </div>
            <Slider
              value={[filters.minRating]}
              onValueChange={handleRatingChange}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Any</span>
              <span>5★</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear all
        </Button>
      )}
    </div>
  );

  // Mobile filter sheet
  const MobileFilters = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="md:hidden relative h-10 border-gray-200"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-healthcare-primary text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filter Hospitals</SheetTitle>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-full py-6 px-1">
          <div className="space-y-6">
            {/* Specialties */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Specialties
              </h3>
              <div className="space-y-2">
                {options.specialties.map((specialty) => (
                  <label
                    key={specialty}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.specialties.includes(specialty)}
                      onCheckedChange={() => {
                        if (filters.specialties.includes(specialty)) {
                          handleSpecialtiesChange(
                            filters.specialties.filter((s) => s !== specialty)
                          );
                        } else {
                          handleSpecialtiesChange([...filters.specialties, specialty]);
                        }
                      }}
                      className="data-[state=checked]:bg-healthcare-primary data-[state=checked]:border-healthcare-primary"
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City
              </h3>
              <div className="space-y-2">
                {options.cities.map((city) => (
                  <label
                    key={city}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.cities.includes(city)}
                      onCheckedChange={() => {
                        if (filters.cities.includes(city)) {
                          handleCitiesChange(
                            filters.cities.filter((c) => c !== city)
                          );
                        } else {
                          handleCitiesChange([...filters.cities, city]);
                        }
                      }}
                      className="data-[state=checked]:bg-healthcare-primary data-[state=checked]:border-healthcare-primary"
                    />
                    <span className="text-sm">{city}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                State
              </h3>
              <div className="space-y-2">
                {options.states.map((state) => (
                  <label
                    key={state}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.states.includes(state)}
                      onCheckedChange={() => {
                        if (filters.states.includes(state)) {
                          handleStatesChange(
                            filters.states.filter((s) => s !== state)
                          );
                        } else {
                          handleStatesChange([...filters.states, state]);
                        }
                      }}
                      className="data-[state=checked]:bg-healthcare-primary data-[state=checked]:border-healthcare-primary"
                    />
                    <span className="text-sm">{state}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </h3>
              <div className="px-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-semibold text-healthcare-primary">
                    {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
                  </span>
                  {filters.minRating > 0 && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < filters.minRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Any rating</span>
                  <span>5 stars</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        <DesktopFilters />
        <MobileFilters />
      </div>

      {/* Active filter badges */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.specialties.map((specialty) => (
              <FilterBadge
                key={`specialty-${specialty}`}
                label={specialty}
                onRemove={() =>
                  handleSpecialtiesChange(
                    filters.specialties.filter((s) => s !== specialty)
                  )
                }
              />
            ))}
            {filters.cities.map((city) => (
              <FilterBadge
                key={`city-${city}`}
                label={city}
                onRemove={() =>
                  handleCitiesChange(filters.cities.filter((c) => c !== city))
                }
              />
            ))}
            {filters.states.map((state) => (
              <FilterBadge
                key={`state-${state}`}
                label={state}
                onRemove={() =>
                  handleStatesChange(filters.states.filter((s) => s !== state))
                }
              />
            ))}
            {filters.minRating > 0 && (
              <FilterBadge
                label={`${filters.minRating}+ Stars`}
                onRemove={() => handleRatingChange([0])}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HospitalFiltersComponent;
