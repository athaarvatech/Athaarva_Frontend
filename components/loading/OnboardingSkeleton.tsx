import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

export function OnboardingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      <div className="h-screen flex flex-col">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-1.5 w-24" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full flex gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Left Sidebar Skeleton */}
            <div className="hidden lg:flex lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full flex flex-col">
                {/* Progress Header */}
                <div className="p-4 border-b border-gray-100">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                {/* Steps List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full p-3 rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-full mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Stats */}
                <div className="border-t border-gray-100 p-4 space-y-3">
                  <Skeleton className="h-3 w-20 mb-2" />
                  {["Setup", "Operations", "Review"].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area Skeleton */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                {/* Step Header */}
                <div className="border-b border-gray-100 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>

                {/* Form Content Skeleton */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Section 1 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-64" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i}>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-1" />
                          <Skeleton className="h-4 w-56" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                          <div key={i}>
                            <Skeleton className="h-4 w-28 mb-2" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation Footer Skeleton */}
                <div className="border-t border-gray-100 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <div className="flex lg:hidden items-center space-x-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="w-1.5 h-1.5 rounded-full" />
                      ))}
                    </div>
                    <Skeleton className="h-10 w-32 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Skeleton */}
            <div className="hidden xl:flex w-80 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full p-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <Skeleton className="w-2 h-2 rounded-full mt-2" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pulsing Hospital Icon Overlay */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Building2 className="w-16 h-16 text-healthcare-primary" />
        </motion.div>
      </motion.div>
    </div>
  );
}
