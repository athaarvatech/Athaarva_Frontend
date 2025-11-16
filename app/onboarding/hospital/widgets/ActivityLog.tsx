"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, FileEdit, Upload, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/onboarding-utils';
import type { ActivityLogEntry } from '@/contexts/HospitalOnboardingContextV2';

interface ActivityLogProps {
  entries: ActivityLogEntry[];
  maxEntries?: number;
  className?: string;
}

export function ActivityLog({ entries, maxEntries = 10, className }: ActivityLogProps) {
  const displayEntries = entries.slice(0, maxEntries);

  const getActionIcon = (action: string) => {
    if (action.includes('upload')) return Upload;
    if (action.includes('edit') || action.includes('update')) return FileEdit;
    if (action.includes('complete')) return CheckCircle;
    return FileEdit;
  };

  const getActionColor = (action: string) => {
    if (action.includes('upload')) return 'text-blue-600 bg-blue-50';
    if (action.includes('edit') || action.includes('update')) return 'text-amber-600 bg-amber-50';
    if (action.includes('complete')) return 'text-healthcare-emerald bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Activity Log</h3>
        <p className="text-xs text-gray-500 mt-1">
          Recent changes and updates
        </p>
      </div>

      {/* Entries */}
      <div className="max-h-96 overflow-y-auto">
        {displayEntries.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No activity yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Your actions will be tracked here
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {displayEntries.map((entry, index) => (
              <ActivityItem
                key={entry.id}
                entry={entry}
                isFirst={index === 0}
                Icon={getActionIcon(entry.action)}
                colorClass={getActionColor(entry.action)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {entries.length > maxEntries && (
        <div className="p-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Showing {maxEntries} of {entries.length} activities
          </p>
        </div>
      )}
    </div>
  );
}

interface ActivityItemProps {
  entry: ActivityLogEntry;
  isFirst: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

function ActivityItem({ entry, isFirst, Icon, colorClass }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start space-x-3 p-3 rounded-lg transition-colors',
        isFirst ? 'bg-healthcare-primary/5' : 'hover:bg-gray-50'
      )}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', colorClass)}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm font-medium text-gray-900">
            {entry.action}
          </p>
          {isFirst && (
            <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
              Latest
            </Badge>
          )}
        </div>

        {entry.details && (
          <p className="text-xs text-gray-600 mb-1">
            {entry.details}
          </p>
        )}

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <User className="w-3 h-3" />
          <span>{entry.actor}</span>
          <span>•</span>
          <Clock className="w-3 h-3" />
          <span>{formatDateTime(entry.timestamp)}</span>
        </div>

        {/* Step Badge */}
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs">
            Step {entry.step_id}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
