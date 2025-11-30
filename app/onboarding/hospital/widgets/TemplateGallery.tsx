"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TemplateData } from '@/contexts/HospitalOnboardingContextV2';
import { TEMPLATE_BLUEPRINTS } from './templateBlueprints';
import { TemplatePreviewRenderer } from './TemplatePreviewRenderer';

interface TemplateGalleryProps {
  templates?: TemplateData[];
  selectedTemplate: TemplateData | null;
  onSelectTemplate: (template: TemplateData) => void;
  className?: string;
}

const MOCK_TEMPLATES: TemplateData[] = [
  {
    id: 'modern-healthcare',
    name: 'Modern Clinical Flagship',
    version: '3.2',
    preview_snapshot_url: '/templates/modern-clinical.jpg',
    thumbnail_url: '/templates/modern-clinical-thumb.jpg',
    description:
      'Glass-and-steel campus aesthetic with immersive hero, data-driven stats, specialty grid, and premium doctor storytelling.',
    supported_modules: ['Appointments', 'Patient Concierge', 'Tele-ICU', 'Precision Oncology', 'Virtual Tour'],
    recommended_for: ['Multi-specialty Hospitals', 'International Patient Programs', 'Enterprise Health Systems'],
  },
  {
    id: 'telehealth-first',
    name: 'Telehealth First Mesh',
    version: '2.6',
    preview_snapshot_url: '/templates/telehealth-first.jpg',
    thumbnail_url: '/templates/telehealth-first-thumb.jpg',
    description:
      'Cloud-native virtual hospital layout inspired by leading hybrid-care networks with strong CTA coverage for remote visits.',
    supported_modules: ['Virtual Waiting Room', 'Remote Monitoring', 'At-home Infusion', 'Behavioral Health Studio'],
    recommended_for: ['Digital-first Hospitals', 'Chronic Care Networks', 'Employer Health Programs'],
  },
  {
    id: 'heritage',
    name: 'Heritage Academic',
    version: '1.8',
    preview_snapshot_url: '/templates/heritage.jpg',
    thumbnail_url: '/templates/heritage-thumb.jpg',
    description:
      'Classic serif typography, heritage imagery, and donor storytelling tuned for legacy hospitals balancing tradition with science.',
    supported_modules: ['Pastoral Care', 'Academic Programs', 'Transplant Outcomes', 'Heritage Timeline'],
    recommended_for: ['Teaching Hospitals', 'Mission Hospitals', 'Faith-driven Health Systems'],
  },
];

export function TemplateGallery({
  templates = MOCK_TEMPLATES,
  selectedTemplate,
  onSelectTemplate,
  className,
}: TemplateGalleryProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | null>(null);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Choose Your Template</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select a design that best represents your hospital's identity
          </p>
        </div>
        <Badge variant="secondary" className="bg-healthcare-primary/10 text-healthcare-primary">
          {templates.length} Templates
        </Badge>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => onSelectTemplate(template)}
            onPreview={() => setPreviewTemplate(template)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            onSelectTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
          isSelected={selectedTemplate?.id === previewTemplate.id}
        />
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateData;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function TemplateCard({ template, isSelected, onSelect, onPreview }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'group relative bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer',
        isSelected
          ? 'border-healthcare-primary shadow-lg ring-2 ring-healthcare-primary/20'
          : 'border-gray-200 hover:border-healthcare-primary/50 hover:shadow-md'
      )}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <Sparkles className="w-12 h-12" />
        </div>
        {template.locked && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-amber-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{template.name}</h4>
            <p className="text-xs text-gray-500">Version {template.version}</p>
          </div>
          {isSelected && (
            <div className="flex-shrink-0 w-6 h-6 bg-healthcare-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>

        {/* Modules */}
        <div className="flex flex-wrap gap-1">
          {template.supported_modules.slice(0, 3).map((module) => (
            <Badge key={module} variant="outline" className="text-xs">
              {module}
            </Badge>
          ))}
          {template.supported_modules.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.supported_modules.length - 3}
            </Badge>
          )}
        </div>

        {/* Recommended For */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Best for:</p>
          <p className="text-xs text-gray-700 line-clamp-1">
            {template.recommended_for[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface TemplatePreviewModalProps {
  template: TemplateData;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

function TemplatePreviewModal({ template, onClose, onSelect, isSelected }: TemplatePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const blueprint = useMemo(() => TEMPLATE_BLUEPRINTS[template.id], [template.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Device Selector */}
        <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
            <Button
              key={d}
              variant={device === d ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice(d)}
              className={cn(
                device === d && 'bg-healthcare-primary hover:bg-healthcare-primary/90'
              )}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="p-6 bg-gray-100">
          <div
            className={cn(
              'mx-auto bg-white rounded-[2.25rem] shadow-2xl overflow-hidden border border-gray-200/70',
              device === 'desktop' && 'w-full aspect-[16/10]',
              device === 'tablet' && 'w-2/3 aspect-[3/4]',
              device === 'mobile' && 'w-1/3 aspect-[9/16]'
            )}
          >
            {blueprint ? (
              <TemplatePreviewRenderer blueprint={blueprint} device={device} />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-sm">Preview not available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Supported Modules</h4>
              <div className="flex flex-wrap gap-2">
                {template.supported_modules.map((module) => (
                  <Badge key={module} variant="secondary">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommended For</h4>
              <ul className="space-y-1">
                {template.recommended_for.map((rec) => (
                  <li key={rec} className="text-sm text-gray-700 flex items-center">
                    <Check className="w-4 h-4 text-healthcare-emerald mr-2" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <Info className="w-4 h-4 mr-2" />
            Template can be customized in the branding step
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSelect}
              className="bg-healthcare-primary hover:bg-healthcare-primary/90"
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Selected
                </>
              ) : (
                'Select Template'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
