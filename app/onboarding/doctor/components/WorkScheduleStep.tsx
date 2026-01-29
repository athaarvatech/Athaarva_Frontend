"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Clock,
  AlertCircle,
  X,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "../page";

interface WorkScheduleStepProps {
  data: OnboardingData;
  updateData: <T extends keyof OnboardingData>(
    section: T,
    data: Partial<OnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const daysOfWeek = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

interface WorkingHour {
  id: string;
  start: string;
  end: string;
  label?: string;
}

interface LeaveEntry {
  id: string;
  date: Date;
  reason: string;
}

function WorkScheduleStep({
  data,
  updateData,
  onStepComplete,
}: WorkScheduleStepProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [leaveEntries, setLeaveEntries] = useState<LeaveEntry[]>([]);
  const [newLeaveReason, setNewLeaveReason] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const schedule = data.schedule;

  // Initialize state from data
  useEffect(() => {
    if (schedule.workingHours.length > 0) {
      setWorkingHours(
        schedule.workingHours.map((wh, index) => ({
          id: `wh-${index}`,
          start: wh.start,
          end: wh.end,
        }))
      );
    }

    if (schedule.availableDays.length > 0) {
      setAvailableDays(schedule.availableDays);
    }

    if (schedule.blockedDates.length > 0) {
      setBlockedDates(schedule.blockedDates);
    }

    if (schedule.leavePreferences.length > 0) {
      setLeaveEntries(
        schedule.leavePreferences.map((leave, index) => ({
          id: `leave-${index}`,
          date: leave.date,
          reason: leave.reason || "",
        }))
      );
    }
  }, [
    schedule.workingHours,
    schedule.availableDays,
    schedule.blockedDates,
    schedule.leavePreferences,
  ]);

  // Add working hour slot
  const addWorkingHour = () => {
    const newHour: WorkingHour = {
      id: `wh-${Date.now()}`,
      start: "09:00",
      end: "17:00",
    };

    const updatedHours = [...workingHours, newHour];
    setWorkingHours(updatedHours);

    updateData("schedule", {
      workingHours: updatedHours.map((wh) => ({
        start: wh.start,
        end: wh.end,
      })),
    });
  };

  // Update working hour
  const updateWorkingHour = (
    id: string,
    field: "start" | "end",
    value: string
  ) => {
    const updatedHours = workingHours.map((wh) =>
      wh.id === id ? { ...wh, [field]: value } : wh
    );

    setWorkingHours(updatedHours);

    updateData("schedule", {
      workingHours: updatedHours.map((wh) => ({
        start: wh.start,
        end: wh.end,
      })),
    });
  };

  // Remove working hour
  const removeWorkingHour = (id: string) => {
    const updatedHours = workingHours.filter((wh) => wh.id !== id);
    setWorkingHours(updatedHours);

    updateData("schedule", {
      workingHours: updatedHours.map((wh) => ({
        start: wh.start,
        end: wh.end,
      })),
    });
  };

  // Toggle day availability
  const toggleDay = (dayId: string) => {
    let updatedDays;
    if (availableDays.includes(dayId)) {
      updatedDays = availableDays.filter((d) => d !== dayId);
    } else {
      updatedDays = [...availableDays, dayId];
    }

    setAvailableDays(updatedDays);
    updateData("schedule", { availableDays: updatedDays });
  };

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const updatedBlockedDates = [...blockedDates, date];
      setBlockedDates(updatedBlockedDates);
      updateData("schedule", { blockedDates: updatedBlockedDates });

      // Add to leave entries with empty reason initially
      const newLeave: LeaveEntry = {
        id: `leave-${Date.now()}`,
        date,
        reason: newLeaveReason || "Personal Leave",
      };

      const updatedLeaves = [...leaveEntries, newLeave];
      setLeaveEntries(updatedLeaves);

      updateData("schedule", {
        leavePreferences: updatedLeaves.map((leave) => ({
          date: leave.date,
          reason: leave.reason,
        })),
      });

      setNewLeaveReason("");
    }
  };

  // Remove blocked date
  const removeBlockedDate = (dateToRemove: Date, leaveId: string) => {
    const updatedBlockedDates = blockedDates.filter(
      (date) => date.getTime() !== dateToRemove.getTime()
    );
    setBlockedDates(updatedBlockedDates);
    updateData("schedule", { blockedDates: updatedBlockedDates });

    const updatedLeaves = leaveEntries.filter((leave) => leave.id !== leaveId);
    setLeaveEntries(updatedLeaves);
    updateData("schedule", {
      leavePreferences: updatedLeaves.map((leave) => ({
        date: leave.date,
        reason: leave.reason,
      })),
    });
  };

  // Update leave reason
  const updateLeaveReason = (id: string, reason: string) => {
    const updatedLeaves = leaveEntries.map((leave) =>
      leave.id === id ? { ...leave, reason } : leave
    );

    setLeaveEntries(updatedLeaves);
    updateData("schedule", {
      leavePreferences: updatedLeaves.map((leave) => ({
        date: leave.date,
        reason: leave.reason,
      })),
    });
  };

  // Validate time slot
  const isValidTimeSlot = (start: string, end: string) => {
    return start && end && start < end;
  };

  // Check step completion
  const isStepComplete = useCallback(() => {
    return (
      workingHours.length > 0 &&
      workingHours.every((wh) => isValidTimeSlot(wh.start, wh.end)) &&
      availableDays.length > 0
    );
  }, [workingHours, availableDays]);

  // Auto-complete step when all requirements are met
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete();
    }
  }, [workingHours, availableDays, isStepComplete, onStepComplete]);

  return (
    <div className="space-y-8">
      {/* Working Hours Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-healthcare-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Working Hours
                </h3>
              </div>
              <Button
                onClick={addWorkingHour}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Time Slot
              </Button>
            </div>

            {workingHours.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No working hours configured yet.</p>
                <p className="text-sm">
                  Click &quot;Add Time Slot&quot; to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workingHours.map((workingHour, index) => (
                  <motion.div
                    key={workingHour.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-lg border transition-colors",
                      isValidTimeSlot(workingHour.start, workingHour.end)
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    )}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Label className="text-sm font-medium text-gray-700 min-w-fit">
                        Slot {index + 1}:
                      </Label>
                      <Input
                        type="time"
                        value={workingHour.start}
                        onChange={(e) =>
                          updateWorkingHour(
                            workingHour.id,
                            "start",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                      <span className="text-gray-400">to</span>
                      <Input
                        type="time"
                        value={workingHour.end}
                        onChange={(e) =>
                          updateWorkingHour(
                            workingHour.id,
                            "end",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                      {isValidTimeSlot(workingHour.start, workingHour.end) && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <Button
                      onClick={() => removeWorkingHour(workingHour.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Days Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-healthcare-emerald/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-healthcare-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Available Days
              </h3>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Select the days you are available for consultations:
              </Label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                      availableDays.includes(day.id)
                        ? "border-healthcare-emerald bg-healthcare-emerald/10 text-healthcare-emerald"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    )}
                  >
                    <div className="font-medium">{day.short}</div>
                    <div className="text-xs opacity-75">{day.label}</div>
                  </button>
                ))}
              </div>

              {availableDays.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableDays.map((dayId) => {
                    const day = daysOfWeek.find((d) => d.id === dayId);
                    return (
                      <Badge
                        key={dayId}
                        variant="secondary"
                        className="bg-healthcare-emerald/10 text-healthcare-emerald"
                      >
                        {day?.label}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leave Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-healthcare-teal/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-healthcare-teal" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Leave Preferences
                </h3>
              </div>
              <Button
                onClick={() => setShowCalendar(!showCalendar)}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Block Dates
              </Button>
            </div>

            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="leaveReason"
                    className="text-sm font-medium text-gray-700"
                  >
                    Leave Reason (Optional)
                  </Label>
                  <Input
                    id="leaveReason"
                    placeholder="e.g., Conference, Personal Leave, Vacation"
                    value={newLeaveReason}
                    onChange={(e) => setNewLeaveReason(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date < new Date() ||
                      blockedDates.some(
                        (blockedDate) =>
                          blockedDate.toDateString() === date.toDateString()
                      )
                    }
                    className="rounded-md border"
                  />
                </div>
              </motion.div>
            )}

            {/* Blocked Dates List */}
            {leaveEntries.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Blocked Dates ({leaveEntries.length})
                </Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {leaveEntries
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((leave) => (
                      <div
                        key={leave.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-healthcare-teal" />
                            <span className="font-medium text-gray-900">
                              {leave.date.toLocaleDateString("en-IN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <Input
                            placeholder="Leave reason (optional)"
                            value={leave.reason}
                            onChange={(e) =>
                              updateLeaveReason(leave.id, e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                        <Button
                          onClick={() =>
                            removeBlockedDate(leave.date, leave.id)
                          }
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {leaveEntries.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No blocked dates yet.</p>
                <p className="text-xs">
                  Click &quot;Block Dates&quot; to add leave periods.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border border-gray-100 bg-gradient-to-br from-healthcare-cool-white to-white">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Schedule Summary
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">Working Hours</p>
                <p className="text-gray-600">
                  {workingHours.length} time slot(s) configured
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Available Days</p>
                <p className="text-gray-600">
                  {availableDays.length} day(s) per week
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Blocked Dates</p>
                <p className="text-gray-600">
                  {blockedDates.length} date(s) blocked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isStepComplete() ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Work schedule configured successfully!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Please configure at least one time slot and select available days
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default WorkScheduleStep;
