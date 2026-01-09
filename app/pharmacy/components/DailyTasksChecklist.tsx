"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Package, 
  FileCheck, 
  ClipboardCheck,
  Clock,
  Zap,
  ChevronRight,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  href?: string;
  count?: number;
}

interface DailyTasksChecklistProps {
  tasks?: Task[];
}

export function DailyTasksChecklist({ tasks: propTasks }: DailyTasksChecklistProps) {
  // Default tasks - would come from API in real implementation
  const defaultTasks: Task[] = [
    {
      id: "1",
      title: "Review expiring batches",
      description: "3 batches expire this week",
      completed: false,
      priority: "high",
      href: "/pharmacy/inventory?filter=expiring",
      count: 3,
    },
    {
      id: "2",
      title: "Approve pending purchase order",
      description: "1 PO awaiting approval",
      completed: false,
      priority: "high",
      href: "/pharmacy/purchase-orders",
      count: 1,
    },
    {
      id: "3",
      title: "Check low stock alerts",
      description: "5 items running low",
      completed: true,
      priority: "medium",
      href: "/pharmacy/inventory?filter=low-stock",
      count: 5,
    },
    {
      id: "4",
      title: "Verify yesterday's stock-out",
      description: "12 entries to verify",
      completed: false,
      priority: "low",
      href: "/pharmacy/stock-out",
      count: 12,
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(propTasks || defaultTasks);

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const allCompleted = completedCount === totalCount;

  const priorityColors = {
    high: "text-red-600 bg-red-50 border-red-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    low: "text-blue-600 bg-blue-50 border-blue-200",
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/20 rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <ClipboardCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Tasks</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {completedCount}/{totalCount} completed
          </span>
          <span className={cn(
            "text-xs font-semibold",
            allCompleted ? "text-green-600" : progressPercent > 50 ? "text-indigo-600" : "text-gray-500"
          )}>
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <Progress 
          value={progressPercent} 
          className={cn(
            "h-2",
            allCompleted ? "[&>div]:bg-green-500" : "[&>div]:bg-indigo-500"
          )}
        />
      </div>

      {/* Task List */}
      <div className="p-5 pt-2 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
              task.completed 
                ? "bg-gray-50 border-gray-200 opacity-60" 
                : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
            )}
            onClick={() => toggleTask(task.id)}
          >
            <button
              className={cn(
                "flex-shrink-0 transition-colors",
                task.completed ? "text-green-500" : "text-gray-300 group-hover:text-indigo-400"
              )}
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                task.completed ? "text-gray-500 line-through" : "text-gray-900"
              )}>
                {task.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {task.description}
              </p>
            </div>

            {!task.completed && task.count && (
              <Badge 
                variant="outline" 
                className={cn("text-[10px] px-1.5", priorityColors[task.priority])}
              >
                {task.count}
              </Badge>
            )}

            {task.href && !task.completed && (
              <Link href={task.href} onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* All Complete Celebration */}
      {allCompleted && (
        <div className="mx-5 mb-5 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">All tasks complete!</p>
              <p className="text-xs text-green-600">Great job staying on top of inventory management.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Task Hint */}
      {!allCompleted && (
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Zap className="h-3 w-3" />
            <span>Complete all tasks to maintain a healthy inventory</span>
          </div>
        </div>
      )}
    </div>
  );
}
