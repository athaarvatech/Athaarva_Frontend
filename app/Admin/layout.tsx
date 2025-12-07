"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminTopBar from "./components/AdminTopBar";
import AdminSidebar from "./components/AdminSidebar";
import { HospitalAdminAuthProvider, useHospitalAdminAuth } from "@/contexts/HospitalAdminAuthContext";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useHospitalAdminAuth();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth?redirect=/Admin");
    }
  }, [loading, isAuthenticated, router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#007C7C]" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <HospitalAdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </HospitalAdminAuthProvider>
  );
};

export default AdminLayout;
