"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, MapPin, ArrowRight, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface HospitalCardData {
  id: string;
  hospital_name: string;
  subdomain: string;
  status: string;
  city?: string;
  state?: string;
  address?: string;
  specialties?: string[];
  branding?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  rating?: number;
  isRecent?: boolean;
  lastVisited?: string;
}

interface HospitalCardProps {
  hospital: HospitalCardData;
  onClick: (hospital: HospitalCardData) => void;
  isSelected?: boolean;
  variant?: "default" | "compact" | "featured";
  index?: number;
}

export function HospitalCard({
  hospital,
  onClick,
  isSelected = false,
  variant = "default",
  index = 0,
}: HospitalCardProps) {
  const primaryColor = hospital.branding?.primary_color || "#007C7C";

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => onClick(hospital)}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
          "border border-gray-100 hover:border-healthcare-primary/30",
          "hover:bg-healthcare-primary/5 hover:shadow-sm",
          isSelected && "border-healthcare-primary bg-healthcare-primary/5"
        )}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          {hospital.branding?.logo_url ? (
            <Image
              src={hospital.branding.logo_url}
              alt={`${hospital.hospital_name} logo`}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Building2 className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {hospital.hospital_name}
          </h4>
          {hospital.city && (
            <p className="text-sm text-gray-500 truncate">
              {hospital.city}{hospital.state ? `, ${hospital.state}` : ""}
            </p>
          )}
        </div>

        {/* Recent indicator */}
        {hospital.isRecent && (
          <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}

        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => onClick(hospital)}
        className={cn(
          "group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300",
          "border-2 hover:shadow-xl",
          isSelected
            ? "border-healthcare-primary shadow-lg"
            : "border-gray-200 hover:border-healthcare-primary/50"
        )}
      >
        {/* Color accent bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="p-5">
          {/* Header with logo and rating */}
          <div className="flex items-start justify-between mb-4">
            {hospital.branding?.logo_url ? (
              <Image
                src={hospital.branding.logo_url}
                alt={`${hospital.hospital_name} logo`}
                width={56}
                height={56}
                className="rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <Building2 className="h-7 w-7" />
              </div>
            )}

            {hospital.rating && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-amber-700">
                  {hospital.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Hospital name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-healthcare-primary transition-colors">
            {hospital.hospital_name}
          </h3>

          {/* Location */}
          {(hospital.city || hospital.address) && (
            <div className="flex items-start gap-2 text-gray-600 mb-3">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">
                {hospital.address || hospital.city}
                {hospital.state && !hospital.address ? `, ${hospital.state}` : ""}
              </span>
            </div>
          )}

          {/* Specialties */}
          {hospital.specialties && hospital.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {specialty}
                </Badge>
              ))}
              {hospital.specialties.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600"
                >
                  +{hospital.specialties.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action indicator */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {hospital.subdomain}.athaarva.com
            </span>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-healthcare-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(hospital)}
      className={cn(
        "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
        "hover:shadow-md",
        isSelected
          ? "border-healthcare-primary bg-healthcare-primary/5"
          : "border-gray-200 hover:border-healthcare-primary/50"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        {hospital.branding?.logo_url ? (
          <Image
            src={hospital.branding.logo_url}
            alt={`${hospital.hospital_name} logo`}
            width={48}
            height={48}
            className="rounded-lg object-cover"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Building2 className="h-6 w-6" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {hospital.hospital_name}
          </h3>
          
          {(hospital.city || hospital.subdomain) && (
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              {hospital.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {hospital.city}
                </span>
              )}
            </div>
          )}

          {/* Specialties on default card */}
          {hospital.specialties && hospital.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hospital.specialties.slice(0, 2).map((specialty, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs"
                >
                  {specialty}
                </Badge>
              ))}
              {hospital.specialties.length > 2 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{hospital.specialties.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </div>
    </motion.div>
  );
}

export default HospitalCard;
