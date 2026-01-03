import React, { useState } from "react";
import { format } from "date-fns";
import { useCalendar } from "./CalendarContext";
import {
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { AppointmentFormModal } from "./modals/AppointmentFormModal";
import { RecurringAppointmentModal } from "./modals/RecurringAppointmentModal";

interface AppointmentDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentDetailsPanel: React.FC<
  AppointmentDetailsPanelProps
> = ({ isOpen, onClose }) => {
  const {
    selectedAppointment,
    appointments,
    cancelAppointment,
    deleteAppointment,
  } = useCalendar();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // For demo purposes, we'll show the first appointment if none is selected
  const appointment = selectedAppointment || appointments[0];

  // Debug log to check appointment data
  console.log(
    "AppointmentDetailsPanel - selectedAppointment:",
    selectedAppointment
  );
  console.log("AppointmentDetailsPanel - appointments:", appointments);
  console.log("AppointmentDetailsPanel - appointment:", appointment);

  if (!appointment) {
    return (
      <>
        {/* Backdrop overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-300"
            onClick={onClose}
          />
        )}

        {/* Side panel */}
        <div
          className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200/80 shadow-2xl transform transition-all duration-300 ease-out z-[101] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/80 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  Appointment Details
                </h2>
                <p className="text-sm text-slate-600">
                  No appointment selected
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Appointment Selected
            </h3>
            <p className="text-sm text-slate-600 text-center max-w-sm">
              Click on an appointment in the calendar to view its details and
              manage it.
            </p>
          </div>
        </div>
      </>
    );
  }

  const getStatusColor = () => {
    switch (appointment.status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getTypeColor = () => {
    switch (appointment.type) {
      case "consultation":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "surgery":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "follow-up":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "check-up":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    onClose();
  };

  const handleDelete = () => {
    deleteAppointment(appointment.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side panel */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200/80 shadow-2xl transform transition-all duration-300 ease-out z-[101] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/80 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                Appointment Details
              </h2>
              <p className="text-sm text-slate-600">
                Manage appointment information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 pb-40">
              {/* Status & Type Tags */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor()}`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getTypeColor()}`}
                >
                  {appointment.type.charAt(0).toUpperCase() +
                    appointment.type.slice(1)}
                </span>
              </div>

              {/* Date & Time Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-slate-600" />
                  Schedule
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-slate-700">
                    <span className="font-medium">
                      {format(appointment.startTime, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>
                      {format(appointment.startTime, "h:mm a")} -{" "}
                      {format(appointment.endTime, "h:mm a")}
                      <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded">
                        {appointment.duration} mins
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Information Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-slate-600" />
                  Patient Information
                </h3>

                <div className="flex items-start space-x-4 mb-4">
                  {/* Patient Photo or Initial */}
                  <div className="w-16 h-16 rounded-xl bg-slate-200 flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                    {appointment.patientPhoto ? (
                      <img
                        src={appointment.patientPhoto}
                        alt={appointment.patientName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8F3F4] to-[#006D77]/20 text-[#006D77] font-semibold text-xl">
                        {appointment.patientName?.charAt(0) || "P"}
                      </div>
                    )}
                  </div>

                  {/* Patient Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-lg mb-1">
                      {appointment.patientName || "Unknown Patient"}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      {appointment.patientAge || "N/A"} years old •{" "}
                      {appointment.patientGender || "Not specified"}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <PhoneIcon className="w-4 h-4 mr-2 text-slate-400" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <EnvelopeIcon className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="truncate">
                          {(appointment.patientName || "patient")
                            .toLowerCase()
                            .replace(" ", ".")}
                          @example.com
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Additional Details */}
                <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500 font-medium">
                        Patient ID:
                      </span>
                      <p className="text-slate-700">
                        {appointment.patientId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">
                        Blood Type:
                      </span>
                      <p className="text-slate-700">O+</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">
                        Allergies:
                      </span>
                      <p className="text-slate-700">Penicillin, Nuts</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">
                        Last Visit:
                      </span>
                      <p className="text-slate-700">Dec 15, 2024</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center justify-center py-3 text-xs bg-[#E8F3F4] text-[#006D77] border border-[#006D77]/20 rounded-lg hover:bg-[#006D77]/10 transition-all duration-200 font-medium">
                    <PhoneIcon className="w-4 h-4 mb-1" />
                    Call
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium">
                    <EnvelopeIcon className="w-4 h-4 mb-1" />
                    Message
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 text-xs bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all duration-200 font-medium">
                    <DocumentTextIcon className="w-4 h-4 mb-1" />
                    Records
                  </button>
                </div>
              </div>

              {/* Appointment Details Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <DocumentTextIcon className="w-4 h-4 mr-2 text-slate-600" />
                  Appointment Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Purpose
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                      {appointment.purpose || "No purpose specified"}
                    </p>
                  </div>

                  {appointment.preparationStatus && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Preparation Status
                      </h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                        {appointment.preparationStatus}
                      </p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Notes
                      </h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                        {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Additional appointment information */}
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">
                      Visit History
                    </h4>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        <span className="font-medium">Previous Visit:</span>{" "}
                        General Checkup - Dec 15, 2024
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        <span className="font-medium">Next Recommended:</span>{" "}
                        Follow-up in 6 months
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Summary Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <DocumentTextIcon className="w-4 h-4 mr-2 text-slate-600" />
                  Medical Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">
                      Current Medications
                    </h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p className="bg-slate-50 p-2 rounded">
                        • Lisinopril 10mg - Daily
                      </p>
                      <p className="bg-slate-50 p-2 rounded">
                        • Metformin 500mg - Twice daily
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">
                      Vital Signs (Last Visit)
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="font-medium">BP:</span> 120/80 mmHg
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="font-medium">Heart Rate:</span> 72 bpm
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="font-medium">Weight:</span> 150 lbs
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="font-medium">Height:</span> 5'6"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-sm p-6 space-y-4 shadow-lg">
            {/* Primary Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center py-3 px-4 bg-[#006D77] text-white rounded-lg hover:bg-[#005A66] transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit Appointment
              </button>

              {appointment.status !== "cancelled" ? (
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center py-3 px-4 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setShowRecurringModal(true)}
                  className="flex-1 flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Reschedule
                </button>
              )}
            </div>

            {/* Secondary Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setShowRecurringModal(true)}
                className="text-sm text-[#006D77] hover:text-[#005A66] font-medium hover:underline transition-all duration-200"
              >
                Create recurring appointment
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <TrashIcon className="w-3.5 h-3.5 mr-1" />
                  Delete
                </button>
              ) : (
                <div className="flex items-center space-x-3 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                  <span className="text-sm text-red-700 font-medium">
                    Confirm deletion?
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDelete}
                      className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md transition-all duration-200"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-sm text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 transition-all duration-200"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Appointment Modal */}
      {showEditModal && (
        <AppointmentFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          editAppointment={appointment}
        />
      )}

      {/* Recurring Appointment Modal */}
      {showRecurringModal && (
        <RecurringAppointmentModal
          isOpen={showRecurringModal}
          onClose={() => setShowRecurringModal(false)}
          appointment={appointment}
        />
      )}
    </>
  );
};
