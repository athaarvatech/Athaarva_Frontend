"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Clock,
  GraduationCap,
  Award,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HospitalHeader from "../components/HospitalHeader";
import HospitalFooter from "../components/HospitalFooter";
import { HospitalService, HospitalProfile } from "@/lib/hospital-service";
import { Skeleton } from "@/components/ui/skeleton";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  avatar_url?: string;
  bio?: string;
  languages?: string[];
  available_today: boolean;
  rating?: number;
  total_reviews?: number;
}

const specializations = [
  "All Specializations",
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
];

export default function DoctorsPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const basePath = `/hospital/${subdomain}`;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    "All Specializations"
  );

  const theme = {
    primaryColor: hospital?.primary_color || "#007C7C",
    secondaryColor: hospital?.secondary_color || "#20B2AA",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch hospital
        const hospitalData = await HospitalService.getHospitalBySubdomain(
          subdomain
        );
        setHospital(hospitalData);

        // Fetch doctors (mock for now, will connect to API)
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(
          `${API_BASE_URL}/api/v1/hospitals/${subdomain}/doctors`
        );

        if (response.ok) {
          const data = await response.json();
          setDoctors(data.data || data || []);
        } else {
          // Use mock data if API not available
          setDoctors(getMockDoctors());
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors(getMockDoctors());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subdomain]);

  // Mock data for development
  function getMockDoctors(): Doctor[] {
    return [
      {
        id: "1",
        full_name: "Dr. Priya Sharma",
        specialization: "Cardiology",
        qualification: "MBBS, MD (Cardiology), DM",
        experience_years: 15,
        consultation_fee: 800,
        bio: "Senior cardiologist with expertise in interventional cardiology and heart failure management.",
        languages: ["English", "Hindi"],
        available_today: true,
        rating: 4.8,
        total_reviews: 234,
      },
      {
        id: "2",
        full_name: "Dr. Rajesh Kumar",
        specialization: "Orthopedics",
        qualification: "MBBS, MS (Ortho), DNB",
        experience_years: 12,
        consultation_fee: 700,
        bio: "Specialist in joint replacement surgery and sports medicine.",
        languages: ["English", "Hindi", "Tamil"],
        available_today: true,
        rating: 4.6,
        total_reviews: 189,
      },
      {
        id: "3",
        full_name: "Dr. Anjali Patel",
        specialization: "Pediatrics",
        qualification: "MBBS, MD (Pediatrics)",
        experience_years: 10,
        consultation_fee: 600,
        bio: "Child health specialist with focus on developmental pediatrics and neonatology.",
        languages: ["English", "Hindi", "Gujarati"],
        available_today: false,
        rating: 4.9,
        total_reviews: 312,
      },
      {
        id: "4",
        full_name: "Dr. Suresh Menon",
        specialization: "General Medicine",
        qualification: "MBBS, MD (General Medicine)",
        experience_years: 20,
        consultation_fee: 500,
        bio: "Experienced physician specializing in internal medicine and chronic disease management.",
        languages: ["English", "Hindi", "Malayalam"],
        available_today: true,
        rating: 4.7,
        total_reviews: 456,
      },
      {
        id: "5",
        full_name: "Dr. Meera Reddy",
        specialization: "Dermatology",
        qualification: "MBBS, MD (Dermatology)",
        experience_years: 8,
        consultation_fee: 650,
        bio: "Skin specialist with expertise in cosmetic dermatology and laser treatments.",
        languages: ["English", "Hindi", "Telugu"],
        available_today: true,
        rating: 4.5,
        total_reviews: 178,
      },
      {
        id: "6",
        full_name: "Dr. Amit Singh",
        specialization: "Neurology",
        qualification: "MBBS, MD, DM (Neurology)",
        experience_years: 14,
        consultation_fee: 900,
        bio: "Neurologist specializing in stroke management and epilepsy treatment.",
        languages: ["English", "Hindi"],
        available_today: false,
        rating: 4.8,
        total_reviews: 267,
      },
    ];
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "All Specializations" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  if (loading || !hospital) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HospitalHeader hospital={hospital} />

      {/* Hero Section */}
      <section
        className="relative py-16 text-white"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Our Medical Experts</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Meet our team of experienced doctors dedicated to providing you
              with the best healthcare services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search doctors by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger className="w-full sm:w-64">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-4 mb-4">
                        {doctor.avatar_url ? (
                          <Image
                            src={doctor.avatar_url}
                            alt={doctor.full_name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                            style={{ backgroundColor: theme.primaryColor }}
                          >
                            {doctor.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {doctor.full_name}
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: theme.primaryColor }}
                          >
                            {doctor.specialization}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {doctor.rating && (
                              <>
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {doctor.rating}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({doctor.total_reviews} reviews)
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span>{doctor.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>
                            {doctor.experience_years}+ years experience
                          </span>
                        </div>
                        {doctor.languages && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doctor.languages.map((lang) => (
                              <Badge
                                key={lang}
                                variant="secondary"
                                className="text-xs"
                              >
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-xs text-gray-500">
                            Consultation Fee
                          </p>
                          <p
                            className="font-semibold"
                            style={{ color: theme.primaryColor }}
                          >
                            ₹{doctor.consultation_fee}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`${basePath}/doctors/${doctor.id}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                          <Link href={`${basePath}/book?doctor=${doctor.id}`}>
                            <Button
                              size="sm"
                              style={{ backgroundColor: theme.primaryColor }}
                              className="text-white"
                            >
                              Book
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {doctor.available_today && (
                        <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                          <Clock className="w-3 h-3" />
                          <span>Available Today</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <HospitalFooter hospital={hospital} />
    </div>
  );
}
