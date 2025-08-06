"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactRFQ() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    inquiry: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.organization.trim())
      newErrors.organization = "Organization is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after success
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        role: "",
        inquiry: "general",
        message: "",
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 80 4567 8900", "+91 80 4567 8901"],
      subtitle: "Mon-Sat 9AM-6PM IST",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["sales@atharva.healthcare", "support@atharva.healthcare"],
      subtitle: "24/7 response guarantee",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Electronic City, Bangalore", "Karnataka 560100, India"],
      subtitle: "By appointment only",
    },
  ];

  if (isSubmitted) {
    return (
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-[#f1f9ff] via-white to-[#f0f9f7]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#1E3E72] mb-4 font-['Montserrat']">
              Thank You for Your Interest!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Our procurement specialists will contact you within 24 hours to
              discuss your requirements.
            </p>
            <p className="text-gray-600 mb-8">
              Meanwhile, explore our product catalog or check out our resources
              section for procurement best practices and industry insights.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#F37336] hover:bg-[#e5642a] text-white px-8 py-3"
            >
              Submit Another Inquiry
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-[#f1f9ff] via-white to-[#f0f9f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Roboto']">
            Ready to streamline your medical procurement? Our specialists are
            here to help you find the right solutions for your healthcare
            facility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1E3E72]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#1E3E72]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-gray-700 font-medium">
                            {detail}
                          </p>
                        ))}
                        <p className="text-sm text-gray-600 mt-1">
                          {info.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Response Promise */}
            <Card className="border-[#14967f] bg-gradient-to-r from-[#14967f]/5 to-[#1E3E72]/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#14967f]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#14967f]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quick Response Promise
                </h3>
                <p className="text-sm text-gray-600">
                  We respond to all inquiries within 4 business hours. For
                  urgent requests, call us directly.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#1E3E72] mb-6 font-['Montserrat']">
                  Request Quote or Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-gray-700 font-medium"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`mt-2 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } focus:border-[#1E3E72] focus:ring-[#1E3E72]`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`mt-2 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } focus:border-[#1E3E72] focus:ring-[#1E3E72]`}
                        placeholder="your.email@hospital.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-gray-700 font-medium"
                      >
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`mt-2 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } focus:border-[#1E3E72] focus:ring-[#1E3E72]`}
                        placeholder="+91 9876543210"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="role"
                        className="text-gray-700 font-medium"
                      >
                        Your Role
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleInputChange("role", value)
                        }
                      >
                        <SelectTrigger className="mt-2 border-gray-300 focus:border-[#1E3E72] focus:ring-[#1E3E72]">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="procurement">
                            Procurement Manager
                          </SelectItem>
                          <SelectItem value="admin">
                            Hospital Administrator
                          </SelectItem>
                          <SelectItem value="doctor">
                            Doctor/Physician
                          </SelectItem>
                          <SelectItem value="nurse">Nurse Manager</SelectItem>
                          <SelectItem value="technician">
                            Medical Technician
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="organization"
                      className="text-gray-700 font-medium"
                    >
                      Organization Name *
                    </Label>
                    <Input
                      id="organization"
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        handleInputChange("organization", e.target.value)
                      }
                      className={`mt-2 ${
                        errors.organization
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:border-[#1E3E72] focus:ring-[#1E3E72]`}
                      placeholder="Your hospital, clinic, or healthcare facility"
                    />
                    {errors.organization && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.organization}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="inquiry"
                      className="text-gray-700 font-medium"
                    >
                      Inquiry Type
                    </Label>
                    <Select
                      value={formData.inquiry}
                      onValueChange={(value) =>
                        handleInputChange("inquiry", value)
                      }
                    >
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-[#1E3E72] focus:ring-[#1E3E72]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          General Information
                        </SelectItem>
                        <SelectItem value="bulk">Bulk Order Pricing</SelectItem>
                        <SelectItem value="rfq">
                          Request for Quotation
                        </SelectItem>
                        <SelectItem value="demo">Product Demo</SelectItem>
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="partnership">
                          Partnership Inquiry
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-gray-700 font-medium"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      className={`mt-2 min-h-[120px] ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      } focus:border-[#1E3E72] focus:ring-[#1E3E72]`}
                      placeholder="Tell us about your requirements, specific products you're interested in, or any questions you have..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F37336] hover:bg-[#e5642a] text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    By submitting this form, you agree to our privacy policy and
                    consent to be contacted by our team regarding your inquiry.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
