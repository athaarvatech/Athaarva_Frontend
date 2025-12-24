"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  GraduationCap,
  Award,
  Languages,
  CheckCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HospitalHeader from "../../components/HospitalHeader";
import HospitalFooter from "../../components/HospitalFooter";
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
  email?: string;
  phone?: string;
  registration_number?: string;
  services?: string[];
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  working_hours?: Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>;
}

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function DoctorProfilePage() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const doctorId = params.id as string;
  const basePath = `/hospital/${subdomain}`;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    primaryColor: hospital?.primary_color || "#007C7C",
    secondaryColor: hospital?.secondary_color || "#20B2AA",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const hospitalData = await HospitalService.getHospitalBySubdomain(
          subdomain
        );
        setHospital(hospitalData);

        // Fetch doctor details
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(
          `${API_BASE_URL}/api/v1/doctors/${doctorId}`
        );

        if (response.ok) {
          const data = await response.json();
          setDoctor(data.data || data);
        } else {
          setDoctor(getMockDoctor());
        }

        // Fetch reviews
        setReviews(getMockReviews());
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setDoctor(getMockDoctor());
        setReviews(getMockReviews());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain, doctorId]);

  function getMockDoctor(): Doctor {
    return {
      id: doctorId,
      full_name: "Dr. Priya Sharma",
      specialization: "Cardiology",
      qualification: "MBBS, MD (Cardiology), DM",
      experience_years: 15,
      consultation_fee: 800,
      avatar_url: undefined,
      bio: "Dr. Priya Sharma is a senior cardiologist with over 15 years of experience in treating complex cardiac conditions. She specializes in interventional cardiology, heart failure management, and preventive cardiology. Dr. Sharma has performed over 5000 cardiac procedures and is known for her patient-centric approach to healthcare.",
      languages: ["English", "Hindi", "Marathi"],
      available_today: true,
      rating: 4.8,
      total_reviews: 234,
      email: "priya.sharma@hospital.com",
      phone: "+91 98765 43210",
      registration_number: "MCI-12345",
      services: [
        "ECG & Echo",
        "Angiography",
        "Angioplasty",
        "Pacemaker Implantation",
        "Heart Failure Management",
        "Preventive Cardiology",
      ],
      education: [
        { degree: "MBBS", institution: "AIIMS Delhi", year: 2005 },
        {
          degree: "MD (Internal Medicine)",
          institution: "PGI Chandigarh",
          year: 2009,
        },
        { degree: "DM (Cardiology)", institution: "AIIMS Delhi", year: 2012 },
      ],
      working_hours: [
        { day: "Monday", start_time: "09:00", end_time: "17:00" },
        { day: "Tuesday", start_time: "09:00", end_time: "17:00" },
        { day: "Wednesday", start_time: "09:00", end_time: "14:00" },
        { day: "Thursday", start_time: "09:00", end_time: "17:00" },
        { day: "Friday", start_time: "09:00", end_time: "17:00" },
        { day: "Saturday", start_time: "10:00", end_time: "14:00" },
      ],
    };
  }

  function getMockReviews(): Review[] {
    return [
      {
        id: "1",
        patient_name: "Rahul M.",
        rating: 5,
        comment:
          "Excellent doctor! Very thorough in diagnosis and explained everything clearly. Highly recommended.",
        date: "2024-11-15",
      },
      {
        id: "2",
        patient_name: "Sneha K.",
        rating: 4,
        comment:
          "Very professional and caring. The treatment was effective and I felt much better after following her advice.",
        date: "2024-11-10",
      },
      {
        id: "3",
        patient_name: "Amit S.",
        rating: 5,
        comment:
          "Dr. Sharma is extremely knowledgeable and patient. She took time to understand my concerns and provided the best treatment.",
        date: "2024-11-05",
      },
    ];
  }

  if (loading || !hospital || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HospitalHeader hospital={hospital} />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Link href={`${basePath}/doctors`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Button>
        </Link>
      </div>

      {/* Doctor Profile Header */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <div
                className="h-32 md:h-48"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                }}
              />
              <CardContent className="relative px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="-mt-16 md:-mt-20">
                    {doctor.avatar_url ? (
                      <Image
                        src={doctor.avatar_url}
                        alt={doctor.full_name}
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {doctor.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 pt-2 md:pt-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {doctor.full_name}
                        </h1>
                        <p
                          className="text-lg"
                          style={{ color: theme.primaryColor }}
                        >
                          {doctor.specialization}
                        </p>
                        <p className="text-gray-600">{doctor.qualification}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          {doctor.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {doctor.rating}
                              </span>
                              <span className="text-gray-500">
                                ({doctor.total_reviews} reviews)
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-600">
                            <Award className="w-5 h-5" />
                            <span>{doctor.experience_years}+ years</span>
                          </div>
                          {doctor.available_today && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Available Today
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Consultation Fee
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: theme.primaryColor }}
                          >
                            ₹{doctor.consultation_fee}
                          </p>
                        </div>
                        <Link href={`${basePath}/book?doctor=${doctor.id}`}>
                          <Button
                            size="lg"
                            style={{ backgroundColor: theme.primaryColor }}
                            className="text-white"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Details Tabs */}
      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About Doctor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {doctor.bio}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  {doctor.education && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          Education & Training
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {doctor.education.map((edu, index) => (
                            <div key={index} className="flex gap-4">
                              <div
                                className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: theme.primaryColor }}
                              />
                              <div>
                                <p className="font-medium">{edu.degree}</p>
                                <p className="text-sm text-gray-600">
                                  {edu.institution} • {edu.year}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Contact & Languages */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {doctor.registration_number && (
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Registration No.
                            </p>
                            <p className="text-sm">
                              {doctor.registration_number}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {doctor.languages && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Languages className="w-5 h-5" />
                          Languages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((lang) => (
                            <Badge key={lang} variant="secondary">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  {doctor.services && doctor.services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {doctor.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                        >
                          <CheckCircle
                            className="w-5 h-5"
                            style={{ color: theme.primaryColor }}
                          />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No services listed.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {doctor.working_hours && doctor.working_hours.length > 0 ? (
                    <div className="space-y-3">
                      {doctor.working_hours.map((schedule, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <span className="font-medium">{schedule.day}</span>
                          <span className="text-gray-600">
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Schedule not available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {review.patient_name}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <HospitalFooter hospital={hospital} />
    </div>
  );
}
