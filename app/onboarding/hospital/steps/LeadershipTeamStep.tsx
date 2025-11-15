"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, UserCircle, Linkedin, Upload, X, Users, Briefcase } from 'lucide-react';
import { useHospitalOnboarding } from '@/contexts/HospitalOnboardingContextV2';
import { HelpPopover } from '../widgets/HelpPopover';
import { FileUploadZone } from '../widgets/FileUploadZone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LeaderData {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  credentials?: string;
  linkedin_url?: string;
  profile_photo_url?: string;
  profile_photo_file?: File | null;
}

interface StaffingPlanItem {
  id: string;
  role: string;
  count: number;
  status: 'planned' | 'recruiting' | 'filled';
}

export default function LeadershipTeamStep() {
  const { data, updateData } = useHospitalOnboarding();

  // Safety checks
  const leadershipTeam = data.leadershipTeam || {
    leadership_cards: [],
    staffing_plan: [],
  };

  const leadershipCards = Array.isArray(leadershipTeam.leadership_cards) ? leadershipTeam.leadership_cards : [];
  const staffingPlan = Array.isArray(leadershipTeam.staffing_plan) ? leadershipTeam.staffing_plan : [];

  // Leadership management
  const addLeader = () => {
    const newLeader: LeaderData = {
      id: `leader_${Date.now()}`,
      full_name: '',
      role: '',
      bio: '',
      credentials: '',
      linkedin_url: '',
      profile_photo_url: '',
      profile_photo_file: null,
    };

    updateData('leadershipTeam', {
      ...leadershipTeam,
      leadership_cards: [...leadershipCards, newLeader],
    } as any);
  };

  const updateLeader = (id: string, updates: Partial<LeaderData>) => {
    const updatedLeaders = leadershipCards.map(l =>
      l.id === id ? { ...l, ...updates } : l
    );
    updateData('leadershipTeam', {
      ...leadershipTeam,
      leadership_cards: updatedLeaders,
    } as any);
  };

  const removeLeader = (id: string) => {
    updateData('leadershipTeam', {
      ...leadershipTeam,
      leadership_cards: leadershipCards.filter(l => l.id !== id),
    } as any);
  };

  // Staffing plan management
  const addStaffingRole = () => {
    const newRole: StaffingPlanItem = {
      id: `staff_${Date.now()}`,
      role: '',
      count: 1,
      status: 'planned',
    };

    updateData('leadershipTeam', {
      ...leadershipTeam,
      staffing_plan: [...staffingPlan, newRole],
    } as any);
  };

  const updateStaffingRole = (id: string, updates: Partial<StaffingPlanItem>) => {
    const updatedPlan = staffingPlan.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    updateData('leadershipTeam', {
      ...leadershipTeam,
      staffing_plan: updatedPlan,
    } as any);
  };

  const removeStaffingRole = (id: string) => {
    updateData('leadershipTeam', {
      ...leadershipTeam,
      staffing_plan: staffingPlan.filter(s => s.id !== id),
    } as any);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Leadership & Team</h3>
        <p className="text-sm text-gray-600 mt-1">
          Introduce your leadership team and outline staffing requirements
        </p>
      </div>

      {/* Leadership Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Leadership Team</Label>
          <Button onClick={addLeader} size="sm" className="bg-healthcare-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Leader
          </Button>
        </div>

        <AnimatePresence>
          {leadershipCards.map((leader, index) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              index={index}
              onUpdate={(updates) => updateLeader(leader.id, updates)}
              onRemove={() => removeLeader(leader.id)}
            />
          ))}
        </AnimatePresence>

        {leadershipCards.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No leadership members added yet</p>
            <Button onClick={addLeader} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Leader
            </Button>
          </div>
        )}
      </div>

      {/* Staffing Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Staffing Plan</Label>
            <HelpPopover
              title="Staffing Plan"
              content="Outline your staffing requirements by role and current recruitment status"
            />
          </div>
          <Button onClick={addStaffingRole} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        {staffingPlan.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffingPlan.map((item) => (
                  <StaffingPlanRow
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => updateStaffingRole(item.id, updates)}
                    onRemove={() => removeStaffingRole(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {staffingPlan.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No staffing roles defined</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Leader Card Component
interface LeaderCardProps {
  leader: LeaderData;
  index: number;
  onUpdate: (updates: Partial<LeaderData>) => void;
  onRemove: () => void;
}

function LeaderCard({ leader, index, onUpdate, onRemove }: LeaderCardProps) {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handlePhotoUpload = async (url: string) => {
    onUpdate({ profile_photo_url: url });
    setShowPhotoUpload(false);
  };

  const wordCount = (leader.bio || '').trim().split(/\s+/).filter(Boolean).length;
  const maxWords = 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-healthcare-primary" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">
              Leader #{index + 1}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {leader.full_name || 'Unnamed Leader'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        {leader.profile_photo_url ? (
          <div className="relative inline-block">
            <img
              src={leader.profile_photo_url}
              alt={leader.full_name}
              className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
            />
            <button
              onClick={() => onUpdate({ profile_photo_url: '', profile_photo_file: null })}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowPhotoUpload(true)}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        )}

        {showPhotoUpload && !leader.profile_photo_url && (
          <FileUploadZone
            onFileSelect={(file) => console.log('File selected:', file)}
            onUploadComplete={handlePhotoUpload}
            maxSizeMB={5}
            label="Upload profile photo (JPG, PNG, or WebP, max 5MB)"
            accept="image/*"
          />
        )}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={leader.full_name}
            onChange={(e) => onUpdate({ full_name: e.target.value })}
            placeholder="Dr. John Smith"
          />
        </div>

        <div className="space-y-2">
          <Label>Role/Title *</Label>
          <Input
            value={leader.role}
            onChange={(e) => onUpdate({ role: e.target.value })}
            placeholder="Chief Medical Officer"
          />
        </div>
      </div>

      {/* Credentials */}
      <div className="space-y-2">
        <Label>Credentials</Label>
        <Input
          value={leader.credentials}
          onChange={(e) => onUpdate({ credentials: e.target.value })}
          placeholder="MD, MBBS, FRCS"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Biography</Label>
          <span className={cn(
            "text-xs",
            wordCount > maxWords ? "text-red-600" : "text-gray-500"
          )}>
            {wordCount} / {maxWords} words
          </span>
        </div>
        <Textarea
          value={leader.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          placeholder="Brief professional biography..."
          rows={4}
        />
      </div>

      {/* LinkedIn */}
      <div className="space-y-2">
        <Label>LinkedIn URL</Label>
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={leader.linkedin_url}
            onChange={(e) => onUpdate({ linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/..."
            className="pl-10"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Staffing Plan Row Component
interface StaffingPlanRowProps {
  item: StaffingPlanItem;
  onUpdate: (updates: Partial<StaffingPlanItem>) => void;
  onRemove: () => void;
}

function StaffingPlanRow({ item, onUpdate, onRemove }: StaffingPlanRowProps) {
  const statusOptions = [
    { value: 'planned', label: 'Planned', color: 'bg-gray-100 text-gray-700' },
    { value: 'recruiting', label: 'Recruiting', color: 'bg-blue-100 text-blue-700' },
    { value: 'filled', label: 'Filled', color: 'bg-green-100 text-green-700' },
  ];

  const currentStatus = statusOptions.find(s => s.value === item.status) || statusOptions[0];

  return (
    <tr>
      <td className="px-4 py-3">
        <Input
          value={item.role}
          onChange={(e) => onUpdate({ role: e.target.value })}
          placeholder="e.g., Cardiologist"
          className="min-w-[200px]"
        />
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          value={item.count}
          onChange={(e) => onUpdate({ count: parseInt(e.target.value) || 1 })}
          min="1"
          className="w-20"
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={item.status}
          onChange={(e) => onUpdate({ status: e.target.value as StaffingPlanItem['status'] })}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium border-0",
            currentStatus.color
          )}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
