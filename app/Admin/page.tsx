"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Stethoscope,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowUp,
  Eye,
  Settings,
  Download,
  Bell,
  Filter,
  Loader2,
  HeartPulse,
  ShieldCheck,
  BarChart3,
  Wifi,
  ServerCog,
  Thermometer,
  ClipboardCheck,
  Radar,
  Target,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAdminDashboard, useAdminRefresh } from "@/hooks/useAdminDashboard";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const {
    stats,
    recentActivity,
    pendingActions,
    isLoading,
    error,
    refetch,
    isUsingMockData,
  } = useAdminDashboard();
  
  const { isRefreshing, refreshAll } = useAdminRefresh();

  const handleRefresh = async () => {
    await refreshAll([refetch]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "doctor_added":
      case "staff_added":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending_approval":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "password_reset":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "system_update":
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-3 w-3" />;
      case "medium":
        return <Clock className="h-3 w-3" />;
      case "low":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#007C7C]" />
          <p className="text-[#6B7280]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <p className="text-red-600">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // If no stats loaded yet
  if (!stats) {
    return null;
  }

  const formatPercent = (value: number) =>
    Math.min(100, Math.max(0, Math.round(value)));

  const doctorCoverage = formatPercent(
    (stats.activeDoctors / Math.max(stats.totalDoctors, 1)) * 100
  );
  const staffCoverage = formatPercent(
    (stats.activeStaff / Math.max(stats.totalStaff, 1)) * 100
  );

  const workforcePulse = [
    {
      label: "Doctor Coverage",
      value: doctorCoverage,
      detail: `${stats.activeDoctors}/${stats.totalDoctors} doctors online`,
      trend: "+3% vs last week",
      accent: "from-[#007C7C] via-[#0EB1A0] to-[#20B2AA]",
    },
    {
      label: "Staff Utilization",
      value: staffCoverage,
      detail: `${stats.activeStaff}/${stats.totalStaff} staff active`,
      trend: "+5% shift compliance",
      accent: "from-[#20B2AA] via-[#38BDF8] to-[#5EEAD4]",
    },
  ];

  const operationalInsights = [
    {
      title: "Patient Throughput",
      value: "312",
      change: "+8%",
      description: "Avg admissions per day",
      icon: Activity,
      accent: "bg-[#007C7C]/10 text-[#007C7C]",
    },
    {
      title: "Bed Occupancy",
      value: "78%",
      change: "+4%",
      description: "Across critical care",
      icon: BarChart3,
      accent: "bg-[#20B2AA]/10 text-[#20B2AA]",
    },
    {
      title: "Telehealth",
      value: "99.3%",
      change: "stable",
      description: "Platform uptime",
      icon: Wifi,
      accent: "bg-[#50C878]/10 text-[#1C8C64]",
    },
    {
      title: "System Alerts",
      value: stats.systemAlerts.toString(),
      change: "2 critical",
      description: "Security + infra",
      icon: ShieldCheck,
      accent: "bg-red-50 text-red-600",
    },
  ];

  const onboardingMilestones = [
    {
      id: "credential",
      title: "Credential Verification",
      owner: "Medical HR",
      completion: 82,
      eta: "2 days",
    },
    {
      id: "orientation",
      title: "Clinical Orientation",
      owner: "Nursing Ops",
      completion: 64,
      eta: "5 days",
    },
    {
      id: "it-access",
      title: "IT Access Provisioning",
      owner: "IT Security",
      completion: 71,
      eta: "3 days",
    },
  ];

  const infrastructureSignals = [
    {
      title: "EHR Cluster",
      status: "Operational",
      detail: "Latency 112ms",
      icon: ServerCog,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Imaging Network",
      status: "Watching",
      detail: "Bandwidth spike",
      icon: Radar,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      title: "Pharmacy Cold Chain",
      status: "Action Needed",
      detail: "Temp variance",
      icon: Thermometer,
      tone: "text-red-600 bg-red-50",
    },
  ];

  const complianceChecklist = [
    {
      title: "NABH Surveillance Audit",
      status: "Scheduled",
      due: "Mar 28",
      owner: "Quality Team",
      severity: "medium",
    },
    {
      title: "Radiation Safety Logs",
      status: "In Review",
      due: "Mar 22",
      owner: "Radiology",
      severity: "high",
    },
    {
      title: "Telemedicine Consent",
      status: "Updated",
      due: "Mar 30",
      owner: "Legal",
      severity: "low",
    },
  ];

  return (
    <div className="space-y-8">
      {isUsingMockData && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Live data temporarily unavailable</p>
            <p className="text-amber-800/90">
              {error ?? "The backend API is unreachable right now. Showing simulated operations data so the dashboard stays useful."}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">
            Hospital Administration
          </h1>
          <p className="text-[#6B7280] text-lg">
            Manage your healthcare team and monitor system performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-[#007C7C]/20 text-[#007C7C] hover:bg-[#007C7C]/5"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-[#007C7C] to-[#20B2AA] hover:from-[#006666] hover:to-[#1a9999] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/Admin/add-doctor">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Doctor
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-white transition-all duration-300"
          >
            <Link href="/Admin/add-staff">
              <Users className="mr-2 h-4 w-4" />
              Add Staff
            </Link>
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#007C7C]/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#F0F9FA]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Total Doctors
            </CardTitle>
            <div className="p-2 bg-[#007C7C]/10 rounded-lg">
              <Stethoscope className="h-5 w-5 text-[#007C7C]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#007C7C] mb-1">
              {stats.totalDoctors}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="h-3 w-3 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">
                +{stats.monthlyGrowth.doctors}%
              </span>
              <span className="text-[#6B7280] ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#20B2AA]/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#F0FDFC]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Total Staff
            </CardTitle>
            <div className="p-2 bg-[#20B2AA]/10 rounded-lg">
              <Users className="h-5 w-5 text-[#20B2AA]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#20B2AA] mb-1">
              {stats.totalStaff}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="h-3 w-3 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">
                +{stats.monthlyGrowth.staff}%
              </span>
              <span className="text-[#6B7280] ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#50C878]/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#F0FDF4]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Active Today
            </CardTitle>
            <div className="p-2 bg-[#50C878]/10 rounded-lg">
              <Activity className="h-5 w-5 text-[#50C878]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#50C878] mb-1">
              {stats.activeDoctors + stats.activeStaff}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="h-3 w-3 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">
                +{stats.monthlyGrowth.activeUsers}%
              </span>
              <span className="text-[#6B7280] ml-1">active users</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Pending Actions
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.pendingApprovals}
            </div>
            <div className="flex items-center text-sm">
              <Bell className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">
                Require attention
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Intelligence */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
            <HeartPulse className="h-5 w-5 text-[#007C7C]" />
            Operational Intelligence Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {operationalInsights.map((insight) => (
              <div
                key={insight.title}
                className="p-4 rounded-2xl border border-slate-100 hover:border-[#007C7C]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${insight.accent}`}>
                  <insight.icon className="h-4 w-4" />
                  {insight.title}
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-900">{insight.value}</p>
                  <span className="text-sm text-emerald-600 font-semibold">{insight.change}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workforce Pulse & Onboarding */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 lg:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#007C7C]" />
              Workforce Pulse
            </CardTitle>
            <p className="text-sm text-slate-500">
              Live signal on coverage, engagement, and efficiency
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {workforcePulse.map((pulse) => (
                <div
                  key={pulse.label}
                  className="p-5 rounded-2xl border border-slate-100 bg-white shadow-inner"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {pulse.label}
                    </p>
                    <span className="text-xs text-emerald-600 font-medium">
                      {pulse.trend}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-[#007C7C]">
                      {pulse.value}%
                    </span>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      live
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{pulse.detail}</p>
                  <Progress
                    value={pulse.value}
                    indicatorClassName={`bg-gradient-to-r ${pulse.accent}`}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Shift Compliance",
                  value: "94%",
                  detail: "Roster adherence",
                  icon: ClipboardCheck,
                },
                {
                  label: "Credential Currency",
                  value: "88%",
                  detail: "Licenses up to date",
                  icon: ShieldCheck,
                },
                {
                  label: "Response SLAs",
                  value: "12m",
                  detail: "Avg ticket clear",
                  icon: Clock,
                },
              ].map((pulse) => (
                <div
                  key={pulse.label}
                  className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center gap-3"
                >
                  <div className="p-3 rounded-xl bg-[#007C7C]/10">
                    <pulse.icon className="h-5 w-5 text-[#007C7C]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{pulse.label}</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {pulse.value}
                    </p>
                    <p className="text-xs text-slate-400">{pulse.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#20B2AA]" />
              Onboarding Pipeline
            </CardTitle>
            <p className="text-sm text-slate-500">
              Track cross-team dependencies for new clinicians
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {onboardingMilestones.map((milestone, index) => (
              <div key={milestone.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {milestone.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Owner: {milestone.owner}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ETA {milestone.eta}
                  </Badge>
                </div>
                <Progress
                  value={milestone.completion}
                  className="h-2 bg-slate-100"
                  indicatorClassName="bg-gradient-to-r from-[#007C7C] to-[#20B2AA]"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{milestone.completion}% complete</span>
                  <span>Stage {index + 1} of {onboardingMilestones.length}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Enhanced Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-[#007C7C]/10 rounded-lg">
                    <Activity className="h-5 w-5 text-[#007C7C]" />
                  </div>
                  Recent Activity
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Filter className="mr-1 h-3 w-3" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Eye className="mr-1 h-3 w-3" />
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-6 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                        <span className="text-sm font-semibold text-slate-700">
                          {activity.user.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getActivityIcon(activity.type)}
                        <p className="text-sm font-medium text-slate-900">
                          {activity.user.name}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.user.department}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Pending Actions */}
        <div>
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900">
                          {action.title}
                        </h4>
                        {action.count > 1 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <Badge className={getPriorityColor(action.priority)}>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(action.priority)}
                          <span className="capitalize text-xs">
                            {action.priority}
                          </span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Due: {action.dueDate}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 group-hover:bg-[#007C7C] group-hover:text-white group-hover:border-[#007C7C] transition-colors"
                      >
                        {action.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance & System Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#007C7C]" />
              Compliance Watchlist
            </CardTitle>
            <p className="text-sm text-slate-500">
              High-stakes activities tied to accreditation & safety
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {complianceChecklist.map((item) => (
              <div
                key={item.title}
                className="p-4 border border-slate-100 rounded-2xl hover:border-[#007C7C]/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">Owner: {item.owner}</p>
                  </div>
                  <Badge
                    className={
                      item.severity === "high"
                        ? "bg-red-50 text-red-600 border-red-200"
                        : item.severity === "medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Due {item.due}</span>
                  <div className="inline-flex items-center gap-1">
                    <ClipboardCheck className="h-3 w-3" />
                    Severity: {item.severity}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <ServerCog className="h-5 w-5 text-[#20B2AA]" />
              System Health Signals
            </CardTitle>
            <p className="text-sm text-slate-500">
              Real-time visibility into hospital infrastructure
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {infrastructureSignals.map((signal) => (
              <div
                key={signal.title}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`${signal.tone} p-3 rounded-xl`}> 
                    <signal.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {signal.title}
                    </p>
                    <p className="text-xs text-slate-500">{signal.detail}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {signal.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-[#007C7C]/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#007C7C]" />
              </div>
              Quick Actions & Management
            </CardTitle>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 border-[#007C7C]/20 hover:bg-[#007C7C]/5 hover:border-[#007C7C] transition-all duration-300 group"
            >
              <Link href="/Admin/manage-doctors">
                <div className="p-3 bg-[#007C7C]/10 rounded-xl group-hover:bg-[#007C7C] group-hover:text-white transition-colors">
                  <Stethoscope className="h-8 w-8 text-[#007C7C] group-hover:text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-900 group-hover:text-[#007C7C]">
                    Manage Doctors
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    View & edit doctor profiles
                  </p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 border-[#20B2AA]/20 hover:bg-[#20B2AA]/5 hover:border-[#20B2AA] transition-all duration-300 group"
            >
              <Link href="/Admin/manage-staff">
                <div className="p-3 bg-[#20B2AA]/10 rounded-xl group-hover:bg-[#20B2AA] group-hover:text-white transition-colors">
                  <Users className="h-8 w-8 text-[#20B2AA] group-hover:text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-900 group-hover:text-[#20B2AA]">
                    Manage Staff
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Oversee staff members
                  </p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 border-[#50C878]/20 hover:bg-[#50C878]/5 hover:border-[#50C878] transition-all duration-300 group"
            >
              <Link href="/Admin/branding">
                <div className="p-3 bg-[#50C878]/10 rounded-xl group-hover:bg-[#50C878] group-hover:text-white transition-colors">
                  <Shield className="h-8 w-8 text-[#50C878] group-hover:text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-900 group-hover:text-[#50C878]">
                    Hospital Branding
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Customize hospital identity
                  </p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 group"
            >
              <Link href="/Admin/settings">
                <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
                  <Settings className="h-8 w-8 text-slate-600" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-900">
                    System Settings
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure system preferences
                  </p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
