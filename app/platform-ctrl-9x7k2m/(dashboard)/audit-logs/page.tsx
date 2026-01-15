"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Shield,
  Clock,
  Globe,
  Monitor,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { superAdminSecurityAPI } from "@/lib/super-admin-config";
import { toast } from "sonner";

interface AccessLog {
  id: string;
  admin_id: string;
  action: string;
  ip_address: string;
  user_agent: string;
  details: Record<string, unknown>;
  success: boolean;
  created_at: string;
}

export default function SecureAuditLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const sessionToken = localStorage.getItem("super_admin_session_token");
        if (!sessionToken) {
          toast.error("Session not found");
          return;
        }
        const data = await superAdminSecurityAPI.getAccessLogs(sessionToken, 100);
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Failed to load access logs:", error);
        toast.error("Failed to load access logs");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const getActionBadge = (action: string, success: boolean) => {
    if (!success) {
      return (
        <Badge className="bg-red-500/20 text-red-100 border-0">
          <AlertTriangle className="h-3 w-3 mr-1" /> Failed: {action}
        </Badge>
      );
    }
    
    const colors: Record<string, string> = {
      login_initiated: "bg-blue-500/20 text-blue-100",
      otp_verified: "bg-emerald-500/20 text-emerald-100",
      logout: "bg-yellow-500/20 text-yellow-100",
      session_validated: "bg-slate-500/20 text-slate-100",
    };
    
    return (
      <Badge className={`${colors[action] || "bg-white/10 text-white"} border-0`}>
        <CheckCircle2 className="h-3 w-3 mr-1" /> {action.replace(/_/g, " ")}
      </Badge>
    );
  };

  const parseUserAgent = (ua: string) => {
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Unknown";
  };

  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Security & Compliance
        </p>
        <h2 className="text-3xl font-semibold">Access Audit Logs</h2>
        <p className="text-white/70">
          Complete audit trail of all super-admin access and actions.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Total Events</p>
            <p className="text-3xl font-semibold">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Successful</p>
            <p className="text-3xl font-semibold text-emerald-200">
              {logs.filter((l) => l.success).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Failed</p>
            <p className="text-3xl font-semibold text-red-200">
              {logs.filter((l) => !l.success).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Unique IPs</p>
            <p className="text-3xl font-semibold">
              {new Set(logs.map((l) => l.ip_address)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Event Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-white/60">
                      Loading audit logs…
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-white/50" />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action, log.success)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-white/50" />
                          <code className="bg-white/10 px-2 py-0.5 rounded">
                            {log.ip_address}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Monitor className="h-4 w-4" />
                          {parseUserAgent(log.user_agent)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-white/60 max-w-xs truncate">
                        {JSON.stringify(log.details || {})}
                      </TableCell>
                    </TableRow>
                  ))}
                {!loading && logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-white/60">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
