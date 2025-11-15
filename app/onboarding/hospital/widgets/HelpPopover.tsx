"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HelpPopoverProps {
  title: string;
  content: string | React.ReactNode;
  examples?: string[];
  tips?: string[];
  className?: string;
}

export function HelpPopover({ title, content, examples, tips, className }: HelpPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-healthcare-primary"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          </div>

          {/* Content */}
          <div className="text-sm text-gray-600">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Examples:</p>
              <ul className="space-y-1">
                {examples.map((example, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="text-healthcare-primary mr-2">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="space-y-2 p-3 bg-healthcare-primary/5 rounded-lg">
              <p className="text-xs font-medium text-healthcare-primary">💡 Tips:</p>
              <ul className="space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="text-xs text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
