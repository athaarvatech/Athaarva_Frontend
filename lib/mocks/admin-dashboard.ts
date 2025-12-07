import { DashboardStats, PendingAction, RecentActivity } from "@/lib/admin-api";

interface AdminDashboardMockData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  pendingActions: PendingAction[];
  lastUpdated: string;
}

const MOCK_DEPARTMENTS = [
  "Cardiology",
  "Emergency",
  "Radiology",
  "Orthopedics",
  "Oncology",
];

const pickDepartment = (index: number) =>
  MOCK_DEPARTMENTS[index % MOCK_DEPARTMENTS.length];

const generateId = () => {
  if (typeof globalThis !== "undefined") {
    const cryptoObj = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
    if (cryptoObj?.randomUUID) {
      return cryptoObj.randomUUID();
    }
  }
  return `mock-${Math.random().toString(36).slice(2, 10)}`;
};

export const getMockAdminDashboardData = (): AdminDashboardMockData => {
  const now = new Date();
  const timestamp = now.toLocaleString();

  const stats: DashboardStats = {
    totalDoctors: 142,
    totalStaff: 468,
    activeDoctors: 119,
    activeStaff: 312,
    pendingApprovals: 7,
    systemAlerts: 3,
    monthlyGrowth: {
      doctors: 6.4,
      staff: 5.1,
      activeUsers: 8.9,
      efficiency: 12.2,
    },
  };

  const recentActivity: RecentActivity[] = [
    {
      id: generateId(),
      type: "doctor_added",
      user: {
        name: "Dr. Aisha Verma",
        avatar: null,
        department: "Cardiology",
      },
      message: "Completed onboarding and verified credentials.",
      time: "4 minutes ago",
      status: "completed",
    },
    {
      id: generateId(),
      type: "pending_approval",
      user: {
        name: "Rahul Mehta",
        avatar: null,
        department: "Nursing Ops",
      },
      message: "Awaiting ID proof for shift activation.",
      time: "18 minutes ago",
      status: "pending",
    },
    {
      id: generateId(),
      type: "system_update",
      user: {
        name: "Platform Monitor",
        avatar: null,
        department: "IT",
      },
      message: "Telemetry latency normalized after autoscale.",
      time: "35 minutes ago",
      status: "stable",
    },
    {
      id: generateId(),
      type: "password_reset",
      user: {
        name: "Nikita Sharma",
        avatar: null,
        department: "Pharmacy",
      },
      message: "Self-service reset completed successfully.",
      time: "1 hour ago",
      status: "completed",
    },
  ];

  const pendingActions: PendingAction[] = [
    {
      id: generateId(),
      title: "Approve credential packets",
      description: "7 doctor files tagged for priority verification.",
      action: "Review",
      priority: "high",
      count: 7,
      dueDate: "Today, 6 PM",
    },
    {
      id: generateId(),
      title: "Reassign low-coverage shift",
      description: "ICU overnight staffing at 68% capacity.",
      action: "Rebalance",
      priority: "medium",
      count: 3,
      dueDate: "Tomorrow, 9 AM",
    },
    {
      id: generateId(),
      title: "System health acknowledgements",
      description: "Close the loop on acknowledged incidents.",
      action: "Update",
      priority: "low",
      count: 5,
      dueDate: "Friday",
    },
  ];

  // Add subtle timestamp variations for activities
  const enrichedRecentActivity = recentActivity.map((activity, index) => ({
    ...activity,
    user: {
      ...activity.user,
      department: pickDepartment(index),
    },
    time:
      index === 0
        ? "Just now"
        : `${15 * index} minutes ago`,
  }));

  return {
    stats,
    recentActivity: enrichedRecentActivity,
    pendingActions,
    lastUpdated: timestamp,
  };
};

export type { AdminDashboardMockData };
