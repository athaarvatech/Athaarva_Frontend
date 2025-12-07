"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Stethoscope,
  Activity,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useHospitalAdmin } from "./layout";
import Link from "next/link";
import { useParams } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface DashboardStats {
  totalStaff: number;
  pendingInvitations: number;
  totalDoctors: number;
  todayAppointments: number;
  totalPatients: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: string;
  type: "invitation" | "appointment" | "patient" | "staff";
  message: string;
  time: string;
  status: "success" | "pending" | "warning";
}

interface PendingAction {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
  href: string;
}

// =============================================================================
// Stats Card Component
// =============================================================================

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, change, changeLabel, icon, color }: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {change !== undefined && (
                <div className="flex items-center gap-1">
                  {isPositive && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                  {isNegative && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                  <span
                    className={`text-sm font-medium ${
                      isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {Math.abs(change)}%
                  </span>
                  {changeLabel && <span className="text-sm text-gray-400">{changeLabel}</span>}
                </div>
              )}
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              {icon}
            </div>
          </div>
          {/* Decorative gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(to right, ${color}, ${color}80)` }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// Quick Actions Component
// =============================================================================

interface QuickActionsProps {
  subdomain: string;
  primaryColor: string;
}

function QuickActions({ subdomain, primaryColor }: QuickActionsProps) {
  const actions = [
    {
      title: "Invite Team Member",
      description: "Send invitation to doctors or staff",
      icon: UserPlus,
      href: `/hospital/${subdomain}/admin/team/invite`,
    },
    {
      title: "View Appointments",
      description: "Manage today's schedule",
      icon: Calendar,
      href: `/hospital/${subdomain}/admin/appointments`,
    },
    {
      title: "View Pending",
      description: "Check pending invitations",
      icon: Clock,
      href: `/hospital/${subdomain}/admin/team/pending`,
    },
    {
      title: "View Reports",
      description: "Analytics and insights",
      icon: TrendingUp,
      href: `/hospital/${subdomain}/admin/reports`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <action.icon className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Pending Actions Component
// =============================================================================

interface PendingActionsCardProps {
  actions: PendingAction[];
  subdomain: string;
}

function PendingActionsCard({ actions, subdomain }: PendingActionsCardProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-gray-100 text-gray-700",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Pending Actions</CardTitle>
          <CardDescription>Items that need your attention</CardDescription>
        </div>
        <Badge variant="outline" className="text-amber-600 border-amber-300">
          {actions.length} pending
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">All caught up! No pending actions.</p>
            </div>
          ) : (
            actions.map((action) => (
              <div
                key={action.id}
                className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                    <Badge className={`text-xs ${priorityColors[action.priority]}`}>
                      {action.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <Link href={action.href}>
                  <Button size="sm" variant="outline">
                    {action.action}
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Recent Activity Component
// =============================================================================

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const statusIcons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    pending: <Clock className="w-4 h-4 text-amber-500" />,
    warning: <AlertCircle className="w-4 h-4 text-red-500" />,
  };

  const typeIcons = {
    invitation: <UserPlus className="w-4 h-4" />,
    appointment: <Calendar className="w-4 h-4" />,
    patient: <Users className="w-4 h-4" />,
    staff: <Stethoscope className="w-4 h-4" />,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest updates from your hospital</CardDescription>
        </div>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {typeIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                {statusIcons[activity.status]}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Onboarding Progress Component
// =============================================================================

interface OnboardingProgressProps {
  status: "pending" | "active" | "suspended";
  primaryColor: string;
}

function OnboardingProgress({ status, primaryColor }: OnboardingProgressProps) {
  const isPending = status === "pending";

  if (!isPending) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Onboarding Under Review</h3>
              <p className="text-sm text-amber-700 mt-1">
                Your hospital profile is being reviewed by our team. This usually takes 1-2 business
                days. You can still invite team members while waiting.
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-amber-600 mb-1">
                  <span>Review Progress</span>
                  <span>In Progress</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// Welcome Banner Component
// =============================================================================

interface WelcomeBannerProps {
  hospitalName: string;
  userName: string;
  primaryColor: string;
}

function WelcomeBanner({ hospitalName, userName, primaryColor }: WelcomeBannerProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-white/80">
            Welcome to {hospitalName} Admin Portal. Here's your overview for today.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Main Dashboard Page
// =============================================================================

export default function HospitalAdminDashboard() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const { hospital, user } = useHospitalAdmin();

  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    pendingInvitations: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    totalPatients: 0,
    monthlyRevenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  const primaryColor = hospital?.primary_color || "#007C7C";
  const secondaryColor = hospital?.secondary_color || "#20B2AA";

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setStats({
      totalStaff: 12,
      pendingInvitations: 5,
      totalDoctors: 8,
      todayAppointments: 24,
      totalPatients: 156,
      monthlyRevenue: 125000,
    });

    setRecentActivity([
      {
        id: "1",
        type: "invitation",
        message: "Dr. John Smith accepted their invitation",
        time: "2 hours ago",
        status: "success",
      },
      {
        id: "2",
        type: "appointment",
        message: "New appointment scheduled for tomorrow",
        time: "4 hours ago",
        status: "success",
      },
      {
        id: "3",
        type: "invitation",
        message: "Invitation sent to nurse.jane@email.com",
        time: "5 hours ago",
        status: "pending",
      },
      {
        id: "4",
        type: "patient",
        message: "New patient registration completed",
        time: "6 hours ago",
        status: "success",
      },
    ]);

    setPendingActions([
      {
        id: "1",
        title: "Complete Staff Invitations",
        description: "5 team members from onboarding haven't been invited yet",
        priority: "high",
        action: "Invite",
        href: `/hospital/${subdomain}/admin/team/invite`,
      },
      {
        id: "2",
        title: "Review Doctor Schedules",
        description: "3 doctors haven't set their availability",
        priority: "medium",
        action: "Review",
        href: `/hospital/${subdomain}/admin/doctors`,
      },
    ]);
  }, [subdomain]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner
        hospitalName={hospital?.hospital_name || "Your Hospital"}
        userName={user?.full_name?.split(" ")[0] || "Admin"}
        primaryColor={primaryColor}
      />

      {/* Onboarding Progress (if pending) */}
      <OnboardingProgress status={hospital?.status || "pending"} primaryColor={primaryColor} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Staff"
          value={stats.totalStaff}
          change={12}
          changeLabel="vs last month"
          icon={<Users className="w-6 h-6" style={{ color: primaryColor }} />}
          color={primaryColor}
        />
        <StatsCard
          title="Pending Invitations"
          value={stats.pendingInvitations}
          icon={<UserPlus className="w-6 h-6" style={{ color: "#F59E0B" }} />}
          color="#F59E0B"
        />
        <StatsCard
          title="Active Doctors"
          value={stats.totalDoctors}
          change={8}
          changeLabel="vs last month"
          icon={<Stethoscope className="w-6 h-6" style={{ color: secondaryColor }} />}
          color={secondaryColor}
        />
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<Calendar className="w-6 h-6" style={{ color: "#8B5CF6" }} />}
          color="#8B5CF6"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Pending */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions subdomain={subdomain} primaryColor={primaryColor} />
          <PendingActionsCard actions={pendingActions} subdomain={subdomain} />
        </div>

        {/* Right Column - Recent Activity */}
        <div>
          <RecentActivityCard activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
