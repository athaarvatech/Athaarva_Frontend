"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Clock,
  User,
  Check,
  AlertCircle,
  CalendarPlus,
  MessageSquare,
  Bell,
  Video,
  Building2,
  Phone,
} from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { useConsultation } from "../context/ConsultationContext";
import { cn } from "@/lib/utils";

// Types
interface FollowUpType {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface FollowUpSchedule {
  type: "in_person" | "video" | "phone";
  date: Date | null;
  time: string;
  duration: number;
  reason: string;
  instructions: string;
  reminders: {
    email: boolean;
    sms: boolean;
    daysBefore: number[];
  };
}

// Follow-up types
const FOLLOW_UP_TYPES: FollowUpType[] = [
  {
    id: "in_person",
    label: "In-Person Visit",
    icon: Building2,
    description: "Schedule a clinic visit",
  },
  {
    id: "video",
    label: "Video Consultation",
    icon: Video,
    description: "Virtual video appointment",
  },
  {
    id: "phone",
    label: "Phone Call",
    icon: Phone,
    description: "Telephone follow-up",
  },
];

// Quick schedule presets
const QUICK_SCHEDULES = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
];

// Duration options
const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
];

// Generate mock time slots
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      // Mock availability - randomly mark some as unavailable
      slots.push({
        time,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
};

export function FollowUpScheduler() {
  const { consultation, updateConsultation } = useConsultation();
  const [showDialog, setShowDialog] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedule, setSchedule] = useState<FollowUpSchedule>({
    type: "in_person",
    date: null,
    time: "",
    duration: 30,
    reason: "",
    instructions: "",
    reminders: {
      email: true,
      sms: true,
      daysBefore: [1, 7],
    },
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [scheduledAppointment, setScheduledAppointment] = useState<FollowUpSchedule | null>(null);

  // Update time slots when date changes
  useEffect(() => {
    if (schedule.date) {
      setTimeSlots(generateTimeSlots(schedule.date));
    }
  }, [schedule.date]);

  // Quick date selection
  const handleQuickSchedule = (days: number) => {
    const newDate = addDays(new Date(), days);
    setSchedule((prev) => ({
      ...prev,
      date: newDate,
      time: "",
    }));
  };

  // Schedule appointment
  const handleSchedule = async () => {
    if (!schedule.date || !schedule.time) return;

    setIsScheduling(true);
    try {
      // TODO: Integrate with actual appointment API
      console.log("Scheduling follow-up:", schedule);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setScheduledAppointment(schedule);
      setShowDialog(false);

      // Update consultation context
      updateConsultation({
        ...consultation,
        // Add follow-up info
      } as any);
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      alert("Failed to schedule follow-up. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSchedule({
      type: "in_person",
      date: null,
      time: "",
      duration: 30,
      reason: "",
      instructions: "",
      reminders: {
        email: true,
        sms: true,
        daysBefore: [1, 7],
      },
    });
  };

  const selectedType = FOLLOW_UP_TYPES.find((t) => t.id === schedule.type);

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Follow-Up Scheduling
            </CardTitle>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <CalendarPlus className="h-4 w-4 mr-1" />
                  Schedule Follow-Up
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule Follow-Up Appointment</DialogTitle>
                  <DialogDescription>
                    Schedule a follow-up for the current patient
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Appointment Type */}
                  <div>
                    <Label className="text-base mb-3 block">Appointment Type</Label>
                    <RadioGroup
                      value={schedule.type}
                      onValueChange={(value: "in_person" | "video" | "phone") =>
                        setSchedule((prev) => ({ ...prev, type: value }))
                      }
                      className="grid grid-cols-3 gap-3"
                    >
                      {FOLLOW_UP_TYPES.map((type) => (
                        <Label
                          key={type.id}
                          htmlFor={type.id}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors",
                            schedule.type === type.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted"
                          )}
                        >
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="sr-only"
                          />
                          <type.icon
                            className={cn(
                              "h-6 w-6 mb-2",
                              schedule.type === type.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span className="font-medium text-sm">{type.label}</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            {type.description}
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Quick Schedule Options */}
                  <div>
                    <Label className="mb-2 block">Quick Schedule</Label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_SCHEDULES.map((option) => (
                        <Button
                          key={option.days}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickSchedule(option.days)}
                          className={cn(
                            schedule.date &&
                              Math.abs(
                                (schedule.date.getTime() - addDays(new Date(), option.days).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              ) < 1
                              ? "border-primary bg-primary/5"
                              : ""
                          )}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Select Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !schedule.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {schedule.date ? (
                              format(schedule.date, "PPP")
                            ) : (
                              "Pick a date"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={schedule.date || undefined}
                            onSelect={(date) =>
                              setSchedule((prev) => ({ ...prev, date: date || null, time: "" }))
                            }
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="mb-2 block">Duration</Label>
                      <Select
                        value={schedule.duration.toString()}
                        onValueChange={(val) =>
                          setSchedule((prev) => ({ ...prev, duration: parseInt(val) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Time Slots */}
                  {schedule.date && (
                    <div>
                      <Label className="mb-2 block">Available Time Slots</Label>
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={schedule.time === slot.time ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() =>
                              setSchedule((prev) => ({ ...prev, time: slot.time }))
                            }
                            className={cn(
                              "text-sm",
                              !slot.available && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reason and Instructions */}
                  <div className="space-y-4">
                    <div>
                      <Label>Reason for Follow-Up</Label>
                      <Input
                        placeholder="E.g., Review lab results, Medication adjustment"
                        value={schedule.reason}
                        onChange={(e) =>
                          setSchedule((prev) => ({ ...prev, reason: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Instructions for Patient</Label>
                      <Textarea
                        placeholder="Any special instructions for the patient before the follow-up..."
                        value={schedule.instructions}
                        onChange={(e) =>
                          setSchedule((prev) => ({ ...prev, instructions: e.target.value }))
                        }
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Reminder Settings */}
                  <div>
                    <Label className="mb-2 block">Reminder Settings</Label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={schedule.reminders.email}
                          onChange={(e) =>
                            setSchedule((prev) => ({
                              ...prev,
                              reminders: { ...prev.reminders, email: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Email reminder</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={schedule.reminders.sms}
                          onChange={(e) =>
                            setSchedule((prev) => ({
                              ...prev,
                              reminders: { ...prev.reminders, sms: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">SMS reminder</span>
                      </label>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSchedule}
                    disabled={!schedule.date || !schedule.time || isScheduling}
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Appointment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Scheduled Appointment Display */}
          {scheduledAppointment ? (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">
                    Follow-Up Scheduled
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-green-700">
                    <div className="flex items-center gap-2">
                      {selectedType && <selectedType.icon className="h-4 w-4" />}
                      <span className="capitalize">{scheduledAppointment.type.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {scheduledAppointment.date && format(scheduledAppointment.date, "PPP")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {scheduledAppointment.time} ({scheduledAppointment.duration} min)
                      </span>
                    </div>
                    {scheduledAppointment.reason && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{scheduledAppointment.reason}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline" className="bg-green-100">
                      <Bell className="h-3 w-3 mr-1" />
                      Reminders enabled
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSchedule(scheduledAppointment);
                    setShowDialog(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <CalendarDays className="h-12 w-12 mb-3 opacity-50" />
              <p>No follow-up scheduled yet</p>
              <p className="text-sm mt-1">
                Click &quot;Schedule Follow-Up&quot; to set a return appointment
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow-Up Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Recommended Follow-Ups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div>
                <p className="font-medium text-amber-800">Lab Results Review</p>
                <p className="text-sm text-amber-600">
                  Review CBC and lipid panel results after lab completion
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSchedule((prev) => ({
                    ...prev,
                    type: "phone",
                    reason: "Lab Results Review",
                  }));
                  handleQuickSchedule(7);
                  setShowDialog(true);
                }}
              >
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Medication Check</p>
                <p className="text-sm text-blue-600">
                  Follow-up to assess medication efficacy
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSchedule((prev) => ({
                    ...prev,
                    type: "in_person",
                    reason: "Medication Check",
                  }));
                  handleQuickSchedule(30);
                  setShowDialog(true);
                }}
              >
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FollowUpScheduler;
