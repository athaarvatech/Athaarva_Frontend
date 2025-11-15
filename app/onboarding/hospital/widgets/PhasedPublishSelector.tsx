"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Calendar, Eye, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhasedPublishSelectorProps {
  value: 'immediate' | 'scheduled' | 'site_only';
  scheduledAt?: string;
  onChange: (mode: 'immediate' | 'scheduled' | 'site_only', scheduledAt?: string) => void;
  className?: string;
}

export function PhasedPublishSelector({
  value,
  scheduledAt,
  onChange,
  className,
}: PhasedPublishSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Publication Plan</h3>
        <p className="text-sm text-gray-600">
          Choose how and when to launch your hospital platform
        </p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as any)}
        className="space-y-3"
      >
        {/* Immediate Launch */}
        <PublishOption
          value="immediate"
          icon={Zap}
          title="Immediate Launch"
          description="Go live instantly with all features enabled"
          selected={value === 'immediate'}
          recommended
        />

        {/* Scheduled Launch */}
        <PublishOption
          value="scheduled"
          icon={Calendar}
          title="Scheduled Launch"
          description="Set a specific date and time for going live"
          selected={value === 'scheduled'}
        >
          {value === 'scheduled' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pl-9"
            >
              <Label htmlFor="scheduled-date" className="text-xs text-gray-700">
                Launch Date & Time
              </Label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={scheduledAt || ''}
                onChange={(e) => onChange('scheduled', e.target.value)}
                className="mt-1"
                min={new Date().toISOString().slice(0, 16)}
              />
            </motion.div>
          )}
        </PublishOption>

        {/* Site Only */}
        <PublishOption
          value="site_only"
          icon={Eye}
          title="Website Only (Staged Rollout)"
          description="Launch public website first, enable booking/billing modules later"
          selected={value === 'site_only'}
        >
          {value === 'site_only' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pl-9 flex items-start text-xs text-gray-600 bg-blue-50 p-3 rounded-lg"
            >
              <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
              <p>
                Your public website will go live. You can enable appointment booking, 
                telehealth, pharmacy, and billing modules from your admin dashboard later.
              </p>
            </motion.div>
          )}
        </PublishOption>
      </RadioGroup>
    </div>
  );
}

interface PublishOptionProps {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  selected: boolean;
  recommended?: boolean;
  children?: React.ReactNode;
}

function PublishOption({
  value,
  icon: Icon,
  title,
  description,
  selected,
  recommended,
  children,
}: PublishOptionProps) {
  return (
    <div
      className={cn(
        'relative border-2 rounded-lg p-4 transition-all cursor-pointer',
        selected
          ? 'border-healthcare-primary bg-healthcare-primary/5'
          : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-start space-x-3">
        <RadioGroupItem value={value} id={value} className="mt-1" />
        
        <div className="flex-1">
          <Label
            htmlFor={value}
            className="flex items-center cursor-pointer"
          >
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3',
              selected ? 'bg-healthcare-primary text-white' : 'bg-gray-100 text-gray-600'
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{title}</span>
                {recommended && (
                  <span className="text-xs bg-healthcare-emerald/10 text-healthcare-emerald px-2 py-0.5 rounded-full font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </Label>

          {children}
        </div>
      </div>
    </div>
  );
}
