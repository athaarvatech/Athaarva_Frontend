"use client";

import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatFileSize, validateFile } from '@/lib/onboarding-utils';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  onUploadComplete?: (url: string) => void;
  currentFile?: File | null;
  currentUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  preview?: boolean;
  className?: string;
}

export function FileUploadZone({
  onFileSelect,
  onFileRemove,
  onUploadComplete,
  currentFile,
  currentUrl,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Upload File',
  description = 'Drag and drop or click to browse',
  preview = true,
  className,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Validate file
    const validation = validateFile(file, {
      maxSizeMB,
      allowedTypes: accept === 'image/*' ? ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'] : [],
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Create preview for images
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    onFileSelect(file);

    // Simulate upload progress (replace with actual upload in production)
    if (onUploadComplete) {
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onUploadComplete(`/uploads/${file.name}`);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, [accept, maxSizeMB, preview, onFileSelect, onUploadComplete]);

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setError(null);
    setUploadProgress(0);
    onFileRemove?.();
  }, [onFileRemove]);

  const hasFile = currentFile || currentUrl;

  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Upload Zone */}
      {!hasFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer',
            isDragging
              ? 'border-healthcare-primary bg-healthcare-primary/5'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-healthcare-primary hover:bg-gray-50'
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <Upload className={cn(
              'mx-auto h-12 w-12 mb-3',
              error ? 'text-red-400' : 'text-gray-400'
            )} />
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isDragging ? 'Drop file here' : description}
            </p>
            <p className="text-xs text-gray-500">
              {accept === 'image/*' ? 'PNG, JPG, WEBP' : accept} up to {maxSizeMB}MB
            </p>
          </div>

          {error && (
            <div className="mt-3 flex items-center justify-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* File Preview */}
      <AnimatePresence>
        {hasFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative border border-gray-200 rounded-lg p-4 bg-white"
          >
            {/* Preview Image */}
            {preview && (previewUrl || currentUrl) && (
              <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previewUrl || currentUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-healthcare-primary animate-spin" />
                  ) : uploadProgress === 100 ? (
                    <CheckCircle className="w-5 h-5 text-healthcare-emerald" />
                  ) : (
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentFile?.name || 'Uploaded file'}
                  </p>
                  {currentFile && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(currentFile.size)}
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-3 space-y-1">
                <Progress value={uploadProgress} className="h-1" />
                <p className="text-xs text-gray-500 text-right">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            {/* Success Message */}
            {uploadProgress === 100 && !isUploading && (
              <div className="mt-3 flex items-center text-sm text-healthcare-emerald">
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload complete
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
