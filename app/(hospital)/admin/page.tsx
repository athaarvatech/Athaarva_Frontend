"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  CreditCard,
  UserCog,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHospital } from "../HospitalContext";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  { icon: Users, label: "Patients", href: "/admin/patients" },
  { icon: Stethoscope, label: "Doctors", href: "/admin/doctors" },
  { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
  { icon: ClipboardList, label: "Medical Records", href: "/admin/records" },
  { icon: CreditCard, label: "Billing", href: "/admin/billing" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: UserCog, label: "Staff", href: "/admin/staff" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { hospital, subdomain, theme } = useHospital();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        // Invalid user data
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("hospital_admin_token");
    localStorage.removeItem("user");
    localStorage.removeItem("hospital_code");
    router.push("/auth/staff");
  };

  if (!hospital) return null;

  const primaryColor = theme.primaryColor;

  const stats = [
    { label: "Total Patients", value: "1,234", change: "+12%", icon: Users },
    { label: "Appointments Today", value: "48", change: "+5%", icon: Calendar },
    { label: "Active Doctors", value: "24", change: "0%", icon: Stethoscope },
    { label: "Revenue (MTD)", value: "₹4.5L", change: "+18%", icon: TrendingUp },
  ];

  const recentAppointments = [
    { patient: "Rahul Sharma", doctor: "Dr. Patel", time: "10:00 AM", status: "Confirmed" },
    { patient: "Priya Singh", doctor: "Dr. Kumar", time: "10:30 AM", status: "In Progress" },
    { patient: "Amit Verma", doctor: "Dr. Reddy", time: "11:00 AM", status: "Waiting" },
    { patient: "Sneha Gupta", doctor: "Dr. Patel", time: "11:30 AM", status: "Scheduled" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-4 border-b">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {hospital.logo_url ? (
                <Image
                  src={hospital.logo_url}
                  alt={hospital.hospital_name}
                  width={32}
                  height={32}
                  className="rounded"
                />
              ) : (
                <Building2 className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate text-sm">
                {hospital.hospital_name}
              </h2>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                style={item.active ? { backgroundColor: primaryColor } : {}}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                      {user?.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.full_name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search patients, appointments..."
                  className="pl-10 w-64 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                size="sm"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.full_name?.split(" ")[0] || "Admin"}
            </h1>
            <p className="text-gray-500">Here's what's happening at {hospital.hospital_name} today.</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: primaryColor }} />
                      </div>
                      <Badge
                        variant="secondary"
                        className={stat.change.startsWith("+") ? "text-green-600 bg-green-50" : "text-gray-600"}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Appointments */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Today's Appointments</CardTitle>
                <Link href="/admin/appointments">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAppointments.map((apt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                          {apt.patient.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{apt.patient}</p>
                        <p className="text-sm text-gray-500">{apt.doctor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          apt.status === "Confirmed"
                            ? "bg-green-50 text-green-600"
                            : apt.status === "In Progress"
                            ? "bg-blue-50 text-blue-600"
                            : apt.status === "Waiting"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: "Add Patient", href: "/admin/patients/new" },
                  { icon: Calendar, label: "Schedule Appointment", href: "/admin/appointments/new" },
                  { icon: Stethoscope, label: "Add Doctor", href: "/admin/doctors/new" },
                  { icon: FileText, label: "Generate Report", href: "/admin/reports" },
                  { icon: CreditCard, label: "Create Invoice", href: "/admin/billing/new" },
                  { icon: Settings, label: "Hospital Settings", href: "/admin/settings" },
                ].map((action, idx) => (
                  <Link key={idx} href={action.href}>
                    <div className="flex items-center gap-3 p-4 rounded-xl border hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <action.icon className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
