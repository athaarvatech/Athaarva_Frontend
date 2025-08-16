"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for dashboard
  const stats = {
    totalDoctors: 24,
    totalStaff: 38,
    activeDoctors: 22,
    activeStaff: 35,
    pendingApprovals: 3,
    systemAlerts: 2,
    monthlyGrowth: {
      doctors: 8.3,
      staff: 12.5,
      activeUsers: 5.7,
      efficiency: 15.2,
    },
  };

  const recentActivity = [
    {
      id: 1,
      type: "doctor_added",
      user: {
        name: "Dr. Sarah Johnson",
        avatar: null,
        department: "Cardiology",
      },
      message: "Added to Cardiology department",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "staff_added",
      user: {
        name: "Mary Williams",
        avatar: null,
        department: "ICU",
      },
      message: "Nurse added to ICU ward",
      time: "4 hours ago",
      status: "success",
    },
    {
      id: 3,
      type: "pending_approval",
      user: {
        name: "Dr. Robert Chen",
        avatar: null,
        department: "Neurology",
      },
      message: "Verification pending for Neurology",
      time: "6 hours ago",
      status: "pending",
    },
    {
      id: 4,
      type: "password_reset",
      user: {
        name: "John Doe",
        avatar: null,
        department: "Administration",
      },
      message: "Password reset completed",
      time: "1 day ago",
      status: "info",
    },
    {
      id: 5,
      type: "system_update",
      user: {
        name: "System Admin",
        avatar: null,
        department: "IT",
      },
      message: "Security patch installed successfully",
      time: "2 days ago",
      status: "success",
    },
  ];

  const pendingActions = [
    {
      id: 1,
      title: "Doctor Verification",
      description: "3 doctors pending verification",
      action: "Review",
      priority: "high",
      count: 3,
      dueDate: "Today",
    },
    {
      id: 2,
      title: "Staff Onboarding",
      description: "5 new staff members to onboard",
      action: "Process",
      priority: "medium",
      count: 5,
      dueDate: "This week",
    },
    {
      id: 3,
      title: "System Update",
      description: "Security update available",
      action: "Install",
      priority: "medium",
      count: 1,
      dueDate: "Next week",
    },
    {
      id: 4,
      title: "Backup Report",
      description: "Weekly backup completed",
      action: "View",
      priority: "low",
      count: 1,
      dueDate: "Completed",
    },
  ];

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
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
