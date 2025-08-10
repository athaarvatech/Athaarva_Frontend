"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pill,
  Clock,
  Calendar,
  Bell,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Mic,
  Heart,
  TrendingUp,
  Shield,
  Sun,
  Moon,
  Volume2,
  Camera,
  Phone,
  Star,
  Zap,
  RefreshCw,
  Eye,
  ChevronRight,
  Filter,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for medications
const mockMedications = [
  {
    id: 1,
    name: "Metformin",
    dosage: "500mg",
    frequency: "2x Daily",
    timeSlots: ["☀️ Morning", "🌙 Evening"],
    pillImage: "💊",
    condition: "Diabetes",
    startDate: "2024-01-15",
    endDate: "Ongoing",
    pillsLeft: 25,
    totalPills: 60,
    adherence: 92,
    status: "active",
    nextDose: "6:00 PM",
    doctorNotes: "Take with food to avoid stomach upset",
    refillDue: "2025-08-15",
    taken: {
      today: true,
      yesterday: true,
      streak: 15,
    },
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "1x Daily",
    timeSlots: ["☀️ Morning"],
    pillImage: "💊",
    condition: "Blood Pressure",
    startDate: "2024-02-01",
    endDate: "Ongoing",
    pillsLeft: 8,
    totalPills: 30,
    adherence: 88,
    status: "refill_needed",
    nextDose: "8:00 AM",
    doctorNotes: "Monitor blood pressure weekly",
    refillDue: "2025-08-08",
    taken: {
      today: false,
      yesterday: true,
      streak: 12,
    },
  },
  {
    id: 3,
    name: "Vitamin D",
    dosage: "1000 IU",
    frequency: "1x Daily",
    timeSlots: ["☀️ Morning"],
    pillImage: "🟡",
    condition: "Vitamin Deficiency",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
    pillsLeft: 45,
    totalPills: 60,
    adherence: 75,
    status: "active",
    nextDose: "8:00 AM",
    doctorNotes: "Take with breakfast for better absorption",
    refillDue: "2025-09-01",
    taken: {
      today: true,
      yesterday: false,
      streak: 8,
    },
  },
];

// Weekly adherence data for charts
const weeklyAdherence = [
  { day: "Mon", adherence: 100 },
  { day: "Tue", adherence: 100 },
  { day: "Wed", adherence: 85 },
  { day: "Thu", adherence: 100 },
  { day: "Fri", adherence: 90 },
  { day: "Sat", adherence: 100 },
  { day: "Sun", adherence: 95 },
];

const MedicationDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("current");
  const [medications, setMedications] = useState(mockMedications);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Filter medications based on search and filter
  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.condition.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "refill_needed")
      return matchesSearch && med.status === "refill_needed";
    if (filter === "today") return matchesSearch && med.nextDose;

    return matchesSearch;
  });

  // Calculate overall adherence
  const overallAdherence = Math.round(
    medications.reduce((sum, med) => sum + med.adherence, 0) /
      medications.length
  );

  // Get urgent actions
  const urgentMedications = medications.filter(
    (med) => med.status === "refill_needed" || med.pillsLeft <= 7
  );

  const markAsTaken = (medicationId: number) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medicationId
          ? {
              ...med,
              taken: {
                ...med.taken,
                today: true,
                streak: med.taken.streak + 1,
              },
            }
          : med
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#007C7C] to-[#20B2AA] flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#007C7C]">My Medicines</h1>
          </div>
          <p className="text-lg text-gray-600">
            Keep track of your health, one pill at a time 💊
          </p>
        </div>

        {/* Urgent Actions Banner */}
        {urgentMedications.length > 0 && (
          <Card className="border-l-4 border-l-amber-500 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">
                    ⚠️ {urgentMedications.length} medicine
                    {urgentMedications.length > 1 ? "s" : ""} need
                    {urgentMedications.length === 1 ? "s" : ""} attention
                  </h3>
                  <p className="text-amber-700">
                    {urgentMedications.map((med) => med.name).join(", ")} -
                    Refill needed soon
                  </p>
                </div>
                <Button className="ml-auto bg-amber-600 hover:bg-amber-700">
                  Order Refill
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-[#007C7C] to-[#20B2AA] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">This Week</p>
                  <p className="text-2xl font-bold">{overallAdherence}% 👏</p>
                  <p className="text-sm text-white/80">Medicine Adherence</p>
                </div>
                <TrendingUp className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#50C878] to-[#008080]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Streak</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...medications.map((m) => m.taken.streak))} Days
                    🔥
                  </p>
                  <p className="text-sm text-white/80">Keep it up!</p>
                </div>
                <Star className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Total</p>
                  <p className="text-2xl font-bold">{medications.length} 💊</p>
                  <p className="text-sm text-white/80">Active Medicines</p>
                </div>
                <Pill className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="🔍 Search medicines or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg border-2 border-[#E8F3F4] focus:border-[#007C7C]"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  <Mic
                    className={`h-4 w-4 ${
                      voiceEnabled ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-[#007C7C]" : ""}
                >
                  All
                </Button>
                <Button
                  variant={filter === "today" ? "default" : "outline"}
                  onClick={() => setFilter("today")}
                  className={filter === "today" ? "bg-[#007C7C]" : ""}
                >
                  Today
                </Button>
                <Button
                  variant={filter === "refill_needed" ? "default" : "outline"}
                  onClick={() => setFilter("refill_needed")}
                  className={filter === "refill_needed" ? "bg-[#007C7C]" : ""}
                >
                  Need Refill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Current
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </TabsTrigger>
          </TabsList>

          {/* Current Medications Tab */}
          <TabsContent value="current" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMedications.map((medication) => (
                <Card
                  key={medication.id}
                  className="hover:shadow-lg transition-all duration-300 border-2 hover:border-[#007C7C]"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{medication.pillImage}</div>
                        <div>
                          <CardTitle className="text-lg text-[#007C7C]">
                            {medication.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {medication.condition}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          medication.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {medication.status === "active"
                          ? "✅ Active"
                          : "⚠️ Refill Soon"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Dosage Info */}
                    <div className="bg-[#F0F9FA] p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[#007C7C]">
                          💊 {medication.dosage}
                        </span>
                        <span className="text-sm text-gray-600">
                          {medication.frequency}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {medication.timeSlots.map((slot, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pills Left */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pills Left</span>
                        <span className="font-semibold">
                          {medication.pillsLeft}/{medication.totalPills}
                        </span>
                      </div>
                      <Progress
                        value={
                          (medication.pillsLeft / medication.totalPills) * 100
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">
                        Refill by{" "}
                        {new Date(medication.refillDue).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Adherence */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Adherence</span>
                        <span className="font-semibold">
                          {medication.adherence}%
                        </span>
                      </div>
                      <Progress value={medication.adherence} className="h-2" />
                    </div>

                    {/* Next Dose */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          Next Dose
                        </span>
                      </div>
                      <p className="text-blue-700">{medication.nextDose}</p>
                    </div>

                    {/* Doctor Notes */}
                    {medication.doctorNotes && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Doctor's Note
                          </span>
                        </div>
                        <p className="text-sm text-purple-700">
                          {medication.doctorNotes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-[#007C7C] hover:bg-[#006666]"
                        onClick={() => markAsTaken(medication.id)}
                        disabled={medication.taken.today}
                      >
                        {medication.taken.today ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Taken ✅
                          </>
                        ) : (
                          <>
                            <Pill className="h-4 w-4 mr-2" />
                            Mark as Taken
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 text-sm">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Camera className="h-3 w-3 mr-1" />
                        Scan Pill
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Phone className="h-3 w-3 mr-1" />
                        Call Pharmacy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Medicine */}
            <Card className="border-2 border-dashed border-[#007C7C] hover:bg-[#F0F9FA] transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <Plus className="h-12 w-12 text-[#007C7C] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#007C7C] mb-2">
                  Add New Medicine
                </h3>
                <p className="text-gray-600">
                  Click to add a new medication to your list
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#007C7C]" />
                  Medication History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="border-l-4 border-l-[#007C7C] pl-4 py-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {med.name} {med.dosage}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(med.startDate).toLocaleDateString()} -{" "}
                            {med.endDate}
                          </p>
                          <p className="text-sm text-gray-500">
                            For {med.condition}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {med.adherence}% adherence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#007C7C]" />
                    Weekly Adherence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyAdherence}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Line
                        type="monotone"
                        dataKey="adherence"
                        stroke="#007C7C"
                        strokeWidth={3}
                        dot={{ fill: "#007C7C", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#007C7C]" />
                    Health Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="font-semibold text-green-600">
                      Excellent Progress!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your medication adherence is helping improve your health
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Blood Sugar Control</span>
                      <span className="text-sm font-semibold text-green-600">
                        Improving
                      </span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Blood Pressure</span>
                      <span className="text-sm font-semibold text-green-600">
                        Stable
                      </span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#007C7C]" />
                  Smart Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-3 bg-[#F0F9FA] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{med.pillImage}</div>
                      <div>
                        <h4 className="font-semibold">{med.name}</h4>
                        <p className="text-sm text-gray-600">
                          Next: {med.nextDose}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Footer */}
        <Card className="bg-gradient-to-r from-[#007C7C] to-[#20B2AA] text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Need Help? 🤝</h3>
                <p className="text-white/80">Our team is here to support you</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="secondary" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicationDashboard;
