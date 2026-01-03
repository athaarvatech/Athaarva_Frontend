"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useHospitalAdminAuth } from "@/contexts/HospitalAdminAuthContext";

interface AdminTopBarProps {
  toggleMobileMenu: () => void;
}

const AdminTopBar = ({ toggleMobileMenu }: AdminTopBarProps) => {
  const { user, logout } = useHospitalAdminAuth();

  // Get initials from user name
  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const names = name.split(" ");
    return names.map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Mobile menu button and Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo and breadcrumb */}
          <div className="flex items-center gap-3">
            <Image
              src="/atharva.png"
              alt="Atharva Healthcare"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-[#007C7C]">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">Hospital Management</p>
            </div>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">
                  You have 3 unread notifications
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex-col items-start p-3">
                  <p className="font-medium">New doctor registration</p>
                  <p className="text-sm text-gray-500">
                    Dr. Sarah Johnson submitted registration
                  </p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-3">
                  <p className="font-medium">Staff password reset</p>
                  <p className="text-sm text-gray-500">
                    Nurse Mary requested password reset
                  </p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-3">
                  <p className="font-medium">System update</p>
                  <p className="text-sm text-gray-500">
                    Platform maintenance scheduled
                  </p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#007C7C] text-white text-sm font-medium">
                  {getInitials(user?.full_name)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.full_name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "Hospital Admin"}</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/Admin/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/Admin/settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-600 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
