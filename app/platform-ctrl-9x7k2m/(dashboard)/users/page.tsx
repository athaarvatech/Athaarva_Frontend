"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield, Mail } from "lucide-react";

export default function SecureUsersPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Access Management
        </p>
        <h2 className="text-3xl font-semibold">Platform Users</h2>
        <p className="text-white/70">
          Manage super-admin users and their access permissions.
        </p>
      </header>

      {/* Placeholder content */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Admins</p>
              <p className="text-2xl font-semibold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/20">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">2FA Enabled</p>
              <p className="text-2xl font-semibold">100%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Mail className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Pending Invites</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Users
            </span>
            <Badge className="bg-yellow-500/20 text-yellow-100 border-0">
              <UserPlus className="h-3 w-3 mr-1" /> Coming Soon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/60">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Multi-Admin Support Coming Soon</p>
            <p className="text-sm mt-2 max-w-md mx-auto">
              Role-based access control and multi-admin support is planned for a future release.
              Currently, a single super-admin account is configured via environment variables.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
