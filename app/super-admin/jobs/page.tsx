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
  ListTodo,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Box,
  Activity,
  TrendingUp,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TaskQueue {
  id: string;
  code: string;
  name: string;
  description?: string;
  default_priority: string;
  is_active: boolean;
  task_count: number;
  pending_count: number;
  completed_count: number;
}

interface Task {
  id: string;
  tenant_id: string;
  tenant_code?: string;
  queue_id?: string;
  queue_name?: string;
  title: string;
  summary?: string;
  status: string;
  priority: string;
  assignee_email?: string;
  due_at?: string;
  created_at: string;
  updated_at: string;
}

interface TaskStats {
  total_tasks: number;
  queued: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  blocked: number;
  by_priority: Record<string, number>;
}

export default function BackgroundJobsPage() {
  const [queues, setQueues] = useState<TaskQueue[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedQueue, setSelectedQueue] = useState<string>("all");

  const fetchData = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setLoading(true);
    try {
      const [queuesRes, tasksRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v2/super-admin/jobs/queues`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/v2/super-admin/jobs/tasks?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/v2/super-admin/jobs/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (queuesRes.ok) setQueues(await queuesRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Box className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      queued: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
      blocked: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      normal: "bg-blue-100 text-blue-800",
      low: "bg-gray-100 text-gray-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesQueue = selectedQueue === "all" || task.queue_id === selectedQueue;
    return matchesStatus && matchesPriority && matchesQueue;
  });

  const totalPending = stats ? stats.queued + stats.in_progress : 0;
  const completionRate = stats && stats.total_tasks > 0
    ? Math.round((stats.completed / stats.total_tasks) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ListTodo className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Background Jobs</h1>
            <p className="text-gray-500">Monitor task queues and background processes</p>
          </div>
        </div>
        <Button onClick={fetchData} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-3xl font-bold">{stats?.total_tasks || 0}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Box className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
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
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-600">{completionRate}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queues" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            Task Queues
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            All Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queues" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queues.map((queue) => {
              const progressPercent = queue.task_count > 0
                ? Math.round((queue.completed_count / queue.task_count) * 100)
                : 0;

              return (
                <Card key={queue.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{queue.name}</CardTitle>
                      <Badge variant={queue.is_active ? "default" : "secondary"}>
                        {queue.is_active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <CardDescription>{queue.description || queue.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{queue.task_count}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">
                            {queue.pending_count}
                          </p>
                          <p className="text-xs text-gray-500">Pending</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {queue.completed_count}
                          </p>
                          <p className="text-xs text-gray-500">Done</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Priority</span>
                        <Badge className={getPriorityBadge(queue.default_priority)}>
                          {queue.default_priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {queues.length === 0 && !loading && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-gray-500">
                  No task queues found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Queue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Queues</SelectItem>
                    {queues.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Queue</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <Badge className={getStatusBadge(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          {task.summary && (
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">
                              {task.summary}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.queue_name ? (
                          <Badge variant="outline">{task.queue_name}</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.tenant_code ? (
                          <Badge variant="outline">{task.tenant_code}</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignee_email || (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(task.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No tasks found
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
