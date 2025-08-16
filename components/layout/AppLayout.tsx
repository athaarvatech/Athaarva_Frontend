"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import GlobalTopBar from "./GlobalTopBar";
import EnhancedSidebar from "./EnhancedSidebar";
import { AppProvider } from "@/contexts/AppContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { 
  PublicRouteGuard, 
  ProtectedRouteGuard, 
  OnboardingRouteGuard, 
  DashboardRouteGuard 
} from "@/components/guards/RouteGuards";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
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

  // Landing page - no guards needed
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Ecommerce page - no guards needed, accessible to all
  if (pathname?.startsWith("/ecommerce")) {
    return <>{children}</>;
  }
    // Ecommerce page - no guards needed, accessible to all
  if (pathname?.startsWith("/onboarding/Hospital")) {
    return <>{children}</>;
  }
  if (pathname?.startsWith("/Admin")) {
    return <>{children}</>;
  }
  // Auth routes - redirect if already authenticated
  if (pathname?.startsWith("/auth")) {
    return (
      <PublicRouteGuard>
        {children}
      </PublicRouteGuard>
    );
  }

  // Onboarding routes - only allow if not completed
  if (pathname?.startsWith("/onboarding")) {
    return (
      <OnboardingRouteGuard>
        {children}
      </OnboardingRouteGuard>
    );
  }

  // Doctor routes - only allow doctors with completed onboarding
  if (pathname?.startsWith("/doctor")) {
    return (
      <DashboardRouteGuard userType="doctor">
        <AppProvider>
          <NotificationProvider>
            <SearchProvider>
              <NavigationProvider>
                <div className="flex h-screen bg-gray-50">
                  {/* Sidebar */}
                  <EnhancedSidebar
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                    onCollapseChange={handleSidebarCollapseChange}
                  />

                  {/* Main Content */}
                  <main
                    className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${
                      isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
                  >
                    {/* Top Navigation Bar */}
                    <GlobalTopBar toggleMobileMenu={toggleMobileMenu} />

                    {/* Breadcrumbs */}
                    {/* <Breadcrumbs /> */}

                    {/* Page Content */}
                    <div className="flex-grow p-4 md:p-6 overflow-auto">
                      {children}
                    </div>
                  </main>
                </div>
              </NavigationProvider>
            </SearchProvider>
          </NotificationProvider>
        </AppProvider>
      </DashboardRouteGuard>
    );
  }

  // Patient routes - only allow patients with completed onboarding
  if (pathname?.startsWith("/patient")) {
    return (
      <DashboardRouteGuard userType="patient">
        <AppProvider>
          <NotificationProvider>
            <SearchProvider>
              <NavigationProvider>
                <div className="flex h-screen bg-gray-50">
                  {/* Sidebar */}
                  <EnhancedSidebar
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                    onCollapseChange={handleSidebarCollapseChange}
                  />

                  {/* Main Content */}
                  <main
                    className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${
                      isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
                  >
                    {/* Top Navigation Bar */}
                    <GlobalTopBar toggleMobileMenu={toggleMobileMenu} />

                    {/* Breadcrumbs */}
                    {/* <Breadcrumbs /> */}

                    {/* Page Content */}
                    <div className="flex-grow p-4 md:p-6 overflow-auto">
                      {children}
                    </div>
                  </main>
                </div>
              </NavigationProvider>
            </SearchProvider>
          </NotificationProvider>
        </AppProvider>
      </DashboardRouteGuard>
    );
  }

  // All other routes require authentication
  return (
    <ProtectedRouteGuard>
      <AppProvider>
        <NotificationProvider>
          <SearchProvider>
            <NavigationProvider>
              <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <EnhancedSidebar
                  isOpen={isMobileMenuOpen}
                  onClose={() => setIsMobileMenuOpen(false)}
                  onCollapseChange={handleSidebarCollapseChange}
                />

                {/* Main Content */}
                <main
                  className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${
                    isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                  }`}
                >
                  {/* Top Navigation Bar */}
                  <GlobalTopBar toggleMobileMenu={toggleMobileMenu} />

                  {/* Breadcrumbs */}
                  {/* <Breadcrumbs /> */}

                  {/* Page Content */}
                  <div className="flex-grow p-4 md:p-6 overflow-auto">
                    {children}
                  </div>
                </main>
              </div>
            </NavigationProvider>
          </SearchProvider>
        </NotificationProvider>
      </AppProvider>
    </ProtectedRouteGuard>
  );
};

export default AppLayout;
