"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isPast, isToday, addMinutes } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  ArrowLeft,
  MoreVertical,
  Edit2,
  Trash2,
  ClipboardCopy,
  FileText,
  MessageSquare,
  CalendarRange,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  ChevronRight,
  Paperclip,
  Share2,
  Plus,
  Heart,
  Bell,
  BellOff,
  Printer,
  ExternalLink,
  User,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Define types
interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    photo: string;
    rating: number;
    reviewCount: number;
  };
  date: Date;
  startTime: string;
  endTime: string;
  type: "video" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  location?: string;
  notes?: string;
  reason: string;
  insuranceProvider?: string;
  copay?: number;
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadedAt: Date;
    size: string;
  }[];
  previousAppointment?: {
    id: string;
    date: Date;
    reason: string;
  };
  reminders: boolean;
}

// Mock data
const mockAppointment: Appointment = {
  id: "apt-123456",
  doctor: {
    name: "Dr. Sarah Johnson",
    specialty: "Psychiatry",
    photo: "/assets/doctors/sarah-johnson.jpg",
    rating: 4.9,
    reviewCount: 156,
  },
  date: new Date("2025-08-15T14:30:00"),
  startTime: "2:30 PM",
  endTime: "3:15 PM",
  type: "video",
  status: "scheduled",
  location: "Virtual Visit",
  notes: "Please have your medication list ready for review.",
  reason: "Initial consultation for anxiety management",
  insuranceProvider: "Blue Cross Blue Shield",
  copay: 25,
  documents: [
    {
      id: "doc-1",
      name: "Medical History Form",
      type: "PDF",
      uploadedAt: new Date("2025-08-10T09:15:00"),
      size: "1.2 MB",
    },
    {
      id: "doc-2",
      name: "Insurance Card",
      type: "JPG",
      uploadedAt: new Date("2025-08-10T09:17:00"),
      size: "430 KB",
    },
  ],
  previousAppointment: {
    id: "apt-123400",
    date: new Date("2025-05-20T10:00:00"),
    reason: "Annual physical examination",
  },
  reminders: true,
};

export default function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(
    mockAppointment.reminders
  );

  // In a real app, you would fetch the appointment data based on the ID from params
  const appointment = mockAppointment;

  // Calculate whether this is a past, current, or upcoming appointment
  const isPastAppointment =
    isPast(appointment.date) && !isToday(appointment.date);
  const isUpcomingAppointment =
    !isPast(appointment.date) || isToday(appointment.date);

  // Calculate estimated end time
  const appointmentEndTime = appointment.endTime;

  // Calculate preparation status - in a real app this would come from the backend
  const preparationSteps = [
    { id: 1, name: "Forms Completed", completed: true },
    { id: 2, name: "Insurance Verified", completed: true },
    { id: 3, name: "Copay Processed", completed: false },
  ];

  const preparationProgress = Math.round(
    (preparationSteps.filter((step) => step.completed).length /
      preparationSteps.length) *
      100
  );

  // Handle copy appointment details
  const handleCopyDetails = () => {
    const details = `Appointment with ${appointment.doctor.name}
Date: ${format(appointment.date, "EEEE, MMMM d, yyyy")}
Time: ${appointment.startTime} - ${appointment.endTime}
Type: ${
      appointment.type === "video"
        ? "Video Visit"
        : appointment.type === "in-person"
        ? "In-Person Visit"
        : "Phone Call"
    }
${appointment.location ? `Location: ${appointment.location}` : ""}
Reason: ${appointment.reason}`;

    navigator.clipboard.writeText(details).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Appointment details have been copied to your clipboard.",
      });
    });
  };

  // Handle cancellation
  const handleCancelAppointment = () => {
    setIsCancelling(true);
  };

  const confirmCancellation = () => {
    // In a real app, this would call an API
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been successfully cancelled.",
    });
    setIsCancelling(false);
    // In a real app, you might redirect or update the UI
  };

  // Handle rescheduling
  const handleReschedule = () => {
    router.push(`/patient/appointments/reschedule/${appointment.id}`);
  };

  // Handle join video call
  const handleJoinVideoCall = () => {
    setIsJoiningCall(true);
    // In a real app, this would launch the video call
    setTimeout(() => {
      window.open("https://video-call-url.example", "_blank");
      setIsJoiningCall(false);
    }, 1500);
  };

  // Toggle reminders
  const toggleReminders = () => {
    setReminderEnabled(!reminderEnabled);
    toast({
      title: reminderEnabled ? "Reminders disabled" : "Reminders enabled",
      description: reminderEnabled
        ? "You will no longer receive reminders for this appointment."
        : "You will receive reminders for this appointment.",
    });
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 sm:p-6 py-8">
      {/* Back navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/patient/appointments"
          className="inline-flex items-center text-sm text-[#006D77] hover:text-[#004A52]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Appointments
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyDetails}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleReminders}>
              {reminderEnabled ? (
                <>
                  <BellOff className="h-4 w-4 mr-2" />
                  Disable Reminders
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Reminders
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isUpcomingAppointment && (
              <>
                <DropdownMenuItem onClick={handleReschedule}>
                  <CalendarRange className="h-4 w-4 mr-2" />
                  Reschedule
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCancelAppointment}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main header card */}
      <Card className="mb-6 shadow-md border-[#E8F3F4]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="mr-4">
                {appointment.type === "video" ? (
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                ) : appointment.type === "in-person" ? (
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                ) : (
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  {appointment.type === "video"
                    ? "Video Appointment"
                    : appointment.type === "in-person"
                    ? "In-Person Appointment"
                    : "Phone Appointment"}

                  <Badge
                    className={`ml-3 ${
                      appointment.status === "scheduled"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : appointment.status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : appointment.status === "cancelled"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </h1>
                <p className="text-gray-600 mt-1">{appointment.reason}</p>
              </div>
            </div>

            {isUpcomingAppointment &&
              appointment.status === "scheduled" &&
              appointment.type === "video" && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!isToday(appointment.date) || isJoiningCall}
                  onClick={handleJoinVideoCall}
                >
                  {isJoiningCall ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Join Video Call
                    </>
                  )}
                </Button>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preparation">Preparation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Doctor info */}
            <Card className="md:col-span-1 border-[#E8F3F4]">
              <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#006D77]" />
                  Healthcare Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-[#E8F3F4] mb-4">
                    <AvatarImage src={appointment.doctor.photo} />
                    <AvatarFallback className="bg-[#006D77] text-white text-xl">
                      {appointment.doctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.doctor.name}
                  </h3>
                  <p className="text-[#006D77] font-medium mb-2">
                    {appointment.doctor.specialty}
                  </p>

                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(appointment.doctor.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({appointment.doctor.reviewCount})
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right column - Appointment details */}
            <Card className="md:col-span-2 border-[#E8F3F4]">
              <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#006D77]" />
                  Appointment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#006D77]" />
                      {format(appointment.date, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[#006D77]" />
                      {appointment.startTime} - {appointmentEndTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      {appointment.type === "video" ? (
                        <>
                          <Video className="h-4 w-4 mr-2 text-blue-600" />
                          Video Visit
                        </>
                      ) : appointment.type === "in-person" ? (
                        <>
                          <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                          In-person Visit
                        </>
                      ) : (
                        <>
                          <Phone className="h-4 w-4 mr-2 text-purple-600" />
                          Phone Call
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#006D77]" />
                      {appointment.location}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">
                      Reason for Visit
                    </p>
                    <p className="text-gray-900">{appointment.reason}</p>
                  </div>

                  {appointment.notes && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">
                        Special Notes
                      </p>
                      <div className="bg-[#F0F9FA] p-3 rounded-lg border border-[#E8F3F4]">
                        <p className="text-sm text-gray-900">
                          {appointment.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Insurance</p>
                    <p className="font-medium text-gray-900">
                      {appointment.insuranceProvider || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Copay</p>
                    <p className="font-medium text-gray-900">
                      ${appointment.copay?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-5 flex justify-between">
                {isUpcomingAppointment &&
                  appointment.status === "scheduled" && (
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleReschedule}
                        className="border-[#006D77] text-[#006D77] hover:bg-[#F0F9FA]"
                      >
                        <CalendarRange className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelAppointment}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                <Button
                  variant="outline"
                  onClick={handleCopyDetails}
                  className="ml-auto"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Details
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Additional resources */}
          <Card className="border-[#E8F3F4]">
            <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#006D77]" />
                Helpful Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Before Your Appointment
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span className="text-sm">
                        Have your insurance card and ID ready
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span className="text-sm">
                        Make a list of your current medications
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span className="text-sm">
                        Write down any questions you have
                      </span>
                    </li>
                  </ul>
                </div>

                {appointment.type === "video" && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <h3 className="font-medium text-indigo-900 mb-2 flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Video Visit Tips
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
                        <span className="text-sm">
                          Find a quiet, well-lit space
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
                        <span className="text-sm">
                          Test your camera and microphone before the call
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
                        <span className="text-sm">
                          Ensure you have a stable internet connection
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Button
                          size="sm"
                          variant="link"
                          className="h-auto p-0 text-indigo-600"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Test your connection now
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}

                {appointment.type === "in-person" && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <h3 className="font-medium text-emerald-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Visit Information
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-sm">
                          Arrive 15 minutes early to check in
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-sm">
                          Parking is available in the main garage
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-sm">
                          Masks are recommended in clinical areas
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Button
                          size="sm"
                          variant="link"
                          className="h-auto p-0 text-emerald-600"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Get directions
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preparation Tab */}
        <TabsContent value="preparation">
          <Card className="border-[#E8F3F4]">
            <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-[#006D77]" />
                  Preparation Checklist
                </CardTitle>
                <div className="flex items-center">
                  <p className="text-sm font-medium mr-2">
                    {preparationProgress}% Complete
                  </p>
                  <Progress value={preparationProgress} className="w-24 h-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {preparationSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border ${
                      step.completed
                        ? "bg-green-50 border-green-100"
                        : "bg-amber-50 border-amber-100"
                    }`}
                  >
                    <div className="flex items-center">
                      {step.completed ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            step.completed ? "text-green-900" : "text-amber-900"
                          }`}
                        >
                          {step.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            step.completed ? "text-green-700" : "text-amber-700"
                          }`}
                        >
                          {step.completed
                            ? "Completed"
                            : step.id === 3
                            ? "Pending - will be processed during check-in"
                            : "Action required"}
                        </p>
                      </div>
                      {!step.completed && step.id !== 3 && (
                        <Button
                          size="sm"
                          className={
                            step.id === 1
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-[#006D77] hover:bg-[#005A64]"
                          }
                        >
                          {step.id === 1 ? "Complete Forms" : "Verify Now"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-[#F0F9FA] rounded-lg border border-[#E8F3F4]">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Additional Preparation
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#006D77] mr-2 mt-0.5" />
                      <span className="text-sm">
                        Have your medication list ready
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#006D77] mr-2 mt-0.5" />
                      <span className="text-sm">
                        Write down any questions for your doctor
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#006D77] mr-2 mt-0.5" />
                      <span className="text-sm">
                        Fast for 8 hours before the appointment (if applicable)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="border-[#E8F3F4]">
            <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#006D77]" />
                  Documents
                </CardTitle>
                <Button size="sm" className="bg-[#006D77] hover:bg-[#005A64]">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {appointment.documents && appointment.documents.length > 0 ? (
                <div className="space-y-3">
                  {appointment.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-[#006D77] transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md mr-3">
                          <FileText
                            className={`h-5 w-5 ${
                              doc.type === "PDF"
                                ? "text-red-500"
                                : doc.type === "JPG" || doc.type === "PNG"
                                ? "text-blue-500"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{doc.type}</span>
                            <span className="mx-2">•</span>
                            <span>{doc.size}</span>
                            <span className="mx-2">•</span>
                            <span>{format(doc.uploadedAt, "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download Document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share Document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Required Documents
                    </h3>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Medical History Form Needed
                          </p>
                          <p className="text-xs text-amber-700 mb-2">
                            Please complete and upload your medical history form
                            before your appointment.
                          </p>
                          <Button
                            size="sm"
                            className="h-8 bg-amber-600 hover:bg-amber-700"
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Download Form
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Documents Yet
                  </h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    Upload relevant medical records, insurance information, or
                    referrals for your appointment.
                  </p>
                  <Button className="bg-[#006D77] hover:bg-[#005A64]">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancellation Dialog */}
      <Dialog open={isCancelling} onOpenChange={setIsCancelling}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your appointment with{" "}
              {appointment.doctor.name} on {format(appointment.date, "MMMM d")}{" "}
              at {appointment.startTime}?
            </p>

            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Cancellations less than 24 hours before the appointment may
                  incur a fee.
                </p>
              </div>

              <div>
                <Label htmlFor="cancelReason" className="text-sm font-medium">
                  Reason for Cancellation (Optional)
                </Label>
                <Textarea
                  id="cancelReason"
                  placeholder="Please provide a reason for cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsCancelling(false)}>
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
