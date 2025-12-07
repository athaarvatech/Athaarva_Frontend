"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Ambulance,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function ContactPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setSubmitting(false);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  if (loading || !hospital) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
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
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              We're here to help. Reach out to us for appointments, inquiries, or feedback.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Emergency Card */}
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Ambulance className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900">Emergency Services</h3>
                      <p className="text-2xl font-bold text-red-600">{hospital.phone}</p>
                      <p className="text-sm text-red-700">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Reach us through any of these channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <p className="font-medium">{hospital.hospital_name}</p>
                      <p className="text-sm text-gray-600">License: {hospital.license_number}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600">
                        {hospital.address}
                        <br />
                        {hospital.city}, {hospital.state} {hospital.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Phone className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a
                        href={`tel:${hospital.phone}`}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        {hospital.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Mail className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href={`mailto:${hospital.official_email}`}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        {hospital.official_email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}15` }}
                    >
                      <Clock className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    </div>
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-sm text-gray-600">
                        OPD: Monday - Saturday, 9:00 AM - 5:00 PM
                        <br />
                        Emergency: 24/7
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p>Map integration coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${theme.primaryColor}15` }}
                      >
                        <Send className="w-8 h-8" style={{ color: theme.primaryColor }} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) =>
                            setFormData({ ...formData, subject: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appointment">Appointment Inquiry</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="billing">Billing Query</SelectItem>
                            <SelectItem value="medical">Medical Records</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          placeholder="How can we help you?"
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full text-white"
                        style={{ backgroundColor: theme.primaryColor }}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <HospitalFooter hospital={hospital} />
    </div>
  );
}
