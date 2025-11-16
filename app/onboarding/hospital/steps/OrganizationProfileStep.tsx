"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, FileText, Calendar, Globe } from 'lucide-react';
import { useHospitalOnboarding } from '@/contexts/HospitalOnboardingContextV2';
import { HelpPopover } from '../widgets/HelpPopover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const OWNERSHIP_MODELS = [
  'Private Limited',
  'Public Limited',
  'Partnership',
  'Sole Proprietorship',
  'Trust',
  'Society',
  'Government',
  'Corporate Chain',
];

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dubai', label: 'UAE (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Europe/London', label: 'UK (GMT/BST)' },
  { value: 'America/New_York', label: 'US Eastern (EST/EDT)' },
];

const LOCALES = [
  { value: 'en-IN', label: 'English (India)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ar-AE', label: 'Arabic (UAE)' },
];

export default function OrganizationProfileStep() {
  const { data, updateData } = useHospitalOnboarding();
  const profile = data.organizationProfile;

  const handleChange = (field: string, value: string) => {
    updateData('organizationProfile', { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section: Legal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-healthcare-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Legal Information</h3>
            <p className="text-sm text-gray-600">Official details as per registration documents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Legal Name"
            required
            help={{
              title: 'Legal Name',
              content: 'The official registered name of your hospital or healthcare organization',
              examples: ['Apollo Hospitals Enterprise Ltd', 'Fortis Healthcare Ltd'],
            }}
          >
            <Input
              value={profile.legal_name}
              onChange={(e) => handleChange('legal_name', e.target.value)}
              placeholder="e.g., City Care Hospital Pvt. Ltd."
            />
          </FormField>

          <FormField
            label="Parent Entity"
            help={{
              title: 'Parent Entity',
              content: 'If your hospital is part of a larger group or chain, enter the parent company name',
              examples: ['Apollo Group', 'Max Healthcare', 'Independent'],
            }}
          >
            <Input
              value={profile.parent_entity}
              onChange={(e) => handleChange('parent_entity', e.target.value)}
              placeholder="e.g., Healthcare Group Inc. (or leave blank)"
            />
          </FormField>

          <FormField
            label="Registration Number"
            required
            help={{
              title: 'Registration Number',
              content: 'Company registration or incorporation number issued by the registrar',
            }}
          >
            <Input
              value={profile.registration_number}
              onChange={(e) => handleChange('registration_number', e.target.value)}
              placeholder="e.g., U85110DL2010PTC123456"
            />
          </FormField>

          <FormField
            label="Established Date"
            required
          >
            <Input
              type="date"
              value={profile.established_date}
              onChange={(e) => handleChange('established_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </FormField>
        </div>
      </motion.div>

      {/* Section: Tax & Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tax & Compliance IDs</h3>
            <p className="text-sm text-gray-600">Required for billing and regulatory compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="GST Number"
            required
            help={{
              title: 'GST Number',
              content: 'Goods and Services Tax Identification Number (15 characters)',
              examples: ['22AAAAA0000A1Z5'],
              tips: ['Format: 2 digits (state) + 10 digits (PAN) + 1 digit + 1 letter + 1 alphanumeric'],
            }}
          >
            <Input
              value={profile.gst_number}
              onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
              placeholder="e.g., 22AAAAA0000A1Z5"
              maxLength={15}
            />
          </FormField>

          <FormField
            label="PAN Number"
            required
            help={{
              title: 'PAN Number',
              content: 'Permanent Account Number (10 characters)',
              examples: ['AAAAA0000A'],
              tips: ['Format: 5 letters + 4 digits + 1 letter'],
            }}
          >
            <Input
              value={profile.pan_number}
              onChange={(e) => handleChange('pan_number', e.target.value.toUpperCase())}
              placeholder="e.g., AAAAA0000A"
              maxLength={10}
            />
          </FormField>

          <FormField
            label="Ownership Model"
            required
            help={{
              title: 'Ownership Model',
              content: 'The legal structure of your organization',
            }}
          >
            <Select
              value={profile.ownership_model}
              onValueChange={(value) => handleChange('ownership_model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                {OWNERSHIP_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </motion.div>

      {/* Section: Regional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Regional Preferences</h3>
            <p className="text-sm text-gray-600">Default timezone and language settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Timezone"
            required
            help={{
              title: 'Timezone',
              content: 'Default timezone for appointments, reports, and system timestamps',
            }}
          >
            <Select
              value={profile.timezone}
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Locale"
            required
            help={{
              title: 'Locale',
              content: 'Primary language and regional format for dates, numbers, and currency',
            }}
          >
            <Select
              value={profile.locale}
              onValueChange={(value) => handleChange('locale', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map((locale) => (
                  <SelectItem key={locale.value} value={locale.value}>
                    {locale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </motion.div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  help?: {
    title: string;
    content: string;
    examples?: string[];
    tips?: string[];
  };
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, required, help, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {help && <HelpPopover {...help} />}
      </div>
      {children}
    </div>
  );
}
