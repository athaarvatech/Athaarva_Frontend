"use client";

import React, { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown, Building2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vendor } from "../types";

// Mock vendors for demo
const MOCK_VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Sun Pharmaceutical Industries Ltd",
    gstin: "24AAACS1234B1ZS",
    phone: "9876543210",
    drugLicenseNo: "MH/20B/2024/1234",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v2",
    name: "Cipla Limited",
    gstin: "27AABCC1234C1Z3",
    phone: "9876543211",
    drugLicenseNo: "MH/20B/2024/5678",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v3",
    name: "Dr. Reddy's Laboratories",
    gstin: "36AABCD1234D1Z4",
    phone: "9876543212",
    drugLicenseNo: "AP/20B/2024/9012",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v4",
    name: "Lupin Pharmaceuticals",
    gstin: "27AABCL1234L1Z5",
    phone: "9876543213",
    drugLicenseNo: "MH/20B/2024/3456",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v5",
    name: "Zydus Lifesciences",
    gstin: "24AAACZ1234Z1Z6",
    phone: "9876543214",
    drugLicenseNo: "GJ/20B/2024/7890",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v6",
    name: "Torrent Pharmaceuticals",
    gstin: "24AABCT1234T1Z7",
    phone: "9876543215",
    drugLicenseNo: "GJ/20B/2024/1122",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v7",
    name: "Alkem Laboratories",
    gstin: "27AABCA1234A1Z8",
    phone: "9876543216",
    drugLicenseNo: "MH/20B/2024/3344",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v8",
    name: "Mankind Pharma",
    gstin: "06AABCM1234M1Z9",
    phone: "9876543217",
    drugLicenseNo: "HR/20B/2024/5566",
    createdAt: new Date().toISOString(),
  },
];

interface VendorComboboxProps {
  selectedVendor: Vendor | null;
  onVendorSelect: (vendor: Vendor | null) => void;
  onAddNew?: () => void;
  disabled?: boolean;
  error?: string;
}

export function VendorCombobox({
  selectedVendor,
  onVendorSelect,
  onAddNew,
  disabled = false,
  error,
}: VendorComboboxProps) {
  const [vendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [query, setQuery] = useState("");

  const filteredVendors =
    query === ""
      ? vendors
      : vendors.filter((vendor) =>
          vendor.name.toLowerCase().includes(query.toLowerCase()) ||
          vendor.gstin?.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <Combobox
        value={selectedVendor}
        onChange={onVendorSelect}
        disabled={disabled}
      >
        <div className="relative">
          <div
            className={cn(
              "relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left transition-all",
              "focus-within:border-healthcare-primary focus-within:ring-1 focus-within:ring-healthcare-primary",
              disabled && "bg-gray-50 opacity-60 cursor-not-allowed",
              error ? "border-red-400" : "border-gray-200"
            )}
          >
            <div className="flex items-center">
              <Building2 className="ml-3 h-4 w-4 text-gray-400" />
              <Combobox.Input
                className={cn(
                  "w-full border-none py-2.5 pl-2 pr-10 text-sm leading-5 text-gray-900",
                  "focus:ring-0 focus:outline-none placeholder:text-gray-400",
                  disabled && "cursor-not-allowed"
                )}
                displayValue={(vendor: Vendor | null) => vendor?.name || ""}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search vendor by name or GSTIN..."
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              className={cn(
                "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base",
                "shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              )}
            >
              {filteredVendors.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-3 px-4 text-gray-500">
                  <p className="text-sm">No vendors found for &quot;{query}&quot;</p>
                  {onAddNew && (
                    <button
                      type="button"
                      onClick={onAddNew}
                      className="mt-2 flex items-center gap-2 text-sm font-medium text-healthcare-primary hover:text-healthcare-secondary"
                    >
                      <Plus className="h-4 w-4" />
                      Add new vendor
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {filteredVendors.map((vendor) => (
                    <Combobox.Option
                      key={vendor.id}
                      className={({ active }) =>
                        cn(
                          "relative cursor-pointer select-none py-2.5 pl-10 pr-4",
                          active
                            ? "bg-healthcare-primary text-white"
                            : "text-gray-900"
                        )
                      }
                      value={vendor}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "block truncate text-sm",
                                selected ? "font-semibold" : "font-normal"
                              )}
                            >
                              {vendor.name}
                            </span>
                            <span
                              className={cn(
                                "block truncate text-xs mt-0.5",
                                active ? "text-white/80" : "text-gray-500"
                              )}
                            >
                              GSTIN: {vendor.gstin || "N/A"} | DL:{" "}
                              {vendor.drugLicenseNo || "N/A"}
                            </span>
                          </div>
                          {selected && (
                            <span
                              className={cn(
                                "absolute inset-y-0 left-0 flex items-center pl-3",
                                active ? "text-white" : "text-healthcare-primary"
                              )}
                            >
                              <Check className="h-4 w-4" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                  {onAddNew && (
                    <div className="border-t border-gray-100">
                      <button
                        type="button"
                        onClick={onAddNew}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-healthcare-primary hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                        Add new vendor
                      </button>
                    </div>
                  )}
                </>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
