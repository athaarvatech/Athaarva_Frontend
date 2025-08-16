"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminTopBar from "./components/AdminTopBar";
import AdminSidebar from "./components/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onCollapseChange={handleSidebarCollapseChange}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content */}
        <main
          className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${
            isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          {/* Top Navigation Bar */}
          <AdminTopBar toggleMobileMenu={toggleMobileMenu} />

          {/* Page Content */}
          <div className="flex-grow p-4 md:p-6 overflow-auto bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
