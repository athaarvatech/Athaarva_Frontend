"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MessageSquare, Mail, Phone, BarChart3, Sparkles, Video, CheckCircle, X } from 'lucide-react';
import { useHospitalOnboarding } from '@/contexts/HospitalOnboardingContextV2';
import { HelpPopover } from '../widgets/HelpPopover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function IntegrationsPreferencesStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [newAnalyticsTag, setNewAnalyticsTag] = useState({ platform: '', tag_id: '' });

  // Safety checks
  const integrations = data.integrations || {
    messaging_channels: [],
    analytics_tags: [],
    llm_opt_in: false,
    telehealth_provider: '',
    patient_portal_modules: [],
  };

  const messagingChannels = Array.isArray(integrations.messaging_channels) ? integrations.messaging_channels : [];
  const analyticsTags = Array.isArray(integrations.analytics_tags) ? integrations.analytics_tags : [];
  const patientPortalModules = Array.isArray(integrations.patient_portal_modules) ? integrations.patient_portal_modules : [];

  // Messaging channels
  const toggleMessagingChannel = (channel: 'sms' | 'email' | 'whatsapp') => {
    const updated = (messagingChannels as string[]).includes(channel)
      ? (messagingChannels as string[]).filter(c => c !== channel)
      : [...(messagingChannels as string[]), channel];
    
    updateData('integrations', {
      ...integrations,
      messaging_channels: updated,
    } as any);
  };

  // Analytics tags
  const addAnalyticsTag = () => {
    if (newAnalyticsTag.platform && newAnalyticsTag.tag_id) {
      updateData('integrations', {
        ...integrations,
        analytics_tags: [...analyticsTags, { id: `tag_${Date.now()}`, ...newAnalyticsTag }],
      } as any);
      setNewAnalyticsTag({ platform: '', tag_id: '' });
    }
  };

  const removeAnalyticsTag = (id: string) => {
    updateData('integrations', {
      ...integrations,
      analytics_tags: analyticsTags.filter((t: any) => t.id !== id),
    } as any);
  };

  // Patient portal modules
  const togglePortalModule = (module: string) => {
    const updated = patientPortalModules.includes(module)
      ? patientPortalModules.filter(m => m !== module)
      : [...patientPortalModules, module];
    
    updateData('integrations', {
      ...integrations,
      patient_portal_modules: updated,
    } as any);
  };

  const messagingOptions = [
    { value: 'sms', label: 'SMS', icon: Phone, description: 'Text message notifications' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Email communications' },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, description: 'WhatsApp messaging' },
  ];

  const telehealthProviders = [
    { value: 'zoom', label: 'Zoom for Healthcare', logo: '🎥' },
    { value: 'microsoft-teams', label: 'Microsoft Teams', logo: '📹' },
    { value: 'google-meet', label: 'Google Meet', logo: '🎬' },
    { value: 'custom', label: 'Custom Provider', logo: '⚙️' },
  ];

  const portalModules = [
    { value: 'appointments', label: 'Appointment Booking', icon: CheckCircle },
    { value: 'records', label: 'Medical Records', icon: CheckCircle },
    { value: 'prescriptions', label: 'Prescriptions', icon: CheckCircle },
    { value: 'lab-results', label: 'Lab Results', icon: CheckCircle },
    { value: 'billing', label: 'Billing & Payments', icon: CheckCircle },
    { value: 'messaging', label: 'Secure Messaging', icon: CheckCircle },
  ];

  const analyticsProviders = [
    'Google Analytics',
    'Google Tag Manager',
    'Meta Pixel',
    'LinkedIn Insight',
    'Mixpanel',
    'Amplitude',
    'Custom',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Integrations & Preferences</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure messaging channels, analytics, telehealth, and patient portal features
        </p>
      </div>

      {/* Messaging Channels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Messaging Channels</Label>
          <HelpPopover
            title="Messaging Channels"
            content="Select which channels you'll use to communicate with patients for appointments, reminders, and notifications"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {messagingOptions.map((option) => {
            const Icon = option.icon;
            const isActive = (messagingChannels as string[]).includes(option.value);
            
            return (
              <button
                key={option.value}
                onClick={() => toggleMessagingChannel(option.value as any)}
                className={cn(
                  "flex flex-col items-start p-4 border-2 rounded-lg transition-all text-left",
                  isActive
                    ? "border-healthcare-primary bg-healthcare-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-3",
                  isActive ? "text-healthcare-primary" : "text-gray-400"
                )} />
                <h4 className={cn(
                  "font-medium mb-1",
                  isActive ? "text-healthcare-primary" : "text-gray-900"
                )}>
                  {option.label}
                </h4>
                <p className="text-sm text-gray-600">{option.description}</p>
                {isActive && (
                  <Badge className="mt-3 bg-healthcare-primary">Active</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Tags */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Analytics & Tracking</Label>
          <HelpPopover
            title="Analytics Tags"
            content="Add tracking tags for analytics platforms to monitor website performance and user behavior"
          />
        </div>

        {/* Add New Tag */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={newAnalyticsTag.platform}
              onChange={(e) => setNewAnalyticsTag({ ...newAnalyticsTag, platform: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-healthcare-primary focus:border-transparent"
            >
              <option value="">Select Platform</option>
              {analyticsProviders.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>

            <Input
              value={newAnalyticsTag.tag_id}
              onChange={(e) => setNewAnalyticsTag({ ...newAnalyticsTag, tag_id: e.target.value })}
              placeholder="Tag ID / Tracking Code"
            />

            <Button onClick={addAnalyticsTag} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>
        </div>

        {/* Tags List */}
        <div className="space-y-2">
          {analyticsTags.map((tag: any) => (
            <div
              key={tag.id}
              className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-healthcare-primary" />
                <div>
                  <p className="font-medium text-gray-900">{tag.platform}</p>
                  <p className="text-sm text-gray-500 font-mono">{tag.tag_id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAnalyticsTag(tag.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {analyticsTags.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <BarChart3 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No analytics tags configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Telehealth Provider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Telehealth Provider</Label>
          <HelpPopover
            title="Telehealth Platform"
            content="Select your preferred video consultation platform for virtual appointments"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {telehealthProviders.map((provider) => (
            <button
              key={provider.value}
              onClick={() => updateData('integrations', {
                ...integrations,
                telehealth_provider: provider.value,
              } as any)}
              className={cn(
                "flex items-center gap-3 p-4 border-2 rounded-lg transition-all",
                integrations.telehealth_provider === provider.value
                  ? "border-healthcare-primary bg-healthcare-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <span className="text-2xl">{provider.logo}</span>
              <span className={cn(
                "font-medium",
                integrations.telehealth_provider === provider.value
                  ? "text-healthcare-primary"
                  : "text-gray-700"
              )}>
                {provider.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* LLM Opt-In */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">AI-Powered Features</Label>
          <HelpPopover
            title="AI Features"
            content="Enable AI-powered features like smart scheduling, patient insights, and automated documentation assistance"
          />
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Enable AI-Powered Platform Features
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Allow Athaarva to use large language models (LLMs) to enhance your hospital's operations with intelligent automation, predictive analytics, and natural language processing. Your data remains secure and is never shared externally.
              </p>

              <div className="flex items-center gap-3">
                <Checkbox
                  checked={integrations.llm_opt_in}
                  onCheckedChange={(checked) => updateData('integrations', {
                    ...integrations,
                    llm_opt_in: checked as boolean,
                  } as any)}
                  id="llm-opt-in"
                />
                <label
                  htmlFor="llm-opt-in"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  I consent to AI-powered features (optional)
                </label>
              </div>

              {integrations.llm_opt_in && (
                <Badge className="mt-3 bg-purple-600">AI Features Enabled</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Portal Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Patient Portal Modules</Label>
          <HelpPopover
            title="Patient Portal"
            content="Select which features will be available in your patient portal"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {portalModules.map((module) => {
            const Icon = module.icon;
            const isActive = patientPortalModules.includes(module.value);
            
            return (
              <button
                key={module.value}
                onClick={() => togglePortalModule(module.value)}
                className={cn(
                  "flex items-center justify-between p-4 border-2 rounded-lg transition-all",
                  isActive
                    ? "border-healthcare-primary bg-healthcare-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className={cn(
                  "font-medium",
                  isActive ? "text-healthcare-primary" : "text-gray-700"
                )}>
                  {module.label}
                </span>
                {isActive && <Icon className="w-5 h-5 text-healthcare-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
