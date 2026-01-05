"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Mail, Clock, Shield, AlertCircle } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { TemplateGallery } from "../widgets/TemplateGallery";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, isDateExpired } from "@/lib/onboarding-utils";
import { cn } from "@/lib/utils";

export default function InvitationTemplateStep() {
  const { data, updateData } = useHospitalOnboarding();
  const invitation = data.invitation;
  const isExpired = invitation.expires_at
    ? isDateExpired(invitation.expires_at)
    : false;

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-healthcare-primary/10 via-white to-healthcare-emerald/10 border border-healthcare-primary/20 rounded-xl p-8"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-16 h-16 bg-healthcare-primary rounded-xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Athaarva Hospital Onboarding
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              We&apos;re excited to help you set up your hospital&apos;s digital presence. 
              This onboarding process will guide you through customizing your website, 
              configuring your services, and preparing your hospital for success on our platform. 
              Let&apos;s create something amazing together!
            </p>
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
            updateData("template", {
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
                Template &quot;{data.template.selected_template.name}&quot; (v
                {data.template.selected_template.version}) is now locked for
                your hospital. Any future updates to this template will require
                manual approval.
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
            What&apos;s Next?
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              <span>
                Complete your organization profile with legal and registration
                details
              </span>
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
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border",
        alert ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          alert ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        {badge ? (
          <Badge className="mt-1 bg-healthcare-emerald text-white">
            {value}
          </Badge>
        ) : (
          <p
            className={cn(
              "text-sm font-medium truncate",
              alert ? "text-red-900" : "text-gray-900"
            )}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
