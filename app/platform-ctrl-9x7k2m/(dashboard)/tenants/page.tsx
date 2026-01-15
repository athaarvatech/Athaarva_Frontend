"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Building2,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { superAdminAPI, type TenantResponse } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SecureTenantsPage() {
  const [tenants, setTenants] = useState<TenantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await superAdminAPI.listTenants({ limit: 50 });
        setTenants(data);
      } catch (error) {
        console.error("Failed to load tenants:", error);
        toast.error("Failed to load tenants");
      } finally {
        setLoading(false);
      }
    };
    loadTenants();
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      !searchTerm ||
      tenant.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-100 border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-500/20 text-red-100 border-0">
            <XCircle className="h-3 w-3 mr-1" /> Suspended
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-100 border-0">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-100 border-0">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Tenant Management
        </p>
        <h2 className="text-3xl font-semibold">Hospitals & Clinics</h2>
        <p className="text-white/70">
          Manage all registered healthcare tenants on the platform.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Total Tenants</p>
            <p className="text-3xl font-semibold">{tenants.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Active</p>
            <p className="text-3xl font-semibold text-emerald-200">
              {tenants.filter((t) => t.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Suspended</p>
            <p className="text-3xl font-semibold text-red-200">
              {tenants.filter((t) => t.status === "suspended").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenant Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              {["", "active", "suspended", "pending"].map((status) => (
                <button
                  key={status || "all"}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold border border-white/10 transition",
                    statusFilter === status
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {status || "All"}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or subdomain"
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Subdomain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-white/60">
                      Loading tenants…
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div className="font-semibold">{tenant.hospital_name}</div>
                        <div className="text-sm text-white/60">{tenant.contact_email}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-white/10 px-2 py-1 rounded">
                          {tenant.subdomain}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-100 border-0">
                          {tenant.plan_tier || "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                      <TableCell className="text-sm text-white/70">
                        {new Date(tenant.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70"
                            onClick={() =>
                              window.open(
                                `https://${tenant.subdomain}.athaarva.com`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {!loading && filteredTenants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-white/60">
                      No tenants found.
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
