"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Server, HardDrive, Activity, CheckCircle2 } from "lucide-react";

const dbStats = {
  version: "PostgreSQL 15.4",
  uptime: "45 days, 12 hours",
  connections: {
    active: 24,
    idle: 8,
    max: 100,
  },
  storage: {
    used: "12.4 GB",
    total: "100 GB",
    percentage: 12.4,
  },
  tables: [
    { schema: "platform", name: "tenants", rows: "45", size: "256 KB" },
    { schema: "platform", name: "super_admin_users", rows: "1", size: "8 KB" },
    { schema: "platform", name: "super_admin_sessions", rows: "12", size: "16 KB" },
    { schema: "platform", name: "super_admin_access_log", rows: "1,247", size: "512 KB" },
    { schema: "platform", name: "invitations", rows: "89", size: "64 KB" },
  ],
};

export default function SecureDatabasePage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Infrastructure
        </p>
        <h2 className="text-3xl font-semibold">Database Overview</h2>
        <p className="text-white/70">
          Monitor database health, connections, and storage usage.
        </p>
      </header>

      {/* Status Banner */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-slate-900/50 border-emerald-500/20">
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Database className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="font-medium">{dbStats.version}</p>
              <p className="text-sm text-white/60">Uptime: {dbStats.uptime}</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-100 border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Healthy
          </Badge>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Server className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Active Connections</p>
                <p className="text-2xl font-semibold">
                  {dbStats.connections.active}
                  <span className="text-sm text-white/50 ml-1">
                    / {dbStats.connections.max}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <HardDrive className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Storage Used</p>
                <p className="text-2xl font-semibold">
                  {dbStats.storage.used}
                  <span className="text-sm text-white/50 ml-1">
                    / {dbStats.storage.total}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Idle Connections</p>
                <p className="text-2xl font-semibold">{dbStats.connections.idle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Progress */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Used: {dbStats.storage.used}</span>
              <span className="text-white/60">Total: {dbStats.storage.total}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                style={{ width: `${dbStats.storage.percentage}%` }}
              />
            </div>
            <p className="text-xs text-white/50">
              {dbStats.storage.percentage}% of storage used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tables Overview */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Platform Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Schema</th>
                  <th className="text-left py-3 px-4 text-white/60">Table</th>
                  <th className="text-right py-3 px-4 text-white/60">Rows</th>
                  <th className="text-right py-3 px-4 text-white/60">Size</th>
                </tr>
              </thead>
              <tbody>
                {dbStats.tables.map((table) => (
                  <tr key={`${table.schema}.${table.name}`} className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-white/10 px-2 py-0.5 rounded text-xs">
                        {table.schema}
                      </code>
                    </td>
                    <td className="py-3 px-4 font-medium">{table.name}</td>
                    <td className="py-3 px-4 text-right text-white/70">{table.rows}</td>
                    <td className="py-3 px-4 text-right text-white/70">{table.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
