import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Patient, PatientStatus } from "@/types/patient";
import {
  Calendar,
  MessageCircle,
  Phone,
  Download,
  X,
  ChevronRight,
  AlertTriangle,
  Activity,
  Mail,
  FileText,
  PlusCircle,
  Printer,
  ChevronDown,
  Heart,
  Clock,
  TrendingUp,
  Shield,
  Stethoscope,
  Pill,
  TestTube,
  Users,
  MapPin,
  Edit3,
  Share2,
  Bookmark,
  Bell,
} from "lucide-react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import QRCode from "react-qr-code";
import { formatDate } from "@/lib/utils";

interface PatientDetailModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onScheduleAppointment: () => void;
  onSendMessage: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onScheduleAppointment,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(
    null
  );
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50";
      case "needs-attention":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100/50";
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 shadow-slate-100/50";
    }
  };

  const getStatusIcon = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return (
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200" />
        );
      case "needs-attention":
        return (
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-200" />
        );
      case "critical":
        return (
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-200" />
        );
      default:
        return <div className="w-3 h-3 bg-slate-400 rounded-full shadow-sm" />;
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

  const toggleAppointmentDetails = (id: string) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const hasUpcomingAppointments =
    patient.upcomingAppointments && patient.upcomingAppointments.length > 0;
  const nextAppointment = hasUpcomingAppointments
    ? patient.upcomingAppointments![0]
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] flex flex-col p-0 bg-gradient-to-br from-slate-50/90 to-white border-slate-200/60 shadow-2xl">
        {/* Enhanced Header - Medical Focus */}
        <DialogHeader className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006D77] to-[#249EA0] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-1 shadow-sm">
                  {getStatusIcon(patient.status)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {patient.name}
                  </DialogTitle>
                  <Badge
                    className={`${getStatusColor(
                      patient.status
                    )} px-3 py-1.5 text-sm font-medium shadow-sm`}
                  >
                    {getStatusLabel(patient.status)}
                  </Badge>
                  <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    ID: {patient.id}
                  </div>
                </div>

                {/* Medical Priority Information */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 bg-[#006D77]/10 text-[#006D77] px-3 py-1 rounded-lg font-medium">
                    <Activity className="h-3.5 w-3.5" />
                    <span>{patient.condition}</span>
                  </div>
                  {nextAppointment && (
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Next: {formatDate(nextAppointment.date)}</span>
                    </div>
                  )}
                  <div className="text-slate-500 text-xs">
                    {patient.age}y • {patient.gender.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`h-10 w-10 p-0 ${
                  isBookmarked
                    ? "text-yellow-500 bg-yellow-50"
                    : "text-slate-400 hover:text-yellow-500"
                } transition-colors`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white shadow-sm"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white shadow-sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Content Area */}
                <div className="xl:col-span-3">
                  {/* Enhanced Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-4 mb-6 bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl shadow-sm h-12 sticky top-0 z-10">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#006D77] data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                      >
                        <Stethoscope className="h-4 w-4" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="health"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#006D77] data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Health
                      </TabsTrigger>
                      <TabsTrigger
                        value="appointments"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#006D77] data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Appointments
                      </TabsTrigger>
                      <TabsTrigger
                        value="tests"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#006D77] data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                      >
                        <TestTube className="h-4 w-4" />
                        Lab Results
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab Content with medical focus */}
                    <div className="min-h-0">
                      {/* Overview Tab - Medical Priority */}
                      <TabsContent value="overview" className="mt-0 space-y-6">
                        {/* Medical Summary Cards - Highlighted */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          {/* Primary Condition - Most Important */}
                          <Card className="bg-gradient-to-r from-[#006D77]/5 to-[#006D77]/10 border-[#006D77]/20 shadow-lg">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-[#006D77]">
                                <Activity className="h-5 w-5" />
                                <span>Primary Condition</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <div className="text-2xl font-bold text-slate-900 mb-1">
                                    {patient.condition}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    Last Visit: {formatDate(patient.lastVisit)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-slate-500 mb-1">
                                    Status
                                  </div>
                                  <Badge
                                    className={`${getStatusColor(
                                      patient.status
                                    )} text-sm font-medium px-3 py-1.5`}
                                  >
                                    {getStatusLabel(patient.status)}
                                  </Badge>
                                </div>
                              </div>

                              {/* Current Medications Summary */}
                              {patient.medications &&
                                patient.medications.length > 0 && (
                                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-[#006D77]/10">
                                    <div className="text-sm font-medium text-[#006D77] mb-2 flex items-center gap-1">
                                      <Pill className="h-4 w-4" />
                                      Current Medications (
                                      {patient.medications.length})
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {patient.medications
                                        .slice(0, 3)
                                        .map((medication, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-white/80 border-slate-200 text-slate-700 text-xs"
                                          >
                                            {medication.name}
                                          </Badge>
                                        ))}
                                      {patient.medications.length > 3 && (
                                        <Badge
                                          variant="outline"
                                          className="bg-slate-50 border-slate-200 text-slate-500 text-xs"
                                        >
                                          +{patient.medications.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                          </Card>

                          {/* Critical Alerts & Allergies */}
                          <Card className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-200/60 shadow-lg">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-amber-700">
                                <Shield className="h-5 w-5" />
                                <span>Allergies & Alerts</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {patient.allergies &&
                              patient.allergies.length > 0 ? (
                                <div>
                                  <div className="text-sm font-medium text-amber-700 mb-2">
                                    Known Allergies
                                  </div>
                                  <div className="space-y-2">
                                    {patient.allergies.map((allergy, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center p-2 bg-white/80 rounded-lg border border-amber-200/50"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                        <span className="font-medium text-slate-900 text-sm">
                                          {allergy}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-emerald-600 text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                                  ✓ No known allergies
                                </div>
                              )}

                              {/* Condition-specific alerts */}
                              {patient.condition === "Diabetes Type II" && (
                                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/50">
                                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="font-medium text-sm">
                                      Monitor Blood Sugar
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    Regular monitoring required
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Compact Contact Information - Minimized */}
                        <Card className="bg-slate-50/50 border-slate-200/40">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Contact Information</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Phone className="h-3 w-3" />
                                <span className="truncate">
                                  {patient.contactInfo.phone}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">
                                  {patient.contactInfo.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <span>{patient.age} years old</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="capitalize">
                                  {patient.gender}
                                </span>
                              </div>
                            </div>
                            {patient.contactInfo.address && (
                              <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">
                                  {patient.contactInfo.address}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Enhanced Medical Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Current Medications - Expanded */}
                          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-5 w-5 text-[#006D77]" />
                                  <span>Active Medications</span>
                                  {patient.medications && (
                                    <Badge className="bg-[#006D77]/10 text-[#006D77] text-xs">
                                      {patient.medications.length}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#006D77] hover:bg-[#006D77]/10 h-8"
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {patient.medications &&
                                patient.medications
                                  .slice(0, 4)
                                  .map((medication, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-sm transition-all duration-200"
                                    >
                                      <div className="flex-1">
                                        <div className="font-semibold text-slate-900 mb-1">
                                          {medication.name}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                          <span className="font-medium text-[#006D77]">
                                            {medication.dosage}
                                          </span>{" "}
                                          • {medication.frequency}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                          Started:{" "}
                                          {formatDate(medication.startDate)}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-[#006D77]"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                              {patient.medications &&
                                patient.medications.length > 4 && (
                                  <Button
                                    variant="ghost"
                                    className="w-full text-[#006D77] hover:bg-[#006D77]/10 text-sm"
                                  >
                                    View all {patient.medications.length}{" "}
                                    medications
                                  </Button>
                                )}
                            </CardContent>
                          </Card>

                          {/* Recent Lab Results Summary */}
                          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <TestTube className="h-5 w-5 text-[#006D77]" />
                                  <span>Recent Lab Results</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#006D77] hover:bg-[#006D77]/10 h-8"
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {patient.testResults &&
                                patient.testResults
                                  .slice(0, 4)
                                  .map((test, index) => {
                                    let isNormal = true;
                                    let alertLevel = "normal";

                                    if (test.name === "Blood Sugar") {
                                      isNormal =
                                        test.value >= 70 && test.value <= 120;
                                      alertLevel = !isNormal
                                        ? "warning"
                                        : "normal";
                                    } else if (test.name === "HbA1c") {
                                      isNormal = test.value < 6.5;
                                      alertLevel = !isNormal
                                        ? "critical"
                                        : "normal";
                                    } else if (test.name === "Cholesterol") {
                                      isNormal = test.value < 200;
                                      alertLevel = !isNormal
                                        ? "warning"
                                        : "normal";
                                    }

                                    return (
                                      <div
                                        key={index}
                                        className={`p-3 rounded-xl border transition-all duration-200 ${
                                          alertLevel === "critical"
                                            ? "bg-red-50 border-red-200"
                                            : alertLevel === "warning"
                                            ? "bg-amber-50 border-amber-200"
                                            : "bg-gradient-to-r from-slate-50 to-white border-slate-100"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="font-semibold text-slate-900">
                                            {test.name}
                                          </div>
                                          <Badge
                                            className={
                                              alertLevel === "critical"
                                                ? "bg-red-100 text-red-700 border-red-200"
                                                : alertLevel === "warning"
                                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            }
                                          >
                                            {isNormal ? "Normal" : "Attention"}
                                          </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                          <span
                                            className={`font-medium ${
                                              !isNormal
                                                ? "text-amber-700"
                                                : "text-slate-900"
                                            }`}
                                          >
                                            {test.value} {test.unit}
                                          </span>
                                          <span className="text-xs text-slate-500">
                                            {formatDate(test.date)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                              {patient.testResults &&
                                patient.testResults.length > 4 && (
                                  <Button
                                    variant="ghost"
                                    className="w-full text-[#006D77] hover:bg-[#006D77]/10 text-sm"
                                  >
                                    View all lab results
                                  </Button>
                                )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Health Tab */}
                      <TabsContent value="health" className="mt-0 space-y-6">
                        {/* Health Metrics Chart */}
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[#006D77]" />
                                <span>Health Metrics Trends</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 bg-white"
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" />
                                  Add Data
                                </Button>
                                <Select defaultValue="3m">
                                  <SelectTrigger className="w-32 h-9 bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="1m">1 Month</SelectItem>
                                    <SelectItem value="3m">3 Months</SelectItem>
                                    <SelectItem value="6m">6 Months</SelectItem>
                                    <SelectItem value="1y">1 Year</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {patient.healthMetrics &&
                              patient.healthMetrics.length > 0 && (
                                <div className="h-80">
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <LineChart
                                      data={patient.healthMetrics[0].data.map(
                                        (item, index) => {
                                          const dataPoint: any = {
                                            date: item.date,
                                          };
                                          patient.healthMetrics!.forEach(
                                            (metric) => {
                                              if (metric.data[index]) {
                                                dataPoint[metric.name] =
                                                  metric.data[index].value;
                                              }
                                            }
                                          );
                                          return dataPoint;
                                        }
                                      )}
                                    >
                                      <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f1f5f9"
                                      />
                                      <XAxis
                                        dataKey="date"
                                        stroke="#64748b"
                                        fontSize={12}
                                      />
                                      <YAxis stroke="#64748b" fontSize={12} />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: "white",
                                          borderRadius: "12px",
                                          border: "1px solid #e2e8f0",
                                          boxShadow:
                                            "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                        }}
                                      />
                                      <Legend />
                                      {patient.healthMetrics.map(
                                        (metric, index) => (
                                          <Line
                                            key={index}
                                            type="monotone"
                                            dataKey={metric.name}
                                            stroke={
                                              index === 0
                                                ? "#006D77"
                                                : index === 1
                                                ? "#FF9500"
                                                : "#2D6A4F"
                                            }
                                            strokeWidth={3}
                                            dot={{
                                              r: 6,
                                              strokeWidth: 2,
                                              fill: "white",
                                            }}
                                            activeDot={{ r: 8, strokeWidth: 2 }}
                                          />
                                        )
                                      )}
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              )}
                          </CardContent>
                        </Card>

                        {/* Current Medications - Expanded View */}
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Pill className="h-5 w-5 text-[#006D77]" />
                                <span>All Medications</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 bg-white text-[#006D77]"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" />
                                Add Medication
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {patient.medications &&
                                patient.medications.map((medication, index) => (
                                  <div
                                    key={index}
                                    className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <div className="font-semibold text-slate-900 mb-1">
                                          {medication.name}
                                        </div>
                                        <div className="text-sm text-slate-600 mb-2">
                                          <span className="font-medium">
                                            {medication.dosage}
                                          </span>{" "}
                                          • {medication.frequency}
                                        </div>
                                        <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md inline-block">
                                          Started:{" "}
                                          {formatDate(medication.startDate)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-[#006D77] hover:bg-[#006D77]/10"
                                      >
                                        <Edit3 className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-red-500 hover:bg-red-50"
                                      >
                                        Stop
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Appointments Tab */}
                      <TabsContent
                        value="appointments"
                        className="mt-0 space-y-6"
                      >
                        {/* Upcoming Appointments */}
                        {hasUpcomingAppointments && (
                          <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-blue-200/60 shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                  <span className="text-blue-900">
                                    Upcoming Appointments
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:bg-blue-100 h-8"
                                  onClick={onScheduleAppointment}
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" />
                                  Schedule New
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {patient.upcomingAppointments!.map(
                                (appointment) => (
                                  <div
                                    key={appointment.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                          <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-slate-900">
                                            {formatDate(appointment.date)} •{" "}
                                            {appointment.time}
                                          </div>
                                          <div className="text-sm text-slate-600">
                                            {appointment.type} with{" "}
                                            {appointment.doctorName}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-white/80 h-8"
                                        >
                                          Reschedule
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500 hover:bg-red-50 h-8"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Appointment History */}
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-[#006D77]" />
                              <span>Appointment History</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {patient.appointments &&
                              patient.appointments.map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="border border-slate-200/60 rounded-xl hover:bg-slate-50/50 transition-all duration-200 overflow-hidden"
                                >
                                  <div
                                    className="p-4 cursor-pointer"
                                    onClick={() =>
                                      toggleAppointmentDetails(appointment.id)
                                    }
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                          <Calendar className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-slate-900">
                                            {formatDate(appointment.date)} •{" "}
                                            {appointment.time}
                                          </div>
                                          <div className="text-sm text-slate-600">
                                            {appointment.type} with{" "}
                                            {appointment.doctorName}
                                          </div>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`transition-transform duration-200 ${
                                          expandedAppointment === appointment.id
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {expandedAppointment === appointment.id && (
                                    <div className="border-t border-slate-200/60 p-4 bg-slate-50/30">
                                      {appointment.notes && (
                                        <div className="bg-white rounded-lg p-3 mb-4 border border-slate-200/60">
                                          <div className="text-sm font-semibold text-slate-700 mb-2">
                                            Doctor's Notes:
                                          </div>
                                          <div className="text-sm text-slate-600">
                                            {appointment.notes}
                                          </div>
                                        </div>
                                      )}

                                      {appointment.prescriptions &&
                                        appointment.prescriptions.length >
                                          0 && (
                                          <div className="mb-4">
                                            <div className="text-sm font-semibold text-slate-700 mb-2">
                                              Prescriptions:
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {appointment.prescriptions.map(
                                                (prescription, idx) => (
                                                  <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="bg-white border-[#006D77]/30 text-[#006D77]"
                                                  >
                                                    {prescription}
                                                  </Badge>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}

                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-white h-8"
                                        >
                                          <FileText className="h-4 w-4 mr-1" />
                                          View Report
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="bg-[#006D77] hover:bg-[#005963] h-8"
                                        >
                                          <PlusCircle className="h-4 w-4 mr-1" />
                                          Follow-up
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Lab Results Tab */}
                      <TabsContent value="tests" className="mt-0 space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TestTube className="h-5 w-5 text-[#006D77]" />
                                <span>Recent Lab Results</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 bg-white text-[#006D77]"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" />
                                Add Results
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left border-b border-slate-200">
                                    <th className="pb-3 pr-4 font-semibold text-slate-700">
                                      Test
                                    </th>
                                    <th className="pb-3 pr-4 font-semibold text-slate-700">
                                      Result
                                    </th>
                                    <th className="pb-3 pr-4 font-semibold text-slate-700">
                                      Normal Range
                                    </th>
                                    <th className="pb-3 pr-4 font-semibold text-slate-700">
                                      Date
                                    </th>
                                    <th className="pb-3 pr-4 font-semibold text-slate-700">
                                      Status
                                    </th>
                                    <th className="pb-3 font-semibold text-slate-700 text-right">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {patient.testResults &&
                                    patient.testResults.map((test, index) => {
                                      let isNormal = true;
                                      if (test.name === "Blood Sugar") {
                                        isNormal =
                                          test.value >= 70 && test.value <= 120;
                                      } else if (test.name === "HbA1c") {
                                        isNormal = test.value < 6.5;
                                      } else if (test.name === "Cholesterol") {
                                        isNormal = test.value < 200;
                                      } else if (
                                        test.name === "Blood Pressure"
                                      ) {
                                        const parts = (
                                          test.value as string
                                        ).split("/");
                                        isNormal =
                                          parseInt(parts[0]) < 120 &&
                                          parseInt(parts[1]) < 80;
                                      }

                                      return (
                                        <tr
                                          key={index}
                                          className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                        >
                                          <td className="py-4 pr-4 font-medium text-slate-900">
                                            {test.name}
                                          </td>
                                          <td className="py-4 pr-4">
                                            <span
                                              className={`font-semibold ${
                                                !isNormal
                                                  ? "text-amber-600"
                                                  : "text-slate-900"
                                              }`}
                                            >
                                              {test.value} {test.unit}
                                            </span>
                                          </td>
                                          <td className="py-4 pr-4 text-slate-600">
                                            {test.normal}
                                          </td>
                                          <td className="py-4 pr-4 text-slate-600">
                                            {formatDate(test.date)}
                                          </td>
                                          <td className="py-4 pr-4">
                                            <Badge
                                              className={
                                                isNormal
                                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                  : "bg-amber-50 text-amber-700 border-amber-200"
                                              }
                                            >
                                              {isNormal ? "Normal" : "Abnormal"}
                                            </Badge>
                                          </td>
                                          <td className="py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-[#006D77] hover:bg-[#006D77]/10"
                                              >
                                                <FileText className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-[#006D77] hover:bg-[#006D77]/10"
                                              >
                                                <Download className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                {/* Enhanced Sidebar - Medical Focus */}
                <div className="space-y-6">
                  {/* AI Insights Panel - Highlighted */}
                  <Card className="bg-gradient-to-br from-[#006D77]/5 to-[#249EA0]/5 border-[#006D77]/20 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-[#006D77]">
                        <Activity className="h-5 w-5" />
                        <span>Clinical Insights</span>
                        <Badge className="bg-[#006D77] text-white text-xs">
                          AI
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Condition-specific alerts */}
                      {patient.condition === "Diabetes Type II" && (
                        <div className="bg-white rounded-xl p-4 border-l-4 border-amber-400 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-amber-700 mb-1">
                                Blood Sugar Monitoring
                              </h4>
                              <p className="text-sm text-slate-600 mb-3">
                                Recent readings suggest medication review
                                needed.
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs bg-white"
                              >
                                View Trends
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Clinical Recommendations */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h4 className="font-semibold mb-3 text-[#006D77] flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Clinical Actions
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                            <span className="text-slate-700 font-medium">
                              Schedule follow-up in 2 weeks
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                            <span className="text-slate-700 font-medium">
                              Review medication adherence
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                            <span className="text-slate-700 font-medium">
                              Order HbA1c test
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* Risk Assessment - Enhanced */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h4 className="font-semibold mb-3 text-[#006D77] flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Risk Assessment
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-700 font-medium">
                                Condition Control
                              </span>
                              <span className="font-semibold text-emerald-600">
                                Good
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: "75%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-700 font-medium">
                                Medication Adherence
                              </span>
                              <span className="font-semibold text-amber-600">
                                Needs Attention
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions - Medical Priority */}
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#006D77]" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-[#006D77] to-[#249EA0] hover:from-[#005963] hover:to-[#1f8284] text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 justify-start"
                        onClick={onScheduleAppointment}
                      >
                        <Calendar className="mr-3 h-5 w-5" />
                        Schedule Follow-up
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white bg-white/80 backdrop-blur-sm h-11 transition-all duration-300"
                      >
                        <TestTube className="mr-3 h-5 w-5" />
                        Order Lab Tests
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white bg-white/80 backdrop-blur-sm h-11 transition-all duration-300"
                        onClick={onSendMessage}
                      >
                        <MessageCircle className="mr-3 h-5 w-5" />
                        Send Message
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-[#006D77] border-[#006D77]/30 hover:bg-[#006D77] hover:text-white bg-white/80 backdrop-blur-sm h-11 transition-all duration-300"
                      >
                        <FileText className="mr-3 h-5 w-5" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  {/* QR Code - Minimized */}
                  <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200/60 shadow-sm">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200/60 mb-3">
                        <QRCode
                          value={`healthcare://patient/${patient.id}`}
                          size={80}
                          level="H"
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          fgColor="#006D77"
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-slate-700 mb-1 text-sm">
                          Quick Access
                        </div>
                        <p className="text-xs text-slate-500">
                          Patient records QR
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            {/* Add bottom padding for better scrolling */}
            <div className="pb-6"></div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailModal;
