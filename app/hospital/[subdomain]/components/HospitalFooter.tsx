"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { HospitalProfile } from "@/lib/hospital-service";

interface HospitalFooterProps {
  hospital: HospitalProfile;
}

export default function HospitalFooter({ hospital }: HospitalFooterProps) {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const basePath = `/hospital/${subdomain}`;

  const theme = {
    primaryColor: hospital.primary_color || "#007C7C",
    secondaryColor: hospital.secondary_color || "#20B2AA",
  };

  const quickLinks = [
    { href: "", label: "Home" },
    { href: "/doctors", label: "Our Doctors" },
    { href: "/services", label: "Services" },
    { href: "/book", label: "Book Appointment" },
    { href: "/contact", label: "Contact Us" },
  ];

  const services = [
    "General Medicine",
    "Emergency Care",
    "Diagnostic Services",
    "Outpatient Care",
    "Inpatient Care",
    "Telemedicine",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {hospital.logo_url ? (
                <div className="w-12 h-12 bg-white rounded-lg p-1">
                  <Image
                    src={hospital.logo_url}
                    alt={hospital.hospital_name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-white">{hospital.hospital_name}</h3>
                <p className="text-sm text-gray-400">Healthcare Excellence</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Providing comprehensive healthcare services with cutting-edge technology
              and compassionate care. Your health is our priority.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href ? `${basePath}${link.href}` : basePath}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href={`${basePath}/services`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primaryColor }} />
                <span className="text-sm">
                  {hospital.address}, {hospital.city}, {hospital.state} {hospital.pincode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />
                <a href={`tel:${hospital.phone}`} className="text-sm hover:text-white transition-colors">
                  {hospital.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />
                <a href={`mailto:${hospital.official_email}`} className="text-sm hover:text-white transition-colors">
                  {hospital.official_email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />
                <span className="text-sm">24/7 Emergency Services</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} {hospital.hospital_name}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href={`${basePath}/privacy`} className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href={`${basePath}/terms`} className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="text-gray-500">
              Powered by <span className="text-gray-400">Athaarva Healthcare</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
