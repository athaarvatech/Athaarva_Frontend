"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Clock, Shield, AlertCircle } from 'lucide-react';
import { useHospitalOnboarding } from '@/contexts/HospitalOnboardingContextV2';
import { TemplateGallery } from '../widgets/TemplateGallery';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, isDateExpired } from '@/lib/onboarding-utils';
import { cn } from '@/lib/utils';

export default function InvitationTemplateStep() {
  const { data, updateData } = useHospitalOnboarding();
  const invitation = data.invitation;
  const isExpired = invitation.expires_at ? isDateExpired(invitation.expires_at) : false;

  return (
    <div className="space-y-8">
      {/* Invitation Recap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-healthcare-primary/10 via-white to-healthcare-emerald/10 border border-healthcare-primary/20 rounded-xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-healthcare-primary rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to Athaarva Hospital Onboarding
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You've been invited to set up your hospital's digital presence. Let's create 
              something amazing together!
            </p>

            {/* Invitation Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                icon={Mail}
                label="Invited Email"
                value={invitation.email}
              />
              <InfoCard
                icon={Calendar}
                label="Invitation ID"
                value={`#${invitation.invitation_id || 'N/A'}`}
              />
              <InfoCard
                icon={Clock}
                label="Expires"
                value={invitation.expires_at ? formatDateTime(invitation.expires_at) : 'No expiry'}
                alert={isExpired}
              />
              <InfoCard
                icon={Shield}
                label="Status"
                value="Active"
                badge
              />
            </div>

            {/* Expiry Warning */}
            {isExpired && (
              <div className="mt-4 flex items-start text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Invitation Expired</p>
                  <p className="text-xs mt-1">
                    This invitation has expired. Please contact your administrator for a new invitation link.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Template Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TemplateGallery
          selectedTemplate={data.template.selected_template}
          onSelectTemplate={(template) => {
            updateData('template', {
              selected_template: template,
              version_locked: false,
            });
          }}
        />
      </motion.div>

      {/* Version Lock Banner */}
      {data.template.version_locked && data.template.selected_template && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">
                Template Version Locked
              </h4>
              <p className="text-xs text-amber-700">
                Template "{data.template.selected_template.name}" (v{data.template.selected_template.version}) 
                is now locked for your hospital. Any future updates to this template will require manual approval.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Steps Info */}
      {data.template.selected_template && !isExpired && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            What's Next?
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              <span>Complete your organization profile with legal and registration details</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              <span>Add your hospital locations and contact information</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              <span>Customize your brand colors, logo, and website theme</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              <span>Set up services, team, policies, and go live!</span>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}

interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  alert?: boolean;
  badge?: boolean;
}

function InfoCard({ icon: Icon, label, value, alert, badge }: InfoCardProps) {
  return (
    <div className={cn(
      'flex items-center space-x-3 p-3 rounded-lg border',
      alert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
        alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        {badge ? (
          <Badge className="mt-1 bg-healthcare-emerald text-white">
            {value}
          </Badge>
        ) : (
          <p className={cn(
            'text-sm font-medium truncate',
            alert ? 'text-red-900' : 'text-gray-900'
          )}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
