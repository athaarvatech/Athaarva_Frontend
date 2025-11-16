"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Eye, FileText, Image as ImageIcon, Shield } from 'lucide-react';
import { useHospitalOnboarding } from '@/contexts/HospitalOnboardingContextV2';
import { PhasedPublishSelector } from '../widgets/PhasedPublishSelector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const STEP_NAMES = [
  'Template Selection',
  'Organization Profile',
  'Locations & Contacts',
  'Branding Studio',
  'Site Content',
  'Services & Pricing',
  'Leadership & Team',
  'Operational Policies',
  'Compliance & Documentation',
  'Integrations',
  'Admin Invitations',
  'Review & Submission',
];

export default function ReviewSubmissionStep() {
  const { data, updateData, getStepCompletion, isStepValid } = useHospitalOnboarding();
  const review = data.review;
  const stepCompletion = getStepCompletion();

  const completedSteps = Object.values(stepCompletion).filter(Boolean).length;
  const totalSteps = Object.keys(stepCompletion).length;
  const completionPercentage = (completedSteps / totalSteps) * 100;

  const allAcknowledged =
    review.acknowledgements.terms &&
    review.acknowledgements.privacy &&
    review.acknowledgements.dpa &&
    review.acknowledgements.ai_usage;

  const canSubmit = completionPercentage === 100 && allAcknowledged;

  // Collect all uploaded media
  const mediaAssets = [
    { type: 'Logo', url: data.branding.logo_url },
    { type: 'Hero Background', url: data.branding.hero_asset_url },
    { type: 'Favicon', url: data.branding.favicon_url },
    ...data.leadershipTeam.leadership_cards.map(card => ({
      type: `Profile: ${card.full_name}`,
      url: card.profile_photo_url,
    })),
  ].filter(asset => asset.url);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-healthcare-primary/10 to-healthcare-emerald/10 border border-healthcare-primary/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Onboarding Progress</h3>
            <p className="text-sm text-gray-600 mt-1">
              Review your information before going live
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-healthcare-primary">
              {Math.round(completionPercentage)}%
            </div>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>
        <Progress value={completionPercentage} className="h-3" />
        <p className="text-sm text-gray-600 mt-2">
          {completedSteps} of {totalSteps} steps completed
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Step Completion Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step Completion</h3>
            <div className="space-y-2">
              {Object.entries(stepCompletion).map(([stepId, completed]) => {
                const stepNum = parseInt(stepId);
                return (
                  <StepStatusItem
                    key={stepId}
                    stepNumber={stepNum}
                    title={STEP_NAMES[stepNum]}
                    completed={completed}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Acknowledgements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Legal Acknowledgements</h3>
                <p className="text-xs text-gray-600">Please review and accept to continue</p>
              </div>
            </div>

            <div className="space-y-4">
              <AcknowledgementItem
                id="terms"
                checked={review.acknowledgements.terms}
                onChange={(checked) =>
                  updateData('review', {
                    acknowledgements: { ...review.acknowledgements, terms: checked },
                  })
                }
                title="Terms & Conditions"
                description="I agree to the Athaarva platform terms of service"
                link="/terms"
              />

              <AcknowledgementItem
                id="privacy"
                checked={review.acknowledgements.privacy}
                onChange={(checked) =>
                  updateData('review', {
                    acknowledgements: { ...review.acknowledgements, privacy: checked },
                  })
                }
                title="Privacy Policy"
                description="I have reviewed the privacy policy regarding patient data"
                link="/privacy"
              />

              <AcknowledgementItem
                id="dpa"
                checked={review.acknowledgements.dpa}
                onChange={(checked) =>
                  updateData('review', {
                    acknowledgements: { ...review.acknowledgements, dpa: checked },
                  })
                }
                title="Data Processing Agreement"
                description="I consent to data processing as per GDPR/HIPAA guidelines"
                link="/dpa"
              />

              <AcknowledgementItem
                id="ai"
                checked={review.acknowledgements.ai_usage}
                onChange={(checked) =>
                  updateData('review', {
                    acknowledgements: { ...review.acknowledgements, ai_usage: checked },
                  })
                }
                title="AI Usage Policy"
                description="I understand how AI features will be used in the platform"
                link="/ai-policy"
              />
            </div>

            {!allAcknowledged && (
              <div className="mt-4 flex items-start text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>Please accept all acknowledgements before submitting.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Media Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Media Gallery</h3>
                <p className="text-xs text-gray-600">{mediaAssets.length} assets uploaded</p>
              </div>
            </div>

            {mediaAssets.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {mediaAssets.slice(0, 6).map((asset, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-100 relative group"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs truncate">
                      {asset.type}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No media assets uploaded</p>
              </div>
            )}
          </motion.div>

          {/* Document Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <p className="text-xs text-gray-600">
                  {data.compliance.documents.length} documents uploaded
                </p>
              </div>
            </div>

            {data.compliance.documents.length > 0 ? (
              <div className="space-y-2">
                {data.compliance.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{doc.type}</span>
                    </div>
                    <Badge
                      variant={doc.status === 'uploaded' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No documents uploaded</p>
              </div>
            )}
          </motion.div>

          {/* Publication Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <PhasedPublishSelector
              value={review.publication_plan.launch_mode}
              scheduledAt={review.publication_plan.scheduled_at}
              onChange={(mode, scheduledAt) =>
                updateData('review', {
                  publication_plan: { launch_mode: mode, scheduled_at: scheduledAt },
                })
              }
            />
          </motion.div>
        </div>
      </div>

      {/* Final Status Banner */}
      {canSubmit ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-healthcare-emerald/10 border border-healthcare-emerald/20 rounded-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <CheckCircle2 className="w-12 h-12 text-healthcare-emerald flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-healthcare-emerald mb-1">
                Ready to Launch!
              </h3>
              <p className="text-sm text-gray-700">
                All requirements met. Click the "Submit & Go Live" button to complete your onboarding.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <AlertCircle className="w-12 h-12 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-1">
                Action Required
              </h3>
              <p className="text-sm text-gray-700">
                {completionPercentage < 100 && 'Complete all required steps. '}
                {!allAcknowledged && 'Accept all legal acknowledgements.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface StepStatusItemProps {
  stepNumber: number;
  title: string;
  completed: boolean;
}

function StepStatusItem({ stepNumber, title, completed }: StepStatusItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all',
        completed
          ? 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold',
            completed
              ? 'bg-healthcare-emerald text-white'
              : 'bg-gray-200 text-gray-600'
          )}
        >
          {completed ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
        </div>
        <span className={cn('text-sm font-medium', completed ? 'text-gray-900' : 'text-gray-600')}>
          {title}
        </span>
      </div>
      {completed ? (
        <Badge className="bg-healthcare-emerald text-white">Complete</Badge>
      ) : (
        <Badge variant="outline">Pending</Badge>
      )}
    </div>
  );
}

interface AcknowledgementItemProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
  link: string;
}

function AcknowledgementItem({
  id,
  checked,
  onChange,
  title,
  description,
  link,
}: AcknowledgementItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="mt-1"
      />
      <div className="flex-1">
        <Label htmlFor={id} className="font-medium text-gray-900 cursor-pointer">
          {title}
        </Label>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-healthcare-primary hover:underline mt-1 inline-block"
        >
          Read full document →
        </a>
      </div>
    </div>
  );
}
