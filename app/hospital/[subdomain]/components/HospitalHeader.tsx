"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HospitalProfile } from "@/lib/hospital-service";

interface HospitalHeaderProps {
  hospital: HospitalProfile;
}

const navLinks = [
  { href: "", label: "Home" },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Appointment" },
  { href: "/contact", label: "Contact" },
];

export default function HospitalHeader({ hospital }: HospitalHeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const subdomain = params.subdomain as string;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const theme = {
    primaryColor: hospital.primary_color || "#007C7C",
    secondaryColor: hospital.secondary_color || "#20B2AA",
  };

  const basePath = `/hospital/${subdomain}`;

  const isActive = (href: string) => {
    const fullPath = href ? `${basePath}${href}` : basePath;
    return pathname === fullPath;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-b text-sm">
          <div className="flex items-center gap-6 text-gray-600">
            <a href={`tel:${hospital.phone}`} className="flex items-center gap-1 hover:text-gray-900">
              <Phone className="w-4 h-4" />
              {hospital.phone}
            </a>
            <a href={`mailto:${hospital.official_email}`} className="flex items-center gap-1 hover:text-gray-900">
              <Mail className="w-4 h-4" />
              {hospital.official_email}
            </a>
          </div>
          <div className="text-gray-500">
            {hospital.city}, {hospital.state}
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={basePath} className="flex items-center gap-3">
            {hospital.logo_url ? (
              <div className="w-10 h-10 bg-white rounded-lg shadow border flex items-center justify-center p-1">
                <Image
                  src={hospital.logo_url}
                  alt={hospital.hospital_name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900">{hospital.hospital_name}</h1>
              <p className="text-xs text-gray-500">Healthcare Excellence</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href ? `${basePath}${link.href}` : basePath}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={isActive(link.href) ? { backgroundColor: theme.primaryColor } : {}}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href={`${basePath}/auth/login`}>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href={`${basePath}/book`}>
              <Button
                size="sm"
                style={{ backgroundColor: theme.primaryColor }}
                className="text-white"
              >
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 pb-6 border-b">
                  {hospital.logo_url ? (
                    <Image
                      src={hospital.logo_url}
                      alt={hospital.hospital_name}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold">{hospital.hospital_name}</h2>
                    <p className="text-xs text-gray-500">{hospital.city}</p>
                  </div>
                </div>

                <nav className="flex-1 py-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href ? `${basePath}${link.href}` : basePath}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={isActive(link.href) ? { backgroundColor: theme.primaryColor } : {}}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="pt-6 border-t space-y-3">
                  <Link href={`${basePath}/auth/login`} className="block">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href={`${basePath}/book`} className="block">
                    <Button
                      className="w-full text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
