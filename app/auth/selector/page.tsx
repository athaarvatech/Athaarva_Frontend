"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Loader2,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { API_CONFIG } from "@/lib/api-config";
import { SubdomainService } from "@/lib/subdomain-service";
import {
  HospitalCard,
  HospitalCardData,
  HospitalSearch,
  RecentHospitals,
  recentHospitalsStorage,
  HospitalFiltersComponent,
  HospitalFilters,
  HospitalSortView,
  SortOption,
  ViewMode,
} from "@/components/auth";

interface HospitalListResponse {
  hospitals: HospitalCardData[];
  total: number;
  page: number;
  per_page: number;
}

export default function HospitalSelectorPage() {
  const [hospitals, setHospitals] = useState<HospitalCardData[]>([]);
  const [searchResults, setSearchResults] = useState<HospitalCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalCardData | null>(null);

  // New state for filters, sorting, and view mode
  const [filters, setFilters] = useState<HospitalFilters>({
    specialties: [],
    cities: [],
    states: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<"all" | "nearby">("all");

  // Fetch all hospitals on mount
  useEffect(() => {
    fetchHospitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/hospitals?status=ACTIVE&per_page=100`
      );

      if (response.ok) {
        const data: HospitalListResponse = await response.json();
        setHospitals(data.hospitals);
      } else {
        console.error("Failed to fetch hospitals");
        setHospitals(getMockHospitals());
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHospitals(getMockHospitals());
    } finally {
      setLoading(false);
    }
  };

  const getMockHospitals = (): HospitalCardData[] => [
    {
      id: "1",
      hospital_name: "Test Hospital",
      subdomain: "t",
      status: "ACTIVE",
      city: "Mumbai",
      state: "Maharashtra",
      specialties: ["General Medicine", "Cardiology", "Orthopedics"],
      branding: {
        logo_url: "",
        primary_color: "#7c3aed",
        secondary_color: "#6d28d9",
      },
      rating: 4.5,
    },
    {
      id: "2",
      hospital_name: "Demo Medical Center",
      subdomain: "demo",
      status: "ACTIVE",
      city: "Delhi",
      state: "Delhi",
      specialties: ["Multi-Specialty", "Emergency Care", "Pediatrics"],
      branding: {
        logo_url: "",
        primary_color: "#0369a1",
        secondary_color: "#0284c7",
      },
      rating: 4.8,
    },
    {
      id: "3",
      hospital_name: "City Healthcare",
      subdomain: "cityhospital",
      status: "ACTIVE",
      city: "Bangalore",
      state: "Karnataka",
      specialties: ["Neurology", "Oncology", "Gastroenterology"],
      branding: {
        primary_color: "#059669",
      },
      rating: 4.3,
    },
    {
      id: "4",
      hospital_name: "Green Valley Hospital",
      subdomain: "greenvalley",
      status: "ACTIVE",
      city: "Chennai",
      state: "Tamil Nadu",
      specialties: ["Cardiology", "Nephrology", "Pulmonology"],
      branding: {
        primary_color: "#dc2626",
      },
      rating: 4.6,
    },
  ];

  const handleHospitalSelect = useCallback((hospital: HospitalCardData) => {
    setSelectedHospital(hospital);
    // Save to recent hospitals
    recentHospitalsStorage.add(hospital);
    // Navigate to hospital auth page
    const url = SubdomainService.getSubdomainUrl(hospital.subdomain, "/auth");
    window.location.href = url;
  }, []);

  const handleSearchResults = useCallback((results: HospitalCardData[]) => {
    setSearchResults(results);
    setIsSearchActive(results.length > 0 || isSearching);
  }, [isSearching]);

  const handleSearching = useCallback((searching: boolean) => {
    setIsSearching(searching);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
    setIsSearchActive(false);
  }, []);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      specialties: [],
      cities: [],
      states: [],
      minRating: 0,
    });
  }, []);

  // Apply filters to hospital list
  const applyFilters = useCallback((hospitalList: HospitalCardData[]): HospitalCardData[] => {
    return hospitalList.filter((hospital) => {
      // Filter by specialties
      if (filters.specialties.length > 0) {
        const hasSpecialty = hospital.specialties?.some((s) =>
          filters.specialties.includes(s)
        );
        if (!hasSpecialty) return false;
      }

      // Filter by cities
      if (filters.cities.length > 0) {
        if (!hospital.city || !filters.cities.includes(hospital.city)) {
          return false;
        }
      }

      // Filter by states
      if (filters.states.length > 0) {
        if (!hospital.state || !filters.states.includes(hospital.state)) {
          return false;
        }
      }

      // Filter by minimum rating
      if (filters.minRating > 0) {
        if (!hospital.rating || hospital.rating < filters.minRating) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Sort hospitals
  const sortHospitals = useCallback((hospitalList: HospitalCardData[]): HospitalCardData[] => {
    return [...hospitalList].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.hospital_name.localeCompare(b.hospital_name);
        case "name-desc":
          return b.hospital_name.localeCompare(a.hospital_name);
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "city-asc":
          return (a.city || "").localeCompare(b.city || "");
        case "recent":
          // Assuming newer hospitals have higher IDs or we could use a date field
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });
  }, [sortBy]);

  // Get the final display list of hospitals
  const displayHospitals = useMemo(() => {
    const baseList = isSearchActive ? searchResults : hospitals;
    const filtered = applyFilters(baseList);
    return sortHospitals(filtered);
  }, [isSearchActive, searchResults, hospitals, applyFilters, sortHospitals]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.specialties.length > 0 ||
      filters.cities.length > 0 ||
      filters.states.length > 0 ||
      filters.minRating > 0
    );
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-teal-50/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-healthcare-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-healthcare-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-healthcare-primary to-healthcare-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                <Heart className="h-3.5 w-3.5 text-healthcare-primary fill-healthcare-primary" />
              </div>
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Find Your Healthcare Provider
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Select your hospital to access appointments, medical records, and healthcare services
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left/Main Column - Search & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <HospitalSearch
                onSearch={handleSearchResults}
                onSearching={handleSearching}
                onClear={handleClearSearch}
              />
            </motion.div>

            {/* Recent Hospitals */}
            {!isSearchActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RecentHospitals
                  onSelect={handleHospitalSelect}
                  maxDisplay={3}
                />
              </motion.div>
            )}

            {/* Hospital Grid */}
            <div className="space-y-4">
              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <HospitalFiltersComponent
                  hospitals={isSearchActive ? searchResults : hospitals}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>

              {/* Sort and View controls + Results count */}
              <HospitalSortView
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalCount={displayHospitals.length}
              />

              {/* Section header */}
              {!isSearchActive && !hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-healthcare-primary" />
                  <h2 className="text-sm font-medium text-gray-700">
                    Featured Hospitals
                  </h2>
                </div>
              )}

              {isSearchActive && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <h2 className="text-sm font-medium text-gray-700">
                      {isSearching
                        ? "Searching..."
                        : `${displayHospitals.length} result${displayHospitals.length !== 1 ? "s" : ""} found`}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-xs text-gray-500"
                  >
                    Clear search
                  </Button>
                </div>
              )}

              {/* Loading state */}
              {loading && !isSearchActive && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                  <span className="ml-3 text-gray-600">Loading hospitals...</span>
                </div>
              )}

              {/* No results */}
              {!loading && displayHospitals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isSearchActive || hasActiveFilters
                      ? "No hospitals found"
                      : "No hospitals available"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isSearchActive || hasActiveFilters
                      ? "Try adjusting your search or filters"
                      : "Check back soon or contact support for assistance"}
                  </p>
                  {(isSearchActive || hasActiveFilters) && (
                    <div className="flex justify-center gap-2">
                      {isSearchActive && (
                        <Button variant="outline" onClick={handleClearSearch}>
                          Clear search
                        </Button>
                      )}
                      {hasActiveFilters && (
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear filters
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Hospital grid */}
              {!loading && displayHospitals.length > 0 && (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-4"
                      : viewMode === "list"
                      ? "space-y-3"
                      : "grid grid-cols-2 md:grid-cols-3 gap-3"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {displayHospitals.map((hospital, index) => (
                      <HospitalCard
                        key={hospital.id}
                        hospital={hospital}
                        onClick={handleHospitalSelect}
                        isSelected={selectedHospital?.id === hospital.id}
                        variant={
                          viewMode === "grid"
                            ? "featured"
                            : viewMode === "list"
                            ? "default"
                            : "compact"
                        }
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Help Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Can't find your hospital */}
            <Card className="border-dashed border-2 border-gray-200 bg-white/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Can&apos;t find your hospital?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your hospital might not be registered with Athaarva yet. Contact us and we&apos;ll help you connect.
                    </p>
                    <div className="space-y-2">
                      <a
                        href="mailto:support@athaarva.com"
                        className="flex items-center gap-2 text-sm text-healthcare-primary hover:text-healthcare-secondary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        support@athaarva.com
                      </a>
                      <a
                        href="tel:+911234567890"
                        className="flex items-center gap-2 text-sm text-healthcare-primary hover:text-healthcare-secondary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        +91 123 456 7890
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Hospitals */}
            <Card className="bg-gradient-to-br from-healthcare-primary/5 to-healthcare-secondary/5 border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Are you a hospital administrator?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Join Athaarva and provide your patients with a seamless digital healthcare experience.
                </p>
                <Link href="/onboarding/hospital">
                  <Button
                    variant="outline"
                    className="w-full border-healthcare-primary text-healthcare-primary hover:bg-healthcare-primary hover:text-white"
                  >
                    Register Your Hospital
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="text-sm text-left py-3 hover:no-underline">
                      How do I access my hospital?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      Search for your hospital by name or city, then click on it to access the login page. You can sign in as a patient, doctor, or staff member.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="text-sm text-left py-3 hover:no-underline">
                      What if I forgot my password?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      Each hospital has its own password reset process. Navigate to your hospital&apos;s login page and look for the &quot;Forgot Password&quot; option.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="text-sm text-left py-3 hover:no-underline">
                      Can I be registered at multiple hospitals?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      Yes! You can have patient accounts at multiple hospitals. Simply select the hospital you want to access from this page.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6 border-gray-200"
            >
              <MessageSquare className="h-5 w-5 text-healthcare-primary" />
              <span>Start Live Chat</span>
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200 text-center"
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Athaarva Healthcare Platform. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-600">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-600">
              Contact Us
            </Link>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
