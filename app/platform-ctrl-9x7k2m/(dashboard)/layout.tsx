"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Shield, Menu, X, Bell, LogOut, Lock } from "lucide-react";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SUPER_ADMIN_CONFIG } from "@/lib/super-admin-config";

type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
  disabled?: boolean;
};

const BASE_PATH = SUPER_ADMIN_CONFIG.OBFUSCATED_PATH;

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: `${BASE_PATH}`, exact: true },
  { label: "Tenants", href: `${BASE_PATH}/tenants` },
  { label: "Users", href: `${BASE_PATH}/users` },
  { label: "Invitations", href: `${BASE_PATH}/invites` },
  { label: "Plans", href: `${BASE_PATH}/plans` },
  { label: "Database", href: `${BASE_PATH}/database` },
  { label: "Audit Logs", href: `${BASE_PATH}/audit-logs` },
  { label: "Settings", href: `${BASE_PATH}/settings` },
  { label: "Impersonate", href: `${BASE_PATH}/impersonate` },
  { label: "Jobs", href: `${BASE_PATH}/jobs` },
  { label: "AI", href: `${BASE_PATH}/ai` },
  { label: "Templates", href: `${BASE_PATH}/templates` },
  { label: "Website", href: `${BASE_PATH}/website` },
  { label: "Social", href: `${BASE_PATH}/social` },
];

/**
 * Secure Super Admin Dashboard Layout
 * 
 * This layout wraps the main admin pages with navigation.
 * Only shown after successful OTP verification.
 */
export default function SecureDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, clientIP, pendingOTP } = useSecureSuperAdminAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (loading) return;
    
    if (pendingOTP) {
      router.replace(`${BASE_PATH}/verify`);
      return;
    }
    
    if (!isAuthenticated) {
      router.replace(`${BASE_PATH}/login`);
    }
  }, [loading, isAuthenticated, pendingOTP, router]);

  const activeHref = useMemo(() => {
    return NAV_ITEMS.find((item) =>
      item.href !== "#"
        ? item.exact
          ? pathname === item.href
          : pathname?.startsWith(item.href)
        : false
    )?.href;
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-white/80">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm tracking-wide uppercase">
            Preparing secure workspace…
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-red-600/90">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                  Athaarva Platform
                </p>
                <h1 className="text-xl font-semibold">Super Admin Workspace</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Security Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <Lock className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs text-green-400">2FA Verified</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium">
                  {user?.email}
                </span>
                <span className="text-xs text-white/50">{clientIP}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white/30 text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="sm:hidden"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex flex-wrap gap-2 py-3",
              isSidebarOpen ? "block" : "hidden sm:flex"
            )}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                aria-disabled={item.disabled ?? false}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full border border-transparent transition",
                  item.disabled && "opacity-40 cursor-not-allowed",
                  activeHref === item.href
                    ? "bg-white text-slate-900"
                    : "text-white/80 hover:text-white hover:border-white/30"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
