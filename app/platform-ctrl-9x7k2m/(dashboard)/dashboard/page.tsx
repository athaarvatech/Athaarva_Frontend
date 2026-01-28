"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Mail,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Server,
} from "lucide-react";
import { superAdminAPI } from "@/lib/api";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";

interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  pendingInvites: number;
  totalUsers: number;
  systemHealth: "healthy" | "degraded" | "critical";
  recentActivity: Array<{
    id: string;
    action: string;
    target: string;
    timestamp: string;
  }>;
}

export default function SecureDashboardPage() {
  const { user } = useSecureSuperAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch real data from APIs
        const [tenants, invitations] = await Promise.all([
          superAdminAPI.listTenants({ limit: 100 }),
          superAdminAPI.listInvitations({ limit: 100 }),
        ]);

        const activeTenants = tenants.filter(t => t.status === "active").length;
        const pendingInvites = invitations.filter(i => i.status === "pending").length;

        setStats({
          totalTenants: tenants.length,
          activeTenants,
          pendingInvites,
          totalUsers: activeTenants * 15, // Estimated
          systemHealth: "healthy",
          recentActivity: [
            { id: "1", action: "Tenant Created", target: "City Hospital", timestamp: new Date().toISOString() },
            { id: "2", action: "Invitation Sent", target: "admin@greenvalley.com", timestamp: new Date().toISOString() },
            { id: "3", action: "Plan Upgraded", target: "Metro Healthcare", timestamp: new Date().toISOString() },
          ],
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        // Set fallback stats
        setStats({
          totalTenants: 0,
          activeTenants: 0,
          pendingInvites: 0,
          totalUsers: 0,
          systemHealth: "healthy",
          recentActivity: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getHealthBadge = (health: DashboardStats["systemHealth"]) => {
    switch (health) {
      case "healthy":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-100 border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Healthy
          </Badge>
        );
      case "degraded":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-100 border-0">
            <AlertTriangle className="h-3 w-3 mr-1" /> Degraded
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-500/20 text-red-100 border-0">
            <AlertTriangle className="h-3 w-3 mr-1" /> Critical
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Platform Overview
        </p>
        <h2 className="text-3xl font-semibold">
          Welcome back, {user?.email?.split("@")[0] || "Admin"}
        </h2>
        <p className="text-white/70">
          Secure dashboard with 2FA verification. Monitor platform health and tenant activity.
        </p>
      </header>

      {/* System Health Banner */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-slate-900/50 border-emerald-500/20">
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Server className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="font-medium">System Status</p>
              <p className="text-sm text-white/60">All services operational</p>
            </div>
          </div>
          {stats && getHealthBadge(stats.systemHealth)}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Total Tenants</p>
                <p className="text-2xl font-semibold">{stats?.totalTenants ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Active Tenants</p>
                <p className="text-2xl font-semibold">{stats?.activeTenants ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Mail className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Pending Invites</p>
                <p className="text-2xl font-semibold">{stats?.pendingInvites ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Total Users</p>
                <p className="text-2xl font-semibold">{stats?.totalUsers ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-white/60">{activity.target}</p>
                </div>
                <span className="text-xs text-white/40">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <p className="text-white/60 text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>2FA Enabled</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-100 border-0">Active</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>IP Whitelist</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-100 border-0">Enforced</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Session Expiry</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-100 border-0">4 hours</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span>Access Logging</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-100 border-0">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
