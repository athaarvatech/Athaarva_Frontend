"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Ear,
  Activity,
  Syringe,
  Microscope,
  Ambulance,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import HospitalHeader from "../components/HospitalHeader";
import HospitalFooter from "../components/HospitalFooter";
import { HospitalService, HospitalProfile } from "@/lib/hospital-service";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  available_24x7?: boolean;
}

const defaultServices: Service[] = [
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Comprehensive primary healthcare for adults covering a wide range of conditions and preventive care.",
    icon: Stethoscope,
    features: ["Health Checkups", "Chronic Disease Management", "Preventive Care", "Vaccination"],
  },
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Expert cardiac care with state-of-the-art diagnostic and treatment facilities.",
    icon: Heart,
    features: ["ECG & Echo", "Angiography", "Angioplasty", "Pacemaker Implantation"],
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Specialized treatment for disorders of the brain, spinal cord, and nervous system.",
    icon: Brain,
    features: ["Stroke Management", "Epilepsy Treatment", "Headache Clinic", "EEG & EMG"],
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Complete bone and joint care including sports medicine and rehabilitation.",
    icon: Bone,
    features: ["Joint Replacement", "Spine Surgery", "Sports Medicine", "Fracture Care"],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Dedicated healthcare for infants, children, and adolescents.",
    icon: Baby,
    features: ["Well-baby Care", "Immunization", "Growth Monitoring", "Pediatric Emergency"],
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    description: "Advanced eye care services including cataract surgery and laser treatments.",
    icon: Eye,
    features: ["Cataract Surgery", "LASIK", "Glaucoma Treatment", "Retina Care"],
  },
  {
    id: "ent",
    name: "ENT",
    description: "Expert care for ear, nose, throat, and related structures of head and neck.",
    icon: Ear,
    features: ["Hearing Tests", "Sinus Treatment", "Tonsillectomy", "Speech Therapy"],
  },
  {
    id: "emergency",
    name: "Emergency Care",
    description: "Round-the-clock emergency services with rapid response teams.",
    icon: Ambulance,
    features: ["24/7 Emergency", "Trauma Care", "Critical Care", "Ambulance Service"],
    available_24x7: true,
  },
  {
    id: "diagnostics",
    name: "Diagnostic Services",
    description: "Comprehensive laboratory and imaging services for accurate diagnosis.",
    icon: Microscope,
    features: ["Pathology Lab", "X-Ray & CT", "MRI Scan", "Ultrasound"],
  },
  {
    id: "vaccination",
    name: "Vaccination Center",
    description: "Complete immunization services for all age groups.",
    icon: Syringe,
    features: ["Child Vaccination", "Adult Vaccination", "Travel Vaccines", "Flu Shots"],
  },
];

export default function ServicesPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const basePath = `/hospital/${subdomain}`;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = {
    primaryColor: hospital?.primary_color || "#007C7C",
    secondaryColor: hospital?.secondary_color || "#20B2AA",
  };

  useEffect(() => {
    async function fetchHospital() {
      try {
        const hospitalData = await HospitalService.getHospitalBySubdomain(subdomain);
        setHospital(hospitalData);
      } catch (error) {
        console.error("Error fetching hospital:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHospital();
  }, [subdomain]);

  if (loading || !hospital) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
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
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Comprehensive healthcare services delivered by our team of experienced specialists
              using state-of-the-art technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${theme.primaryColor}15` }}
                      >
                        <service.icon
                          className="w-6 h-6"
                          style={{ color: theme.primaryColor }}
                        />
                      </div>
                      {service.available_24x7 && (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          24/7
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-4">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: theme.primaryColor }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={`${basePath}/book`}>
                      <Button
                        variant="ghost"
                        className="w-full group-hover:bg-gray-100 transition-colors"
                      >
                        Book Appointment
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Help Choosing the Right Service?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to guide you to the right specialist. Contact us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${basePath}/contact`}>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link href={`${basePath}/book`}>
              <Button
                size="lg"
                style={{ backgroundColor: theme.primaryColor }}
                className="text-white"
              >
                Book an Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <HospitalFooter hospital={hospital} />
    </div>
  );
}
