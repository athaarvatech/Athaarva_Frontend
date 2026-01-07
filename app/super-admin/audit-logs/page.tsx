"use client";

import { useEffect, useState, Fragment } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Clock,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Types
interface AuditLog {
  id: string;
  tenant_id: string | null;
  tenant_code: string | null;
  user_id: string | null;
  user_email: string | null;
  action: string;
  resource: string;
  resource_id: string | null;
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

interface AuditLogStats {
  total_logs: number;
  success_count: number;
  error_count: number;
  unique_users: number;
  unique_tenants: number;
  actions_breakdown: Record<string, number>;
}

// API helpers
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("super_admin_token")
      : null;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v2/super-admin";

async function fetchAuditLogs(params: {
  action?: string;
  resource?: string;
  tenant_id?: string;
  user_id?: string;
  success?: boolean;
  search?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLog[]> {
  const searchParams = new URLSearchParams();
  if (params.action) searchParams.append("action", params.action);
  if (params.resource) searchParams.append("resource", params.resource);
  if (params.tenant_id) searchParams.append("tenant_id", params.tenant_id);
  if (params.user_id) searchParams.append("user_id", params.user_id);
  if (params.success !== undefined)
    searchParams.append("success", String(params.success));
  if (params.search) searchParams.append("search", params.search);
  if (params.start_date) searchParams.append("start_date", params.start_date);
  if (params.end_date) searchParams.append("end_date", params.end_date);
  if (params.limit) searchParams.append("limit", String(params.limit));
  if (params.offset) searchParams.append("offset", String(params.offset));

  const response = await fetch(`${BASE_URL}/audit-logs?${searchParams}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch audit logs");
  return response.json();
}

async function fetchAuditLogStats(days = 7): Promise<AuditLogStats> {
  const response = await fetch(`${BASE_URL}/audit-logs/stats?days=${days}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

// Action color mapping
const actionColors: Record<string, string> = {
  login: "bg-blue-500/20 text-blue-300 border-blue-500/20",
  logout: "bg-slate-500/20 text-slate-300 border-slate-500/20",
  create: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  update: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
  delete: "bg-red-500/20 text-red-300 border-red-500/20",
  view: "bg-purple-500/20 text-purple-300 border-purple-500/20",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [successFilter, setSuccessFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };
      if (actionFilter !== "all") params.action = actionFilter;
      if (successFilter !== "all") params.success = successFilter === "true";
      if (search) params.search = search;

      const [logsData, statsData] = await Promise.all([
        fetchAuditLogs(params),
        page === 1 ? fetchAuditLogStats() : Promise.resolve(stats),
      ]);
      setLogs(logsData);
      if (statsData) setStats(statsData);
      setError(null);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      setError("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter, successFilter]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  // Toggle row expansion
  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Get action color
  const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();
    for (const [key, color] of Object.entries(actionColors)) {
      if (lowerAction.includes(key)) return color;
    }
    return "bg-white/10 text-white/70";
  };

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
          <p className="text-white/60">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-3">
            <FileText className="h-7 w-7 text-emerald-400" />
            Audit Logs
          </h1>
          <p className="text-white/60 mt-1">
            Track all system activities and changes across the platform
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          disabled={loading}
          className="border-white/20"
        >
          <RefreshCw
            className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-200">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-red-300"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <p className="text-sm text-white/60">Total Logs (7d)</p>
              <p className="text-2xl font-bold">
                {stats.total_logs.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-emerald-300/80">Successful</p>
              <p className="text-2xl font-bold text-emerald-300">
                {stats.success_count.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-red-300/80">Errors</p>
              <p className="text-2xl font-bold text-red-300">
                {stats.error_count.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-300/80">Unique Users</p>
              <p className="text-2xl font-bold text-blue-300">
                {stats.unique_users.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-purple-300/80">Unique Tenants</p>
              <p className="text-2xl font-bold text-purple-300">
                {stats.unique_tenants.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <p className="text-sm text-white/60">Top Action</p>
              <p className="text-lg font-bold truncate">
                {Object.entries(stats.actions_breakdown)[0]?.[0] || "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search actions or resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
            <Select
              value={actionFilter}
              onValueChange={(v) => {
                setActionFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="view">View</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={successFilter}
              onValueChange={(v) => {
                setSuccessFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Success</SelectItem>
                <SelectItem value="false">Errors</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Log ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No audit logs found</p>
              <p className="text-white/40 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/70 w-[40px]"></TableHead>
                    <TableHead className="text-white/70">Time</TableHead>
                    <TableHead className="text-white/70">Action</TableHead>
                    <TableHead className="text-white/70">Resource</TableHead>
                    <TableHead className="text-white/70">User</TableHead>
                    <TableHead className="text-white/70">Tenant</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <Fragment key={log.id}>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleRow(log.id)}
                          >
                            {expandedRows.has(log.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-white/40" />
                            <span className="text-white/80">
                              {formatRelativeTime(log.created_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "capitalize",
                              getActionColor(log.action)
                            )}
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-mono text-sm">
                              {log.resource}
                            </span>
                            {log.resource_id && (
                              <span className="text-xs text-white/40 ml-2">
                                #{log.resource_id.substring(0, 8)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.user_email ? (
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-white/40" />
                              <span className="text-sm truncate max-w-[150px]">
                                {log.user_email}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white/40">System</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.tenant_code ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3.5 w-3.5 text-white/40" />
                              <span className="text-sm">{log.tenant_code}</span>
                            </div>
                          ) : (
                            <span className="text-white/40">Platform</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.success ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-300 border-red-500/20">
                              <XCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(log.id) && (
                        <TableRow className="border-white/10 bg-white/[0.02]">
                          <TableCell colSpan={7} className="py-4">
                            <div className="grid grid-cols-2 gap-6 px-8">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-white/50 mb-1">
                                    Timestamp
                                  </p>
                                  <p className="text-sm font-mono">
                                    {formatDate(log.created_at)}
                                  </p>
                                </div>
                                {log.ip_address && (
                                  <div>
                                    <p className="text-xs text-white/50 mb-1">
                                      IP Address
                                    </p>
                                    <p className="text-sm font-mono">
                                      {log.ip_address}
                                    </p>
                                  </div>
                                )}
                                {log.user_agent && (
                                  <div>
                                    <p className="text-xs text-white/50 mb-1">
                                      User Agent
                                    </p>
                                    <p className="text-sm text-white/70 truncate max-w-[300px]">
                                      {log.user_agent}
                                    </p>
                                  </div>
                                )}
                                {log.error_message && (
                                  <div>
                                    <p className="text-xs text-red-400 mb-1">
                                      Error
                                    </p>
                                    <p className="text-sm text-red-300">
                                      {log.error_message}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-3">
                                {Object.keys(log.old_values).length > 0 && (
                                  <div>
                                    <p className="text-xs text-white/50 mb-1">
                                      Old Values
                                    </p>
                                    <pre className="text-xs bg-white/5 p-2 rounded overflow-auto max-h-[100px]">
                                      {JSON.stringify(log.old_values, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {Object.keys(log.new_values).length > 0 && (
                                  <div>
                                    <p className="text-xs text-white/50 mb-1">
                                      New Values
                                    </p>
                                    <pre className="text-xs bg-white/5 p-2 rounded overflow-auto max-h-[100px]">
                                      {JSON.stringify(log.new_values, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          {/* Pagination */}
          {logs.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <p className="text-sm text-white/60">
                Page {page} • Showing {logs.length} logs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="border-white/20"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={logs.length < pageSize || loading}
                  className="border-white/20"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
