import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MessageCircle,
  ChevronRight,
  User,
  Activity,
} from "lucide-react";
import { Patient, PatientStatus } from "@/types/patient";
import { formatDate } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
  onScheduleAppointment: () => void;
  onSendMessage: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  viewMode,
  onViewDetails,
  onScheduleAppointment,
  onSendMessage,
}) => {
  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "needs-attention":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return (
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        );
      case "needs-attention":
        return (
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        );
      case "critical":
        return (
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        );
      default:
        return <div className="w-2 h-2 bg-slate-400 rounded-full" />;
    }
  };

  const getStatusLabel = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "Stable";
      case "needs-attention":
        return "Needs Attention";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  // Check if patient has upcoming appointments
  const hasUpcomingAppointment =
    patient.upcomingAppointments && patient.upcomingAppointments.length > 0;
  const nextAppointment = hasUpcomingAppointment
    ? patient.upcomingAppointments![0]
    : null;

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border-slate-200/60 bg-white/90 hover:bg-white hover:border-[#006D77]/20 hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Patient Info - Compact */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {getStatusIcon(patient.status)}
                <h3 className="font-semibold text-lg text-slate-900 truncate">
                  {patient.name}
                </h3>
                <Badge
                  className={`${getStatusColor(
                    patient.status
                  )} text-xs px-2 py-0.5`}
                >
                  {getStatusLabel(patient.status)}
                </Badge>
              </div>
            </div>

            {/* Medical Info */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="text-xs">{patient.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-[#006D77]" />
                <span className="font-medium truncate max-w-32">
                  {patient.condition}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {patient.age}y • {patient.gender.charAt(0).toUpperCase()}
              </div>
              {nextAppointment && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(nextAppointment.date)}</span>
                </div>
              )}
            </div>

            {/* Actions - Compact */}
            <div className="flex items-center gap-1 ml-4">
              <Button
                size="sm"
                className="bg-[#006D77] hover:bg-[#005963] text-white px-4 py-1.5 h-8 text-xs"
                onClick={onViewDetails}
              >
                View
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white h-8 w-8 p-0"
                onClick={onScheduleAppointment}
              >
                <Calendar className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white h-8 w-8 p-0"
                onClick={onSendMessage}
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-white/90 hover:bg-white hover:border-[#006D77]/30 hover:-translate-y-1 max-w-sm">
      <CardContent className="p-4">
        {/* Header - Compact */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getStatusIcon(patient.status)}
            <h3 className="font-semibold text-lg text-slate-900 truncate group-hover:text-[#006D77] transition-colors">
              {patient.name}
            </h3>
          </div>
          <Badge
            className={`${getStatusColor(
              patient.status
            )} text-xs px-2 py-1 flex-shrink-0`}
          >
            {getStatusLabel(patient.status)}
          </Badge>
        </div>

        {/* Patient Details - Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-xs text-slate-500 mb-0.5">ID</div>
            <div className="font-medium text-slate-900">{patient.id}</div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-xs text-slate-500 mb-0.5">Age</div>
            <div className="font-medium text-slate-900">{patient.age}y</div>
          </div>
        </div>

        {/* Medical Info - Highlighted */}
        <div className="mb-3">
          <div className="bg-[#006D77]/5 p-2 rounded-lg border border-[#006D77]/10">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="h-3.5 w-3.5 text-[#006D77]" />
              <div className="text-xs text-[#006D77] font-medium">
                Condition
              </div>
            </div>
            <div className="font-semibold text-slate-900 text-sm truncate">
              {patient.condition}
            </div>
          </div>
        </div>

        {/* Last Visit & Next Appointment */}
        <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Last Visit:</span>
            <span className="font-medium">{formatDate(patient.lastVisit)}</span>
          </div>
          {nextAppointment && (
            <div className="flex items-center justify-between bg-blue-50 text-blue-700 p-2 rounded">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Next:</span>
              </div>
              <span className="font-medium">
                {formatDate(nextAppointment.date)}
              </span>
            </div>
          )}
        </div>

        {/* Actions - Compact */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-[#006D77] hover:bg-[#005963] text-white h-8 text-xs"
            onClick={onViewDetails}
          >
            View Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white h-8 w-8 p-0"
            onClick={onScheduleAppointment}
          >
            <Calendar className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white h-8 w-8 p-0"
            onClick={onSendMessage}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
