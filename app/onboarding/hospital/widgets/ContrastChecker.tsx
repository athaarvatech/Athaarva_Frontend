"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from '@/lib/onboarding-utils';

interface ContrastCheckerProps {
  foreground: string;
  background: string;
  label?: string;
  className?: string;
}

export function ContrastChecker({
  foreground,
  background,
  label = 'Contrast Check',
  className,
}: ContrastCheckerProps) {
  const [ratio, setRatio] = useState(0);
  const [wcagAA, setWcagAA] = useState(false);
  const [wcagAAA, setWcagAAA] = useState(false);

  useEffect(() => {
    if (foreground && background) {
      const contrastRatio = getContrastRatio(foreground, background);
      setRatio(contrastRatio);
      setWcagAA(meetsWCAGAA(foreground, background));
      setWcagAAA(meetsWCAGAAA(foreground, background));
    }
  }, [foreground, background]);

  const getRatingLabel = () => {
    if (wcagAAA) return 'Excellent';
    if (wcagAA) return 'Good';
    return 'Poor';
  };

  const getRatingColor = () => {
    if (wcagAAA) return 'text-green-600 bg-green-50 border-green-200';
    if (wcagAA) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <Badge variant="outline" className={getRatingColor()}>
          {getRatingLabel()}
        </Badge>
      </div>

      {/* Color Preview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Foreground</p>
          <div className="h-12 rounded border border-gray-200 flex items-center justify-center" style={{ backgroundColor: foreground }}>
            <span className="text-xs font-mono text-white mix-blend-difference">{foreground}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Background</p>
          <div className="h-12 rounded border border-gray-200 flex items-center justify-center" style={{ backgroundColor: background }}>
            <span className="text-xs font-mono text-white mix-blend-difference">{background}</span>
          </div>
        </div>
      </div>

      {/* Contrast Ratio */}
      <div className="mb-4 text-center">
        <div className="text-3xl font-bold text-gray-900">
          {ratio.toFixed(2)}:1
        </div>
        <p className="text-xs text-gray-500 mt-1">Contrast Ratio</p>
      </div>

      {/* WCAG Compliance */}
      <div className="space-y-2">
        <ComplianceItem
          label="WCAG AA (4.5:1)"
          passed={wcagAA}
          description="Minimum for normal text"
        />
        <ComplianceItem
          label="WCAG AAA (7:1)"
          passed={wcagAAA}
          description="Enhanced for normal text"
        />
      </div>

      {/* Preview Example */}
      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: background, color: foreground }}>
        <p className="text-sm font-medium">Sample Text</p>
        <p className="text-xs mt-1">This is how your text will appear with these colors.</p>
      </div>

      {/* Info */}
      {!wcagAA && (
        <div className="mt-3 flex items-start text-xs text-amber-700 bg-amber-50 p-2 rounded">
          <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <span>Consider adjusting colors for better accessibility. Text should have at least 4.5:1 contrast ratio.</span>
        </div>
      )}
    </div>
  );
}

interface ComplianceItemProps {
  label: string;
  passed: boolean;
  description: string;
}

function ComplianceItem({ label, passed, description }: ComplianceItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center justify-between p-2 rounded-lg border',
        passed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="flex-1">
        <p className={cn('text-sm font-medium', passed ? 'text-green-900' : 'text-gray-700')}>
          {label}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {passed ? (
        <Check className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
      ) : (
        <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
      )}
    </motion.div>
  );
}
