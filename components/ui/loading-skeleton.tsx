import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
}

/**
 * Text skeleton for single line of text
 */
export function SkeletonText({ className, width = "w-full" }: SkeletonProps & { width?: string }) {
  return <Skeleton className={cn("h-4", width, className)} />;
}

/**
 * Avatar skeleton
 */
export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return <Skeleton className={cn("rounded-full", sizes[size])} />;
}

/**
 * Button skeleton
 */
export function SkeletonButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return <Skeleton className={cn("rounded-md", sizes[size])} />;
}

/**
 * Card skeleton for generic card content
 */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("p-4 border rounded-lg space-y-4", className)}>
      <div className="flex items-center gap-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonText width="w-1/3" />
          <SkeletonText width="w-1/2" />
        </div>
      </div>
      <SkeletonText />
      <SkeletonText width="w-3/4" />
    </div>
  );
}

/**
 * Table row skeleton
 */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <SkeletonText width={i === 0 ? "w-3/4" : "w-1/2"} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Table skeleton with header and rows
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 dark:bg-gray-800">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <SkeletonText width="w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Dashboard stats card skeleton
 */
export function SkeletonStatsCard() {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonText width="w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <SkeletonText className="mt-4" width="w-32" />
    </div>
  );
}

/**
 * Dashboard grid skeleton
 */
export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatsCard key={i} />
        ))}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-48" />
          <SkeletonTable rows={5} columns={5} />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Appointment card skeleton
 */
export function SkeletonAppointmentCard() {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
          <SkeletonText width="w-1/2" />
          <SkeletonText width="w-1/3" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <SkeletonButton size="sm" />
      </div>
    </div>
  );
}

/**
 * Appointments list skeleton
 */
export function SkeletonAppointmentsList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonAppointmentCard key={i} />
      ))}
    </div>
  );
}

/**
 * Doctor profile skeleton
 */
export function SkeletonDoctorProfile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <SkeletonAvatar size="xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-64" />
          <SkeletonText width="w-48" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <SkeletonButton size="lg" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center p-4 border rounded-lg">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <SkeletonText width="w-20 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <SkeletonText />
        <SkeletonText />
        <SkeletonText width="w-3/4" />
      </div>
    </div>
  );
}

/**
 * Medical record card skeleton
 */
export function SkeletonMedicalRecord() {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-1">
            <SkeletonText width="w-32" />
            <SkeletonText width="w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonText />
      <SkeletonText width="w-2/3" />
    </div>
  );
}

/**
 * Timeline skeleton
 */
export function SkeletonTimeline({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-3 w-3 rounded-full" />
            {i < items - 1 && <Skeleton className="w-0.5 h-20" />}
          </div>
          <div className="flex-1 pb-6">
            <SkeletonText width="w-24 mb-1" />
            <SkeletonText width="w-48 mb-2" />
            <SkeletonText width="w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Message/Chat skeleton
 */
export function SkeletonMessage({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
      <SkeletonAvatar size="sm" />
      <div className={cn("space-y-1", isOwn && "items-end")}>
        <Skeleton 
          className={cn(
            "h-16 w-48 rounded-lg",
            isOwn ? "rounded-br-sm" : "rounded-bl-sm"
          )} 
        />
        <SkeletonText width="w-16" />
      </div>
    </div>
  );
}

/**
 * Chat conversation skeleton
 */
export function SkeletonChat() {
  return (
    <div className="space-y-4 p-4">
      <SkeletonMessage />
      <SkeletonMessage isOwn />
      <SkeletonMessage />
      <SkeletonMessage />
      <SkeletonMessage isOwn />
    </div>
  );
}

/**
 * Form skeleton
 */
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonText width="w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-4">
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </div>
  );
}

/**
 * Navigation/Header skeleton
 */
export function SkeletonHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
        <div className="hidden md:flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonText key={i} width="w-16" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <SkeletonAvatar size="sm" />
      </div>
    </div>
  );
}

/**
 * Sidebar skeleton
 */
export function SkeletonSidebar() {
  return (
    <div className="w-64 p-4 border-r h-full">
      <Skeleton className="h-10 w-32 mb-6" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-5 w-5" />
            <SkeletonText width="w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Page layout skeleton with header, sidebar, and content
 */
export function SkeletonPageLayout() {
  return (
    <div className="min-h-screen">
      <SkeletonHeader />
      <div className="flex">
        <SkeletonSidebar />
        <div className="flex-1 p-6">
          <SkeletonDashboard />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
