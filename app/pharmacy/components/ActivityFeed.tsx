"use client";

import React from "react";
import { 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  Trash2,
  Percent,
  FileSpreadsheet,
  User,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ActivityEntry {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  type: "disposal" | "discount" | "reorder" | "verification" | "report" | "alert";
}

interface ActivityFeedProps {
  activities?: ActivityEntry[];
}

export function ActivityFeed({ activities: propActivities }: ActivityFeedProps) {
  // Default activities - would come from API
  const defaultActivities: ActivityEntry[] = [
    {
      id: "1",
      action: "Marked for disposal",
      description: "Batch ABC123 - Amoxicillin 500mg",
      user: "Admin",
      timestamp: "2:30 PM",
      type: "disposal",
    },
    {
      id: "2",
      action: "Applied 25% discount",
      description: "8 batches expiring in 30 days",
      user: "System",
      timestamp: "11:00 AM",
      type: "discount",
    },
    {
      id: "3",
      action: "Auto-generated PO",
      description: "5 low stock items reordered",
      user: "System",
      timestamp: "Yesterday",
      type: "reorder",
    },
    {
      id: "4",
      action: "Stock verified",
      description: "Monthly inventory audit complete",
      user: "Admin",
      timestamp: "2 days ago",
      type: "verification",
    },
    {
      id: "5",
      action: "Report exported",
      description: "Weekly inventory summary PDF",
      user: "Admin",
      timestamp: "3 days ago",
      type: "report",
    },
  ];

  const activities = propActivities || defaultActivities;

  const typeIcons = {
    disposal: Trash2,
    discount: Percent,
    reorder: Package,
    verification: CheckCircle2,
    report: FileSpreadsheet,
    alert: AlertTriangle,
  };

  const typeColors = {
    disposal: "text-red-600 bg-red-50",
    discount: "text-blue-600 bg-blue-50",
    reorder: "text-purple-600 bg-purple-50",
    verification: "text-green-600 bg-green-50",
    report: "text-amber-600 bg-amber-50",
    alert: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50/30 via-white to-slate-50/20 rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500">
          View All
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Activity List */}
      <div className="p-5 pt-3">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const Icon = typeIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="relative flex items-start gap-3 pl-8"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-2.5 w-3 h-3 rounded-full border-2 border-white",
                    idx === 0 ? "bg-healthcare-primary" : "bg-gray-300"
                  )} />

                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center",
                    typeColors[activity.type]
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[10px] text-gray-400">{activity.timestamp}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <User className="h-2.5 w-2.5 text-gray-400" />
                      <span className="text-[10px] text-gray-400">{activity.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Activity log retained for 30 days • All actions are auditable
        </p>
      </div>
    </div>
  );
}
