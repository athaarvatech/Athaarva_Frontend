"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  Pill,
  Heart,
  CreditCard,
  LogOut,
  ChevronRight,
  Clock,
  User,
  Phone,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHospital } from "../../HospitalContext";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/patient/dashboard", active: true },
  { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
  { icon: ClipboardList, label: "Medical Records", href: "/patient/records" },
  { icon: Pill, label: "Prescriptions", href: "/patient/prescriptions" },
  { icon: FileText, label: "Lab Reports", href: "/patient/reports" },
  { icon: CreditCard, label: "Billing", href: "/patient/billing" },
  { icon: Heart, label: "Health Profile", href: "/patient/profile" },
  { icon: Settings, label: "Settings", href: "/patient/settings" },
];

export default function PatientDashboard() {
  const router = useRouter();
  const { hospital, theme } = useHospital();
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
    localStorage.removeItem("user");
    localStorage.removeItem("hospital_code");
    router.push("/auth");
  };

  if (!hospital) return null;

  const primaryColor = theme.primaryColor;

  const upcomingAppointments = [
    {
      doctor: "Dr. Sharma",
      specialty: "General Medicine",
      date: "Today",
      time: "3:00 PM",
      type: "In-Person",
    },
    {
      doctor: "Dr. Patel",
      specialty: "Cardiology",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Video",
    },
  ];

  const recentPrescriptions = [
    { medicine: "Paracetamol 500mg", dosage: "1 tablet twice daily", days: "5 days" },
    { medicine: "Vitamin D3", dosage: "1 tablet daily", days: "30 days" },
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
              <p className="text-xs text-gray-500">Patient Portal</p>
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
                      {user?.full_name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.full_name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
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
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button size="sm" style={{ backgroundColor: primaryColor }}>
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {user?.full_name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-gray-500">Welcome to your health dashboard</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Book Appointment", color: "bg-blue-50 text-blue-600" },
              { icon: Video, label: "Video Consult", color: "bg-purple-50 text-purple-600" },
              { icon: Pill, label: "Order Medicine", color: "bg-green-50 text-green-600" },
              { icon: Phone, label: "Emergency", color: "bg-red-50 text-red-600" },
            ].map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <Link href="/patient/appointments">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((apt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                          {apt.doctor.charAt(4)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{apt.date}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </div>
                      <Badge
                        variant="secondary"
                        className={apt.type === "Video" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}
                      >
                        {apt.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Prescriptions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Active Prescriptions</CardTitle>
                <Link href="/patient/prescriptions">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPrescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Pill className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{rx.medicine}</p>
                        <p className="text-sm text-gray-500">{rx.dosage}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{rx.days}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
