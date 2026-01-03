"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Clock, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatFileSize, formatDateTime, isDateExpired } from '@/lib/onboarding-utils';
import type { DocumentData } from '@/contexts/HospitalOnboardingContextV2';

interface DocumentChecklistProps {
  documents: DocumentData[];
  requiredTypes: string[];
  onUpload: (type: string) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function DocumentChecklist({
  documents,
  requiredTypes,
  onUpload,
  onRemove,
  className,
}: DocumentChecklistProps) {
  const completionPercentage = (documents.length / requiredTypes.length) * 100;

  const getDocumentForType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  const getStatusIcon = (doc?: DocumentData) => {
    if (!doc) return <Upload className="w-4 h-4 text-gray-400" />;
    
    switch (doc.status) {
      case 'uploaded':
        if (doc.expires_at && isDateExpired(doc.expires_at)) {
          return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
        return <CheckCircle className="w-4 h-4 text-healthcare-emerald" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (doc?: DocumentData) => {
    if (!doc) {
      return <Badge variant="outline" className="text-xs">Required</Badge>;
    }

    if (doc.status === 'uploaded') {
      if (doc.expires_at && isDateExpired(doc.expires_at)) {
        return <Badge variant="destructive" className="text-xs">Expired</Badge>;
      }
      return <Badge className="text-xs bg-healthcare-emerald">Uploaded</Badge>;
    }

    if (doc.status === 'pending') {
      return <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Pending</Badge>;
    }

    if (doc.status === 'expired') {
      return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    }

    return <Badge variant="outline" className="text-xs">Required</Badge>;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Document Checklist</h3>
          <p className="text-sm text-gray-600 mt-1">
            {documents.length} of {requiredTypes.length} documents uploaded
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-healthcare-primary">
            {Math.round(completionPercentage)}%
          </div>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={completionPercentage} className="h-2" />

      {/* Document List */}
      <div className="space-y-2">
        {requiredTypes.map((type) => {
          const doc = getDocumentForType(type);
          return (
            <DocumentItem
              key={type}
              type={type}
              document={doc}
              icon={getStatusIcon(doc)}
              badge={getStatusBadge(doc)}
              onUpload={() => onUpload(type)}
              onRemove={doc ? () => onRemove(doc.id) : undefined}
            />
          );
        })}
      </div>

      {/* Summary */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-4 bg-healthcare-emerald/10 border border-healthcare-emerald/20 rounded-lg"
        >
          <CheckCircle className="w-5 h-5 text-healthcare-emerald mr-2" />
          <span className="text-sm font-medium text-healthcare-emerald">
            All required documents uploaded!
          </span>
        </motion.div>
      )}
    </div>
  );
}

interface DocumentItemProps {
  type: string;
  document?: DocumentData;
  icon: React.ReactNode;
  badge: React.ReactNode;
  onUpload: () => void;
  onRemove?: () => void;
}

function DocumentItem({ type, document, icon, badge, onUpload, onRemove }: DocumentItemProps) {
  const needsAttention = document?.status === 'expired' || 
    (document?.expires_at && isDateExpired(document.expires_at));

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all',
        needsAttention
          ? 'bg-red-50 border-red-200'
          : document
          ? 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      )}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h4>
            {badge}
          </div>
          {document && (
            <div className="space-y-0.5">
              <p className="text-xs text-gray-600 truncate">
                {document.filename}
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>{formatFileSize(document.size)}</span>
                {document.uploaded_at && (
                  <span>Uploaded {formatDateTime(document.uploaded_at)}</span>
                )}
              </div>
              {document.expires_at && (
                <p className={cn(
                  'text-xs',
                  isDateExpired(document.expires_at) ? 'text-red-600' : 'text-gray-500'
                )}>
                  Expires: {formatDateTime(document.expires_at)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 ml-3">
        {document ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Remove
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpload}
            className="text-healthcare-primary border-healthcare-primary hover:bg-healthcare-primary/10"
          >
            Upload
          </Button>
        )}
      </div>
    </motion.div>
  );
}
