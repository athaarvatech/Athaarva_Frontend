"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  Settings,
  Palette,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCollapseChange: (collapsed: boolean) => void;
  isCollapsed: boolean;
}

const AdminSidebar = ({
  isOpen,
  onClose,
  onCollapseChange,
  isCollapsed,
}: AdminSidebarProps) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/Admin",
      icon: LayoutDashboard,
    },
    {
      title: "Add Doctor",
      href: "/Admin/add-doctor",
      icon: UserPlus,
    },
    {
      title: "Add Staff",
      href: "/Admin/add-staff",
      icon: UserPlus,
    },
    {
      title: "Manage Doctors",
      href: "/Admin/manage-doctors",
      icon: Users,
    },
    {
      title: "Manage Staff",
      href: "/Admin/manage-staff",
      icon: UserCheck,
    },
    {
      title: "Hospital Branding",
      href: "/Admin/branding",
      icon: Palette,
    },
    {
      title: "Settings",
      href: "/Admin/settings",
      icon: Settings,
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007C7C] text-white text-sm font-bold">
              A
            </div>
            <span className="font-semibold text-[#007C7C]">Admin Panel</span>
          </div>
        )}

        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={() => onCollapseChange(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#007C7C] text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#007C7C]",
                isCollapsed && "justify-center px-2"
              )}
              onClick={onClose}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p className="font-medium">Atharva Healthcare</p>
            <p>Admin Dashboard v1.0</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          "hidden lg:block",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
