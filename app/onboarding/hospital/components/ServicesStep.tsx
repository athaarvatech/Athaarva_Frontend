"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plus,
  X,
  Clock,
  Video,
  Users,
  Info,
  Edit,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";

const defaultDepartments = [
  'General Medicine',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Gynecology',
  'Dermatology',
  'Neurology',
  'Psychiatry',
  'Emergency Medicine',
  'Radiology',
  'Pathology',
  'Pharmacy',
];

const weekDays = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' },
];

const slotDurations = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
];

const cancellationPolicies = [
  { 
    value: 'flexible', 
    label: 'Flexible', 
    description: 'Cancel up to 1 hour before appointment' 
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    description: 'Cancel up to 4 hours before appointment' 
  },
  { 
    value: 'strict', 
    label: 'Strict', 
    description: 'Cancel up to 24 hours before appointment' 
  },
];

const paymentOptions = [
  { value: 'clinic', label: 'Pay at Clinic', description: 'Payment on arrival' },
  { value: 'online', label: 'Pay Online', description: 'Online payment required' },
  { value: 'either', label: 'Either', description: 'Both options available' },
];

interface HoursEditorProps {
  day: string;
  hours: { start: string; end: string } | null;
  onSave: (hours: { start: string; end: string } | null) => void;
}

function HoursEditor({ day, hours, onSave }: HoursEditorProps) {
  const [localHours, setLocalHours] = useState(hours || { start: '09:00', end: '18:00' });
  const [isEnabled, setIsEnabled] = useState(!!hours);

  const handleSave = () => {
    onSave(isEnabled ? localHours : null);
  };

  return (
    <div className="space-y-4 w-80">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{day} Hours</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isEnabled}
            onCheckedChange={(checked) => setIsEnabled(!!checked)}
          />
          <span className="text-sm">Open</span>
        </div>
      </div>

      {isEnabled && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`${day}-start`} className="text-xs">Start Time</Label>
            <Input
              id={`${day}-start`}
              type="time"
              value={localHours.start}
              onChange={(e) => setLocalHours(prev => ({ ...prev, start: e.target.value }))}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor={`${day}-end`} className="text-xs">End Time</Label>
            <Input
              id={`${day}-end`}
              type="time"
              value={localHours.end}
              onChange={(e) => setLocalHours(prev => ({ ...prev, end: e.target.value }))}
              className="text-sm"
            />
          </div>
        </div>
      )}

      <Button onClick={handleSave} size="sm" className="w-full">
        Save Hours
      </Button>
    </div>
  );
}

export default function ServicesStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [newDepartment, setNewDepartment] = useState('');
  const [showAllDepartments, setShowAllDepartments] = useState(false);

  const addDepartment = (dept: string) => {
    if (dept && !data.services.departments.includes(dept)) {
      updateData('services', {
        departments: [...data.services.departments, dept],
      });
    }
  };

  const removeDepartment = (dept: string) => {
    updateData('services', {
      departments: data.services.departments.filter(d => d !== dept),
    });
  };

  const addCustomDepartment = () => {
    if (newDepartment.trim()) {
      addDepartment(newDepartment.trim());
      setNewDepartment('');
    }
  };

  const toggleWorkingDay = (day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun') => {
    const currentDays = data.services.workingDays;
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateData('services', { workingDays: updatedDays });
  };

  const toggleVisitMode = (mode: 'in_person' | 'tele_consultation') => {
    const currentModes = data.services.visitModes;
    const updatedModes = currentModes.includes(mode)
      ? currentModes.filter(m => m !== mode)
      : [...currentModes, mode];
    
    updateData('services', { visitModes: updatedModes });
  };

  const applyHoursToAll = () => {
    const overrides: Record<string, { start: string; end: string } | null> = {};
    data.services.workingDays.forEach(day => {
      overrides[day] = data.services.defaultHours;
    });
    weekDays.forEach(({ value }) => {
      if (!data.services.workingDays.includes(value as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')) {
        overrides[value] = null;
      }
    });
    
    updateData('services', { hourOverrides: overrides });
  };

  const setDayHours = (day: string, hours: { start: string; end: string } | null) => {
    updateData('services', {
      hourOverrides: {
        ...data.services.hourOverrides,
        [day]: hours,
      },
    });
  };

  const getDayHours = (day: string) => {
    return data.services.hourOverrides[day] !== undefined 
      ? data.services.hourOverrides[day]
      : (data.services.workingDays.includes(day as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun') ? data.services.defaultHours : null);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Services & Hours
        </h2>
        <p className="text-gray-600">
          Configure your hospital&apos;s departments, working hours, and appointment settings to enable smooth scheduling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Users className="h-5 w-5 text-healthcare-primary" />
              <span>Departments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">
                  Select Departments *
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllDepartments(!showAllDepartments)}
                  className="text-xs h-6 px-2"
                >
                  {showAllDepartments ? 'Show Less' : 'Show All'}
                  <ChevronDown className={cn(
                    "h-3 w-3 ml-1 transition-transform",
                    showAllDepartments && "rotate-180"
                  )} />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(showAllDepartments ? defaultDepartments : defaultDepartments.slice(0, 8))
                  .map((dept) => (
                  <Button
                    key={dept}
                    variant={data.services.departments.includes(dept) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      data.services.departments.includes(dept) 
                        ? removeDepartment(dept)
                        : addDepartment(dept)
                    }
                    className="justify-start h-8 text-xs"
                  >
                    {dept}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Add custom department"
                  className="text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomDepartment()}
                />
                <Button
                  onClick={addCustomDepartment}
                  size="sm"
                  disabled={!newDepartment.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected Departments */}
            {data.services.departments.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Selected ({data.services.departments.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {data.services.departments.map((dept) => (
                    <Badge
                      key={dept}
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                    >
                      {dept}
                      <button
                        onClick={() => removeDepartment(dept)}
                        className="ml-1 hover:bg-gray-300 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visit Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Video className="h-5 w-5 text-healthcare-primary" />
              <span>Visit Modes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Available Modes *
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={data.services.visitModes.includes('in_person')}
                    onCheckedChange={() => toggleVisitMode('in_person')}
                  />
                  <div>
                    <div className="font-medium text-sm">In-Person</div>
                    <div className="text-xs text-gray-500">
                      Traditional face-to-face consultations
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={data.services.visitModes.includes('tele_consultation')}
                    onCheckedChange={() => toggleVisitMode('tele_consultation')}
                  />
                  <div>
                    <div className="font-medium text-sm">Tele-consultation</div>
                    <div className="text-xs text-gray-500">
                      Video calls and remote consultations
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Settings */}
            <div className="pt-4 border-t space-y-4">
              <div>
                <Label htmlFor="slotDuration" className="text-sm font-medium">
                  Appointment Duration *
                </Label>
                <Select 
                  value={data.services.slotDuration.toString()} 
                  onValueChange={(value) => 
                    updateData('services', { slotDuration: parseInt(value) as 10 | 15 | 20 | 30 })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {slotDurations.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value.toString()}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cancellationPolicy" className="text-sm font-medium">
                  Cancellation Policy *
                </Label>
                <Select 
                  value={data.services.cancellationPolicy} 
                  onValueChange={(value: 'flexible' | 'moderate' | 'strict') => 
                    updateData('services', { cancellationPolicy: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationPolicies.map((policy) => (
                      <SelectItem key={policy.value} value={policy.value}>
                        <div>
                          <div className="font-medium">{policy.label}</div>
                          <div className="text-xs text-gray-500">{policy.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentPreference" className="text-sm font-medium">
                  Payment Preference *
                </Label>
                <Select 
                  value={data.services.paymentPreference} 
                  onValueChange={(value: 'clinic' | 'online' | 'either') => 
                    updateData('services', { paymentPreference: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Clock className="h-5 w-5 text-healthcare-primary" />
            <span>Working Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Working Days */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Working Days *
            </Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <Button
                  key={day.value}
                  variant={data.services.workingDays.includes(day.value as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun') ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleWorkingDay(day.value as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')}
                  className="w-12 h-8"
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Default Hours */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Default Hours *</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={applyHoursToAll}
                className="text-xs h-7 px-2"
              >
                Apply to All Days
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              <div>
                <Label htmlFor="defaultStart" className="text-xs">Opening Time</Label>
                <Input
                  id="defaultStart"
                  type="time"
                  value={data.services.defaultHours.start}
                  onChange={(e) => updateData('services', {
                    defaultHours: { ...data.services.defaultHours, start: e.target.value }
                  })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="defaultEnd" className="text-xs">Closing Time</Label>
                <Input
                  id="defaultEnd"
                  type="time"
                  value={data.services.defaultHours.end}
                  onChange={(e) => updateData('services', {
                    defaultHours: { ...data.services.defaultHours, end: e.target.value }
                  })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Per-Day Hours */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Per-Day Hours (Optional)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayHours = getDayHours(day.value);
                return (
                  <div key={day.value} className="text-center">
                    <div className="text-xs font-medium mb-1">{day.label}</div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full h-12 text-xs flex flex-col p-1",
                            !dayHours && "text-gray-400"
                          )}
                        >
                          {dayHours ? (
                            <>
                              <div>{formatTime(dayHours.start)}</div>
                              <div>{formatTime(dayHours.end)}</div>
                            </>
                          ) : (
                            <div>Closed</div>
                          )}
                          <Edit className="h-3 w-3 mt-0.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="top" align="center">
                        <HoursEditor
                          day={day.label}
                          hours={dayHours}
                          onSave={(hours) => setDayHours(day.value, hours)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              })}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Click any day to customize hours, or use &quot;Apply to All Days&quot; for quick setup
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Helper Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Configuration Tips</p>
            <ul className="text-xs space-y-1">
              <li>• Select at least one department and visit mode to enable appointments</li>
              <li>• Working hours can be customized per day after setting default hours</li>
              <li>• Appointment duration affects how many slots are available per hour</li>
              <li>• Payment preferences can be changed later in hospital settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
