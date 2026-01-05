"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Activity,
  Zap,
  Clock,
  DollarSign,
  BarChart3,
  TrendingUp,
  CheckCircle,
  XCircle,
  RotateCcw,
  Cpu,
  Layers,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AIModel {
  id: string;
  provider: string;
  model_name: string;
  model_version: string;
  modality: string;
  capabilities: string[];
  is_active: boolean;
  usage_count: number;
  total_tokens: number;
}

interface AIUsageEvent {
  id: string;
  tenant_id?: string;
  tenant_code?: string;
  user_email?: string;
  provider?: string;
  model_name?: string;
  input_tokens?: number;
  output_tokens?: number;
  latency_ms?: number;
  disposition?: string;
  created_at: string;
}

interface AIStats {
  total_requests: number;
  total_input_tokens: number;
  total_output_tokens: number;
  avg_latency_ms: number;
  requests_by_model: Record<string, number>;
  tokens_by_model: Record<string, number>;
  requests_by_tenant: Record<string, number>;
  error_count: number;
  success_rate: number;
}

export default function AITelemetryPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [usageEvents, setUsageEvents] = useState<AIUsageEvent[]>([]);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");

  const fetchData = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setLoading(true);
    try {
      const [modelsRes, usageRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v2/super-admin/ai/models`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/v2/super-admin/ai/usage?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/v2/super-admin/ai/stats?days=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (modelsRes.ok) setModels(await modelsRes.json());
      if (usageRes.ok) setUsageEvents(await usageRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      openai: "bg-green-100 text-green-800",
      anthropic: "bg-orange-100 text-orange-800",
      google: "bg-blue-100 text-blue-800",
      azure: "bg-cyan-100 text-cyan-800",
      bedrock: "bg-purple-100 text-purple-800",
    };
    return colors[provider.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const totalTokens = stats
    ? stats.total_input_tokens + stats.total_output_tokens
    : 0;

  // Estimated cost (rough approximation)
  const estimatedCost = totalTokens * 0.00001; // Very rough estimate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Brain className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Telemetry</h1>
            <p className="text-gray-500">Monitor AI usage, performance, and costs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchData} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold">
                  {formatNumber(stats?.total_requests || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tokens</p>
                <p className="text-3xl font-bold">{formatNumber(totalTokens)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Latency</p>
                <p className="text-3xl font-bold">
                  {Math.round(stats?.avg_latency_ms || 0)}
                  <span className="text-lg text-gray-500">ms</span>
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {(stats?.success_rate || 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={stats?.success_rate || 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Est. Cost</p>
                <p className="text-3xl font-bold">
                  ${estimatedCost.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Usage Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Requests by Model */}
            <Card>
              <CardHeader>
                <CardTitle>Requests by Model</CardTitle>
                <CardDescription>Distribution of AI requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.requests_by_model || {}).map(
                    ([model, count]) => {
                      const total = stats?.total_requests || 1;
                      const percent = Math.round((count / total) * 100);
                      return (
                        <div key={model} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{model}</span>
                            <span className="text-gray-500">
                              {formatNumber(count)} ({percent}%)
                            </span>
                          </div>
                          <Progress value={percent} />
                        </div>
                      );
                    }
                  )}
                  {Object.keys(stats?.requests_by_model || {}).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tokens by Model */}
            <Card>
              <CardHeader>
                <CardTitle>Tokens by Model</CardTitle>
                <CardDescription>Token consumption by model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.tokens_by_model || {}).map(
                    ([model, tokens]) => {
                      const percent = totalTokens > 0
                        ? Math.round((tokens / totalTokens) * 100)
                        : 0;
                      return (
                        <div key={model} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{model}</span>
                            <span className="text-gray-500">
                              {formatNumber(tokens)} ({percent}%)
                            </span>
                          </div>
                          <Progress value={percent} className="bg-purple-100" />
                        </div>
                      );
                    }
                  )}
                  {Object.keys(stats?.tokens_by_model || {}).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Tenants */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Tenants by Usage</CardTitle>
                <CardDescription>AI consumption by tenant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(stats?.requests_by_tenant || {})
                    .slice(0, 10)
                    .map(([tenant, count]) => (
                      <div
                        key={tenant}
                        className="p-4 border rounded-lg text-center"
                      >
                        <p className="text-2xl font-bold">{formatNumber(count)}</p>
                        <p className="text-sm text-gray-500">{tenant}</p>
                      </div>
                    ))}
                  {Object.keys(stats?.requests_by_tenant || {}).length === 0 && (
                    <p className="col-span-full text-gray-500 text-center py-4">
                      No tenant data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.model_name}</CardTitle>
                    <Badge variant={model.is_active ? "default" : "secondary"}>
                      {model.is_active ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <CardDescription>
                    <Badge className={getProviderColor(model.provider)}>
                      {model.provider}
                    </Badge>
                    <span className="ml-2 text-gray-500">v{model.model_version}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold">
                          {formatNumber(model.usage_count)}
                        </p>
                        <p className="text-xs text-gray-500">Requests</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold">
                          {formatNumber(model.total_tokens)}
                        </p>
                        <p className="text-xs text-gray-500">Tokens</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.slice(0, 5).map((cap) => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Modality</span>
                      <span className="font-medium">{model.modality}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {models.length === 0 && !loading && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-gray-500">
                  No AI models registered
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Usage Events</CardTitle>
              <CardDescription>Latest AI API calls</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Tokens (In/Out)</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {event.disposition === "error" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {event.model_name || "Unknown"}
                          </p>
                          {event.provider && (
                            <Badge
                              className={getProviderColor(event.provider)}
                              variant="outline"
                            >
                              {event.provider}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.tenant_code ? (
                          <Badge variant="outline">{event.tenant_code}</Badge>
                        ) : (
                          <span className="text-gray-400">Platform</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {event.user_email || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600">
                          {formatNumber(event.input_tokens || 0)}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-green-600">
                          {formatNumber(event.output_tokens || 0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {event.latency_ms ? `${event.latency_ms}ms` : "—"}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {usageEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No usage events recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
