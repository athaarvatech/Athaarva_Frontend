"use client";

import React, { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown, Pill, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Medicine } from "../types";

// Mock medicines for demo
const MOCK_MEDICINES: Medicine[] = [
  {
    id: "m1",
    name: "Paracetamol 500mg",
    genericName: "Paracetamol",
    manufacturer: "Cipla",
    category: "Analgesic",
    hsn: "30049099",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    manufacturer: "Sun Pharma",
    category: "Antibiotic",
    hsn: "30041000",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m3",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "Dr. Reddy's",
    category: "PPI",
    hsn: "30049099",
    defaultPack: "15T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m4",
    name: "Azithromycin 500mg",
    genericName: "Azithromycin",
    manufacturer: "Zydus",
    category: "Antibiotic",
    hsn: "30041000",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m5",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine",
    manufacturer: "Mankind",
    category: "Antihistamine",
    hsn: "30049099",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m6",
    name: "Metformin 500mg",
    genericName: "Metformin",
    manufacturer: "USV",
    category: "Antidiabetic",
    hsn: "30049099",
    defaultPack: "20T",
    defaultGst: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m7",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine",
    manufacturer: "Torrent",
    category: "Antihypertensive",
    hsn: "30049099",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m8",
    name: "Pantoprazole 40mg",
    genericName: "Pantoprazole",
    manufacturer: "Alkem",
    category: "PPI",
    hsn: "30049099",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m9",
    name: "Dolo 650",
    genericName: "Paracetamol",
    manufacturer: "Micro Labs",
    category: "Analgesic",
    hsn: "30049099",
    defaultPack: "15T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m10",
    name: "Augmentin 625 Duo",
    genericName: "Amoxicillin + Clavulanic Acid",
    manufacturer: "GSK",
    category: "Antibiotic",
    hsn: "30041000",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m11",
    name: "Crocin Advance",
    genericName: "Paracetamol",
    manufacturer: "GSK",
    category: "Analgesic",
    hsn: "30049099",
    defaultPack: "15T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m12",
    name: "Allegra 120mg",
    genericName: "Fexofenadine",
    manufacturer: "Sanofi",
    category: "Antihistamine",
    hsn: "30049099",
    defaultPack: "10T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m13",
    name: "Combiflam",
    genericName: "Ibuprofen + Paracetamol",
    manufacturer: "Sanofi",
    category: "Analgesic",
    hsn: "30049099",
    defaultPack: "20T",
    defaultGst: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m14",
    name: "Insulin Glargine 100IU/ml",
    genericName: "Insulin Glargine",
    manufacturer: "Sanofi",
    category: "Antidiabetic",
    hsn: "30043100",
    defaultPack: "1*VIAL",
    defaultGst: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m15",
    name: "Betadine Solution 100ml",
    genericName: "Povidone Iodine",
    manufacturer: "Win-Medicare",
    category: "Antiseptic",
    hsn: "30049099",
    defaultPack: "100ML",
    defaultGst: 18,
    createdAt: new Date().toISOString(),
  },
];

interface MedicineComboboxProps {
  value: string;
  onChange: (value: string, medicine?: Medicine) => void;
  onAddNew?: (name: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
}

export function MedicineCombobox({
  value,
  onChange,
  onAddNew,
  disabled = false,
  error,
  autoFocus = false,
}: MedicineComboboxProps) {
  const [medicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [query, setQuery] = useState(value);

  const filteredMedicines =
    query === ""
      ? medicines.slice(0, 10) // Show first 10 if no query
      : medicines.filter(
          (medicine) =>
            medicine.name.toLowerCase().includes(query.toLowerCase()) ||
            medicine.genericName?.toLowerCase().includes(query.toLowerCase()) ||
            medicine.manufacturer?.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (medicine: Medicine | null) => {
    if (medicine) {
      setQuery(medicine.name);
      onChange(medicine.name, medicine);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleAddNew = () => {
    if (onAddNew && query.trim()) {
      onAddNew(query.trim());
    }
  };

  return (
    <div className="w-full">
      <Combobox
        value={null}
        onChange={handleSelect}
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
              <Pill className="ml-3 h-4 w-4 text-gray-400 flex-shrink-0" />
              <Combobox.Input
                autoFocus={autoFocus}
                className={cn(
                  "w-full border-none py-2.5 pl-2 pr-10 text-sm leading-5 text-gray-900",
                  "focus:ring-0 focus:outline-none placeholder:text-gray-400",
                  disabled && "cursor-not-allowed"
                )}
                value={query}
                onChange={handleInputChange}
                placeholder="Type medicine name to search..."
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
          >
            <Combobox.Options
              className={cn(
                "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base",
                "shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              )}
            >
              {filteredMedicines.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-3 px-4 text-gray-500">
                  <p className="text-sm">No medicines found for &quot;{query}&quot;</p>
                  {onAddNew && (
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="mt-2 flex items-center gap-2 text-sm font-medium text-healthcare-primary hover:text-healthcare-secondary"
                    >
                      <Plus className="h-4 w-4" />
                      Add &quot;{query}&quot; as new medicine
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {filteredMedicines.map((medicine) => (
                    <Combobox.Option
                      key={medicine.id}
                      className={({ active }) =>
                        cn(
                          "relative cursor-pointer select-none py-2.5 pl-10 pr-4",
                          active
                            ? "bg-healthcare-primary text-white"
                            : "text-gray-900"
                        )
                      }
                      value={medicine}
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
                              {medicine.name}
                            </span>
                            <span
                              className={cn(
                                "block truncate text-xs mt-0.5",
                                active ? "text-white/80" : "text-gray-500"
                              )}
                            >
                              {medicine.genericName} | {medicine.manufacturer} | HSN: {medicine.hsn}
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
                  {query && !filteredMedicines.find(m => m.name.toLowerCase() === query.toLowerCase()) && onAddNew && (
                    <div className="border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleAddNew}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-healthcare-primary hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                        Add &quot;{query}&quot; as new medicine
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

// Get mock medicine by name (utility function)
export function getMockMedicineByName(name: string): Medicine | undefined {
  return MOCK_MEDICINES.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );
}
