import React, { useState } from "react";
import Link from "next/link";
import {
  Pill,
  Clock,
  Filter,
  ChevronDown,
  ChevronLeft,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const FamilyMedicationDashboard = () => {
  const router = useRouter();
  const [familyMember, setFamilyMember] = useState("all");
  const [timeframe, setTimeframe] = useState("today");
  const [showAllTimes, setShowAllTimes] = useState(false);

  // Mock family members
  const familyMembers = [
    { id: "self", name: "Diana Cooper", avatar: "/avatars/diana.png" },
    { id: "john", name: "John Cooper", avatar: "/avatars/john.png" },
    { id: "emma", name: "Emma Cooper", avatar: "/avatars/emma.png" },
    { id: "rose", name: "Rose Wilson", avatar: "/avatars/rose.png" },
  ];

  // Mock medication schedule data with family member assignments
  const medicationSchedule = [
    {
      time: "7:00 AM",
      medications: [
        {
          id: 1,
          name: "Metformin",
          dosage: "500mg",
          memberId: "self",
          memberName: "Diana Cooper",
          avatar: "/avatars/diana.png",
          status: "taken",
          takenAt: "7:10 AM",
        },
        {
          id: 2,
          name: "Lisinopril",
          dosage: "10mg",
          memberId: "john",
          memberName: "John Cooper",
          avatar: "/avatars/john.png",
          status: "missed",
        },
        {
          id: 3,
          name: "Albuterol",
          dosage: "2 puffs",
          memberId: "emma",
          memberName: "Emma Cooper",
          avatar: "/avatars/emma.png",
          status: "taken",
          takenAt: "7:05 AM",
        },
      ],
    },
    {
      time: "12:00 PM",
      medications: [
        {
          id: 4,
          name: "Insulin",
          dosage: "10 units",
          memberId: "self",
          memberName: "Diana Cooper",
          avatar: "/avatars/diana.png",
          status: "upcoming",
        },
        {
          id: 5,
          name: "Vitamin D",
          dosage: "1000 IU",
          memberId: "rose",
          memberName: "Rose Wilson",
          avatar: "/avatars/rose.png",
          status: "upcoming",
        },
      ],
    },
    {
      time: "6:00 PM",
      medications: [
        {
          id: 6,
          name: "Metformin",
          dosage: "500mg",
          memberId: "self",
          memberName: "Diana Cooper",
          avatar: "/avatars/diana.png",
          status: "upcoming",
        },
        {
          id: 7,
          name: "Atorvastatin",
          dosage: "20mg",
          memberId: "john",
          memberName: "John Cooper",
          avatar: "/avatars/john.png",
          status: "upcoming",
        },
        {
          id: 8,
          name: "Albuterol",
          dosage: "2 puffs (as needed)",
          memberId: "emma",
          memberName: "Emma Cooper",
          avatar: "/avatars/emma.png",
          status: "upcoming",
        },
      ],
    },
    {
      time: "9:00 PM",
      medications: [
        {
          id: 9,
          name: "Aspirin",
          dosage: "81mg",
          memberId: "john",
          memberName: "John Cooper",
          avatar: "/avatars/john.png",
          status: "upcoming",
        },
        {
          id: 10,
          name: "Metoprolol",
          dosage: "50mg",
          memberId: "rose",
          memberName: "Rose Wilson",
          avatar: "/avatars/rose.png",
          status: "upcoming",
        },
        {
          id: 11,
          name: "Amlodipine",
          dosage: "5mg",
          memberId: "rose",
          memberName: "Rose Wilson",
          avatar: "/avatars/rose.png",
          status: "upcoming",
        },
      ],
    },
  ];

  // Filter medication schedule based on selected family member and timeframe
  const filteredSchedule = medicationSchedule
    .map((timeSlot) => {
      // Filter medications in each time slot
      const filteredMeds = timeSlot.medications.filter(
        (med) => familyMember === "all" || med.memberId === familyMember
      );

      return {
        ...timeSlot,
        medications: filteredMeds,
      };
    })
    // Filter out time slots with no medications after filtering
    .filter((timeSlot) => timeSlot.medications.length > 0);

  // Only show future time slots if not showing all
  const visibleSchedule = showAllTimes
    ? filteredSchedule
    : filteredSchedule.filter((timeSlot) => {
        // Simple check if the time is in the future (can be improved with actual time comparison)
        const currentHour = new Date().getHours();
        const timeSlotHour = parseInt(timeSlot.time.split(":")[0]);
        return timeSlotHour >= currentHour;
      });

  // Status badge styling - simplified to neutral tones
  const getStatusBadge = (status: string, takenAt?: string) => {
    switch (status) {
      case "taken":
        return (
          <Badge className="bg-gray-600 text-white border-gray-600">
            <Check size={12} className="mr-1" />
            Taken {takenAt && `at ${takenAt}`}
          </Badge>
        );
      case "missed":
        return (
          <Badge className="bg-gray-400 text-white border-gray-400">
            <X size={12} className="mr-1" />
            Missed
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-gray-50 text-gray-600 border-gray-300">
            <Clock size={12} className="mr-1" />
            Upcoming
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 text-gray-500"
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Family Medication Schedule
        </h1>
      </div>

      <Card className="border-gray-200 shadow-sm mb-6">
        <CardHeader className="pb-2 bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Pill className="mr-2 h-5 w-5 text-gray-700" />
              <span className="text-gray-800">Unified Medication Schedule</span>
            </div>
            <Link href="/patient/medications">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Manage Medications
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <Select value={familyMember} onValueChange={setFamilyMember}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Select family member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Family Members</SelectItem>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-9 border-gray-300 text-gray-600 hover:bg-gray-50"
                onClick={() => setShowAllTimes(!showAllTimes)}
              >
                {showAllTimes ? "Hide Past Times" : "Show All Times"}
              </Button>
            </div>

            <Button className="bg-gray-700 hover:bg-gray-800">
              <Filter size={16} className="mr-2" />
              Customize View
            </Button>
          </div>

          {/* Alert for critical medications - simplified */}
          <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg mb-4">
            <h3 className="font-medium flex items-center text-gray-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              Missed Medications Alert
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              John Cooper missed his morning Lisinopril (10mg). This medication
              is important for blood pressure control.
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="h-7 bg-gray-600 hover:bg-gray-700">
                Send Reminder
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                Reschedule
              </Button>
            </div>
          </div>

          {/* Medication schedule by time */}
          <div className="space-y-6">
            {visibleSchedule.length > 0 ? (
              visibleSchedule.map((timeSlot, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium flex items-center text-gray-700 mb-3">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    {timeSlot.time}
                  </h3>

                  <div className="space-y-3">
                    {timeSlot.medications.map((medication) => (
                      <div
                        key={medication.id}
                        className="flex items-start pl-1"
                      >
                        <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
                          <AvatarImage
                            src={medication.avatar}
                            alt={medication.memberName}
                          />
                          <AvatarFallback>
                            {medication.memberName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">
                              {medication.name} {medication.dosage}
                            </p>
                            <p className="text-sm text-gray-600">
                              {medication.memberName}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(
                              medication.status,
                              medication.takenAt
                            )}

                            {medication.status === "upcoming" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark Taken
                              </Button>
                            )}

                            {medication.status === "missed" && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-gray-600 hover:bg-gray-700"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                Reschedule
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No medications scheduled for the selected time period.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyMedicationDashboard;
