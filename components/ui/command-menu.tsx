"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Building2,
  MapPin,
  Palette,
  Home,
  Stethoscope,
  DollarSign,
  FileText,
  Pill,
  Settings,
  Users,
  CheckCircle,
  Search,
  ArrowRight,
} from "lucide-react";

interface CommandMenuProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const STEP_ITEMS = [
  { step: 0, title: "Template Selection", icon: FileText, keywords: ["template", "choose", "select"] },
  { step: 1, title: "Organization Profile", icon: Building2, keywords: ["hospital", "name", "registration", "legal"] },
  { step: 2, title: "Locations & Contact", icon: MapPin, keywords: ["address", "contact", "location", "phone", "email"] },
  { step: 3, title: "Branding", icon: Palette, keywords: ["logo", "colors", "theme", "brand"] },
  { step: 4, title: "Facility Management", icon: Home, keywords: ["wings", "floors", "wards", "beds", "rooms"] },
  { step: 5, title: "Clinical Departments", icon: Stethoscope, keywords: ["departments", "specialties", "cost centers"] },
  { step: 6, title: "Billing & Financial", icon: DollarSign, keywords: ["billing", "payment", "bank", "invoice", "tax"] },
  { step: 7, title: "Clinical Configuration", icon: FileText, keywords: ["prescription", "consultation", "alerts"] },
  { step: 8, title: "Pharmacy & Inventory", icon: Pill, keywords: ["pharmacy", "medicines", "inventory", "stores"] },
  { step: 9, title: "Operational Policies", icon: Settings, keywords: ["hours", "appointments", "policies", "schedule"] },
  { step: 10, title: "Compliance & Docs", icon: FileText, keywords: ["compliance", "documents", "licenses", "certificates"] },
  { step: 11, title: "Admin Team", icon: Users, keywords: ["admin", "staff", "team", "invitations"] },
  { step: 12, title: "Review & Submit", icon: CheckCircle, keywords: ["review", "submit", "finish", "complete"] },
];

const QUICK_ACTIONS = [
  { id: "save", title: "Save Progress", description: "Manually save current progress", keywords: ["save"] },
  { id: "preview", title: "Preview Hospital", description: "See how your hospital will look", keywords: ["preview", "view"] },
  { id: "help", title: "Get Help", description: "View documentation and support", keywords: ["help", "support", "docs"] },
];

export function CommandMenu({ currentStep, onStepChange }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleStepSelect = (step: number) => {
    onStepChange(step);
    setOpen(false);
  };

  const handleActionSelect = (actionId: string) => {
    switch (actionId) {
      case "save":
        // Trigger manual save (context handles auto-save)
        console.log("Manual save triggered");
        break;
      case "preview":
        // Open preview (to be implemented)
        console.log("Preview triggered");
        break;
      case "help":
        // Open help docs
        router.push("/docs");
        break;
    }
    setOpen(false);
  };

  return (
    <>
      {/* Keyboard Hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-xs">Quick navigation</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type to search steps or actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Navigation">
              {STEP_ITEMS.map((item) => {
                const Icon = item.icon;
                const isCompleted = item.step < currentStep;
                const isCurrent = item.step === currentStep;
                
                return (
                  <CommandItem
                    key={item.step}
                    value={`${item.title} ${item.keywords.join(" ")}`}
                    onSelect={() => handleStepSelect(item.step)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className={`p-2 rounded-lg ${
                      isCurrent 
                        ? "bg-teal-100 text-teal-700" 
                        : isCompleted 
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        {isCurrent && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                        {isCompleted && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Step {item.step + 1}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick Actions">
              {QUICK_ACTIONS.map((action) => (
                <CommandItem
                  key={action.id}
                  value={`${action.title} ${action.description} ${action.keywords.join(" ")}`}
                  onSelect={() => handleActionSelect(action.id)}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex-1">
                    <div className="font-medium">{action.title}</div>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
