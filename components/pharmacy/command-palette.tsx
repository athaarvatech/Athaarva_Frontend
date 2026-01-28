"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Package,
  PackagePlus,
  PackageMinus,
  Search,
  Settings,
  User,
  Pill,
  AlertTriangle,
  Clock,
  BarChart3,
  FileText,
  TrendingUp,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type CommandAction = {
  icon: React.ElementType;
  label: string;
  action: () => void;
  keywords?: string[];
};

interface PharmacyCommandPaletteProps {
  onNavigate?: (path: string) => void;
  onSearch?: (query: string) => void;
}

export function PharmacyCommandPalette({
  onNavigate,
  onSearch,
}: PharmacyCommandPaletteProps) {
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

  const navigate = (path: string) => {
    setOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  const searchMedicine = (query: string) => {
    setOpen(false);
    if (onSearch) {
      onSearch(query);
    }
  };

  const commands: Record<string, CommandAction[]> = {
    Navigation: [
      {
        icon: Package,
        label: "Dashboard",
        action: () => navigate("/pharmacy"),
        keywords: ["home", "main"],
      },
      {
        icon: PackagePlus,
        label: "Stock In / Purchase Entry",
        action: () => navigate("/pharmacy/stock-entry"),
        keywords: ["add", "buy", "purchase", "vendor"],
      },
      {
        icon: PackageMinus,
        label: "Stock Out / Dispense",
        action: () => navigate("/pharmacy/stock-out"),
        keywords: ["sell", "dispense", "patient", "sale"],
      },
      {
        icon: Package,
        label: "Inventory Management",
        action: () => navigate("/pharmacy/inventory"),
        keywords: ["stock", "items", "medicines"],
      },
      {
        icon: FileText,
        label: "Reports",
        action: () => navigate("/pharmacy/reports"),
        keywords: ["analytics", "data", "stats"],
      },
      {
        icon: Settings,
        label: "Settings",
        action: () => navigate("/pharmacy/settings"),
        keywords: ["config", "preferences"],
      },
    ],
    "Quick Filters": [
      {
        icon: AlertTriangle,
        label: "Show Low Stock Items",
        action: () => navigate("/pharmacy/inventory?filter=low-stock"),
        keywords: ["reorder", "shortage"],
      },
      {
        icon: Clock,
        label: "Show Expiring Soon",
        action: () => navigate("/pharmacy/inventory?filter=expiring-soon"),
        keywords: ["expire", "expiry", "near expiry"],
      },
      {
        icon: Package,
        label: "Show Out of Stock",
        action: () => navigate("/pharmacy/inventory?filter=out-of-stock"),
        keywords: ["empty", "zero stock"],
      },
      {
        icon: TrendingUp,
        label: "Show Top Selling",
        action: () => navigate("/pharmacy/reports?view=top-selling"),
        keywords: ["popular", "trending", "bestseller"],
      },
    ],
    "Quick Actions": [
      {
        icon: Search,
        label: "Search Medicines",
        action: () => navigate("/pharmacy/inventory"),
        keywords: ["find", "lookup", "drug"],
      },
      {
        icon: Pill,
        label: "Search by Generic Name",
        action: () => navigate("/pharmacy/inventory?searchBy=generic"),
        keywords: ["generic", "salt", "composition"],
      },
      {
        icon: Calculator,
        label: "Calculate Discount",
        action: () => navigate("/pharmacy/stock-out"),
        keywords: ["price", "offer"],
      },
    ],
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(commands).map(([group, items], idx) => (
          <React.Fragment key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={item.action}
                  keywords={item.keywords}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

// Hook to use the command palette
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

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

  return { open, setOpen };
}
