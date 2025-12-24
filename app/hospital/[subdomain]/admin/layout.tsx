"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  ClipboardList,
  CreditCard,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HospitalAdminContext,
  type HospitalAdminContextType,
} from "./HospitalAdminContext";

// Re-export for convenience
export { useHospitalAdmin } from "./HospitalAdminContext";

// =============================================================================
// Types
// =============================================================================

interface HospitalProfile {
  id: string;
  hospital_name: string;
  subdomain: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  status: "pending" | "active" | "suspended";
}

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

// =============================================================================
// Navigation Items
// =============================================================================

interface NavChild {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  children?: NavChild[];
}

interface BottomNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Team Management",
    href: "/team",
    icon: Users,
    badge: null,
    children: [
      { title: "All Staff", href: "/team" },
      { title: "Invite Members", href: "/team/invite" },
      { title: "Pending Invitations", href: "/team/pending" },
      { title: "Roles & Permissions", href: "/team/roles" },
    ],
  },
  {
    title: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
    badge: null,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
    badge: "12",
  },
  {
    title: "Patients",
    href: "/patients",
    icon: ClipboardList,
    badge: null,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    badge: null,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: TrendingUp,
    badge: null,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    badge: "3",
  },
];

const bottomNavItems: BottomNavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/support",
    icon: HelpCircle,
  },
];

// =============================================================================
// Sidebar Component
// =============================================================================

interface SidebarProps {
  hospital: HospitalProfile | null;
  subdomain: string;
  isCollapsed: boolean;
  onToggle: () => void;
  currentPath: string;
}

function Sidebar({
  hospital,
  subdomain,
  isCollapsed,
  onToggle,
  currentPath,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const basePath = `/hospital/${subdomain}/admin`;

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    const fullPath = href ? `${basePath}${href}` : basePath;
    return currentPath === fullPath || currentPath.startsWith(fullPath + "/");
  };

  const theme = {
    primary: hospital?.primary_color || "#007C7C",
    secondary: hospital?.secondary_color || "#20B2AA",
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col",
        "shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Link href={basePath} className="flex items-center gap-3">
          {hospital?.logo_url ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={hospital.logo_url}
                alt={hospital.hospital_name}
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
          )}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <h2 className="font-semibold text-gray-900 truncate text-sm">
                {hospital?.hospital_name || "Hospital"}
              </h2>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </motion.div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="flex-shrink-0 hidden lg:flex"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isItemActive = isActive(item.href);
            const isExpanded = expandedItems.includes(item.title);

            return (
              <div key={item.title}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                      isItemActive && "bg-gray-50 text-gray-900"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${theme.primary}20`,
                              color: theme.primary,
                            }}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href ? `${basePath}${item.href}` : basePath}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                      isItemActive && "text-white shadow-md",
                      isCollapsed && "justify-center"
                    )}
                    style={
                      isItemActive
                        ? {
                            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                          }
                        : {}
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">
                          {item.title}
                        </span>
                        {item.badge && !isItemActive && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${theme.primary}20`,
                              color: theme.primary,
                            }}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {item.badge && isItemActive && (
                          <Badge className="text-xs bg-white/20 text-white hover:bg-white/30">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                )}

                {/* Children */}
                {hasChildren && !isCollapsed && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-11 py-1 space-y-1">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={`${basePath}${child.href}`}
                              className={cn(
                                "block px-3 py-2 rounded-lg text-sm transition-colors",
                                "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                                isActive(child.href) &&
                                  "text-gray-900 bg-gray-50 font-medium"
                              )}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        {bottomNavItems.map((item) => (
          <Link
            key={item.title}
            href={`${basePath}${item.href}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              isActive(item.href) && "text-gray-900 bg-gray-50",
              isCollapsed && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </Link>
        ))}
      </div>
    </motion.aside>
  );
}

// =============================================================================
// Header Component
// =============================================================================

interface HeaderProps {
  user: AdminUser | null;
  hospital: HospitalProfile | null;
  sidebarCollapsed: boolean;
  onLogout: () => void;
}

function Header({ user, hospital, sidebarCollapsed, onLogout }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    primary: hospital?.primary_color || "#007C7C",
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40",
        "flex items-center justify-between px-6 transition-all duration-200"
      )}
      style={{ left: sidebarCollapsed ? 80 : 280 }}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {hospital?.status === "pending" && (
          <Badge
            variant="outline"
            className="text-amber-600 border-amber-300 bg-amber-50"
          >
            Pending Review
          </Badge>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback
                  className="text-white text-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  {user?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.full_name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || "Hospital Admin"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-gray-900">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// =============================================================================
// Mobile Sidebar
// =============================================================================

interface MobileSidebarProps {
  hospital: HospitalProfile | null;
  subdomain: string;
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

function MobileSidebar({
  hospital,
  subdomain,
  isOpen,
  onClose,
  currentPath,
}: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-[280px] z-50 lg:hidden"
          >
            <Sidebar
              hospital={hospital}
              subdomain={subdomain}
              isCollapsed={false}
              onToggle={onClose}
              currentPath={currentPath}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// Main Layout Component
// =============================================================================

export default function HospitalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const subdomain = params.subdomain as string;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get auth token
      const token = localStorage.getItem("hospital_admin_token");
      // tenantId can be used for additional validation if needed
      // const tenantId = localStorage.getItem("hospital_admin_tenant_id");

      if (!token) {
        // Redirect to auth if no token
        router.push(`/auth/hospital/${subdomain}`);
        return;
      }

      // Fetch hospital profile
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const hospitalResponse = await fetch(
        `${API_BASE}/hospitals/${subdomain}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!hospitalResponse.ok) {
        if (hospitalResponse.status === 401) {
          localStorage.removeItem("hospital_admin_token");
          router.push(`/auth/hospital/${subdomain}`);
          return;
        }
        throw new Error("Failed to fetch hospital data");
      }

      const hospitalData = await hospitalResponse.json();
      setHospital({
        id: hospitalData.id,
        hospital_name: hospitalData.hospital_name || hospitalData.display_name,
        subdomain: hospitalData.subdomain || subdomain,
        logo_url: hospitalData.logo_url,
        primary_color: hospitalData.primary_color || "#007C7C",
        secondary_color: hospitalData.secondary_color || "#20B2AA",
        status: hospitalData.status || "pending",
      });

      // Fetch user profile
      const userResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser({
          id: userData.id,
          full_name: userData.full_name,
          email: userData.email,
          avatar_url: userData.avatar_url,
          role: userData.user_type || "Hospital Admin",
        });
      }
    } catch (err) {
      console.error("Error fetching hospital data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load hospital data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain]);

  const handleLogout = () => {
    localStorage.removeItem("hospital_admin_token");
    localStorage.removeItem("hospital_admin_tenant_id");
    localStorage.removeItem("hospital_subdomain");
    router.push(`/hospital/${subdomain}`);
  };

  const contextValue: HospitalAdminContextType = {
    hospital,
    user,
    loading,
    error,
    refreshHospital: fetchHospitalData,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <HospitalAdminContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            hospital={hospital}
            subdomain={subdomain}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentPath={pathname}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden bg-white rounded-lg p-2 shadow-md"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Mobile Sidebar */}
        <MobileSidebar
          hospital={hospital}
          subdomain={subdomain}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentPath={pathname}
        />

        {/* Header */}
        <Header
          user={user}
          hospital={hospital}
          sidebarCollapsed={sidebarCollapsed}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main
          className={cn(
            "pt-16 min-h-screen transition-all duration-200",
            sidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </HospitalAdminContext.Provider>
  );
}
