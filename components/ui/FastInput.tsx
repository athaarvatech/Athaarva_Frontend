import React from 'react';
import { cn } from '@/lib/utils';

interface FastInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

/**
 * Optimized input component with minimal re-renders
 */
export const FastInput = React.memo<FastInputProps>(({
  label,
  error,
  icon,
  loading = false,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          disabled={loading}
          {...props}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

FastInput.displayName = 'FastInput';
