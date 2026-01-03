"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCog,
  Play,
  Square,
  History,
  AlertTriangle,
  Search,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  User,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface User {
  id: string;
  email: string;
  user_type: string;
  tenant_id?: string;
  tenant_code?: string;
  is_active: boolean;
}

interface ImpersonationLog {
  id: string;
  super_admin_id: string;
  super_admin_email: string;
  target_user_id: string;
  target_user_email: string;
  tenant_id?: string;
  tenant_code?: string;
  reason?: string;
  started_at: string;
  ended_at?: string;
  ip_address?: string;
}

interface ImpersonationSession {
  id: string;
  super_admin_id: string;
  super_admin_email: string;
  target_user_id: string;
  target_user_email: string;
  target_user_type: string;
  tenant_id?: string;
  tenant_code?: string;
  reason: string;
  started_at: string;
  impersonation_token: string;
}

export default function ImpersonatePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ImpersonationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  
  // Impersonation dialog state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [impersonating, setImpersonating] = useState(false);
  const [activeSession, setActiveSession] = useState<ImpersonationSession | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);

  const fetchUsers = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/users?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.filter((u: User) => u.user_type !== "super_admin"));
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchLogs = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/impersonate/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const startImpersonation = async () => {
    if (!selectedUser || !reason.trim()) return;

    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setImpersonating(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/impersonate/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_user_id: selectedUser.id,
          reason: reason.trim(),
        }),
      });

      if (res.ok) {
        const session = await res.json();
        setActiveSession(session);
        setShowTokenDialog(true);
        setSelectedUser(null);
        setReason("");
        fetchLogs();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to start impersonation");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setImpersonating(false);
    }
  };

  const copyToken = () => {
    if (activeSession?.impersonation_token) {
      navigator.clipboard.writeText(activeSession.impersonation_token);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tenant_code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === "all" || user.user_type === userTypeFilter;
    return matchesSearch && matchesType;
  });

  const getUserTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      patient: "bg-blue-100 text-blue-800",
      doctor: "bg-green-100 text-green-800",
      hospital_admin: "bg-purple-100 text-purple-800",
      admin: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <UserCog className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Impersonation</h1>
          <p className="text-gray-500">Login as any user for debugging and support</p>
        </div>
      </div>

      {/* Warning Banner */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Security Notice:</strong> All impersonation sessions are logged for audit purposes.
          Only use this feature for legitimate support and debugging purposes.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Select User
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Impersonation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by email or tenant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All User Types</SelectItem>
                    <SelectItem value="patient">Patients</SelectItem>
                    <SelectItem value="doctor">Doctors</SelectItem>
                    <SelectItem value="hospital_admin">Hospital Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Select a user to impersonate</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(0, 50).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getUserTypeBadge(user.user_type)}>
                          {user.user_type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.tenant_code ? (
                          <Badge variant="outline">{user.tenant_code}</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Impersonate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impersonation History</CardTitle>
              <CardDescription>Audit log of all impersonation sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const started = new Date(log.started_at);
                    const ended = log.ended_at ? new Date(log.ended_at) : null;
                    const duration = ended
                      ? Math.round((ended.getTime() - started.getTime()) / 1000 / 60)
                      : null;

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.super_admin_email}
                        </TableCell>
                        <TableCell>{log.target_user_email}</TableCell>
                        <TableCell>
                          {log.tenant_code ? (
                            <Badge variant="outline">{log.tenant_code}</Badge>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.reason || "—"}
                        </TableCell>
                        <TableCell>{started.toLocaleString()}</TableCell>
                        <TableCell>
                          {duration !== null ? (
                            <span className="text-green-600">{duration} min</span>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-500 font-mono text-sm">
                          {log.ip_address || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No impersonation history found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Impersonation Reason Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription>
              You are about to impersonate <strong>{selectedUser?.email}</strong>.
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Impersonation</Label>
              <Textarea
                placeholder="e.g., Investigating user-reported bug #1234"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <p className="text-sm text-gray-500">
                This will be logged for audit purposes
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={startImpersonation}
              disabled={!reason.trim() || impersonating}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {impersonating ? "Starting..." : "Start Impersonation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Display Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Impersonation Session Started
            </DialogTitle>
            <DialogDescription>
              You are now impersonating{" "}
              <strong>{activeSession?.target_user_email}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Use the token below to access the application as this user.
                The session will be logged for audit purposes.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Impersonation Token</Label>
              <div className="relative">
                <Input
                  value={activeSession?.impersonation_token || ""}
                  readOnly
                  className="pr-24 font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-1 top-1"
                  onClick={copyToken}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-500">User Type</Label>
                <p className="font-medium">{activeSession?.target_user_type}</p>
              </div>
              <div>
                <Label className="text-gray-500">Tenant</Label>
                <p className="font-medium">{activeSession?.tenant_code || "Platform"}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                const url = activeSession?.target_user_type === "patient"
                  ? "/patient/dashboard"
                  : activeSession?.target_user_type === "doctor"
                  ? "/doctor/dashboard"
                  : "/hospital/dashboard";
                window.open(url, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open in New Tab
            </Button>
            <Button onClick={() => setShowTokenDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
