"use client";

/**
 * PLACEHOLDER STEP FILES
 * 
 * These are stub implementations for the remaining onboarding steps.
 * Each needs to be fully implemented following the patterns in Steps 0-3.
 * 
 * See IMPLEMENTATION_GUIDE.md for detailed specifications.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ServicesPricingStep() {
  return (
    <div className="flex items-center justify-center p-12 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Step 5: Services & Pricing
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This step needs implementation. See IMPLEMENTATION_GUIDE.md for specifications.
        </p>
        <div className="text-xs text-left text-gray-700 bg-white p-4 rounded border border-amber-200 max-w-md mx-auto">
          <p className="font-semibold mb-2">Required Fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Departments (tag input)</li>
            <li>Procedures (tag input)</li>
            <li>Consultation types (multi-select)</li>
            <li>Services array (name, dept, fee range, locations)</li>
            <li>Insurance partnerships</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function LeadershipTeamStep() {
  return (
    <div className="flex items-center justify-center p-12 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Step 6: Leadership & Team
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This step needs implementation. See IMPLEMENTATION_GUIDE.md for specifications.
        </p>
        <div className="text-xs text-left text-gray-700 bg-white p-4 rounded border border-amber-200 max-w-md mx-auto">
          <p className="font-semibold mb-2">Required Fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Leadership cards (name, role, bio, photo, LinkedIn)</li>
            <li>Staffing plan (roles, counts, status)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OperationalPoliciesStep() {
  return (
    <div className="flex items-center justify-center p-12 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Step 7: Operational Policies
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This step needs implementation. See IMPLEMENTATION_GUIDE.md for specifications.
        </p>
        <div className="text-xs text-left text-gray-700 bg-white p-4 rounded border border-amber-200 max-w-md mx-auto">
          <p className="font-semibold mb-2">Required Fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Operating hours per location</li>
            <li>Appointment lead time (hours)</li>
            <li>Cancellation policy (textarea)</li>
            <li>No-show policy (textarea)</li>
            <li>Telehealth SOP (textarea)</li>
            <li>Patient onboarding steps (array)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ComplianceDocumentationStep() {
  return (
    <div className="flex items-center justify-center p-12 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Step 8: Compliance & Documentation
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This step needs implementation. Use DocumentChecklist widget.
        </p>
        <div className="text-xs text-left text-gray-700 bg-white p-4 rounded border border-amber-200 max-w-md mx-auto">
          <p className="font-semibold mb-2">Required Fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Documents array (type, file, expiry, status)</li>
            <li>DPO contact (name, email, phone)</li>
            <li>Consent templates (type, file)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function IntegrationsPreferencesStep() {
  return (
    <div className="flex items-center justify-center p-12 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Step 9: Integrations & Preferences
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This step needs implementation. See IMPLEMENTATION_GUIDE.md for specifications.
        </p>
        <div className="text-xs text-left text-gray-700 bg-white p-4 rounded border border-amber-200 max-w-md mx-auto">
          <p className="font-semibold mb-2">Required Fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Messaging channels (SMS, email, WhatsApp)</li>
            <li>Analytics tags (platform, tag_id)</li>
            <li>LLM opt-in (boolean)</li>
            <li>Telehealth provider (dropdown)</li>
            <li>Patient portal modules (multi-checkbox)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function AdminStaffInvitationsStep() {
  return (
    <div className="flex items-center justify-center p-12 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Step 10: Admin & Staff Invitations
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This step needs implementation. See IMPLEMENTATION_GUIDE.md for specifications.
        </p>
        <div className="text-xs text-left text-gray-700 bg-white p-4 rounded border border-amber-200 max-w-md mx-auto">
          <p className="font-semibold mb-2">Required Fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Admin team array (name, role, email, phone, status)</li>
            <li>Role presets (Hospital Admin, HR, Doctor Lead, etc.)</li>
            <li>Scope hints and notes</li>
            <li>Bulk invite option</li>
            <li>Resend invitation controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ServicesPricingStep;
