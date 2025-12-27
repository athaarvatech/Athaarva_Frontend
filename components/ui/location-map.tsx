"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Loader2, Navigation, X } from "lucide-react";
import { cn } from "@/lib/utils";

// MapTiler API Key
const MAPTILER_API_KEY = "oGnm1sskGbQ70ZMikaPd";

// Initialize MapTiler
maptilersdk.config.apiKey = MAPTILER_API_KEY;

interface LocationResult {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: Array<{
    id: string;
    text: string;
  }>;
  properties?: {
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface LocationMapProps {
  onLocationSelect: (location: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    geo: { lat: number; lng: number };
  }) => void;
  initialLocation?: { lat: number; lng: number } | null;
  className?: string;
}

export function LocationMap({
  onLocationSelect,
  initialLocation,
  className,
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Default center - India
    const defaultCenter: [number, number] = initialLocation
      ? [initialLocation.lng, initialLocation.lat]
      : [79.89085, 19.74847];
    const defaultZoom = initialLocation ? 15 : 4.7;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: defaultCenter,
      zoom: defaultZoom,
    });

    // Add navigation controls
    map.current.addControl(new maptilersdk.NavigationControl(), "top-right");

    // If initial location exists, add marker
    if (initialLocation) {
      marker.current = new maptilersdk.Marker({ color: "#0d9488" })
        .setLngLat([initialLocation.lng, initialLocation.lat])
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLocation]);

  // Search for places using MapTiler Geocoding API
  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          query
        )}.json?key=${MAPTILER_API_KEY}&country=IN&limit=8`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSearchResults(data.features as LocationResult[]);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  // Parse location context to extract city, state, pincode
  const parseLocationContext = (result: LocationResult) => {
    let city = "";
    let state = "";
    let pincode = "";
    let country = "India";
    const address = result.place_name.split(",")[0] || "";

    // Parse from context array
    if (result.context) {
      result.context.forEach((ctx) => {
        if (ctx.id.startsWith("place") || ctx.id.startsWith("locality")) {
          city = ctx.text;
        } else if (ctx.id.startsWith("region")) {
          state = ctx.text;
        } else if (ctx.id.startsWith("postcode")) {
          pincode = ctx.text;
        } else if (ctx.id.startsWith("country")) {
          country = ctx.text;
        }
      });
    }

    // Also check properties
    if (result.properties) {
      if (!city && result.properties.city) city = result.properties.city;
      if (!state && result.properties.state) state = result.properties.state;
      if (!pincode && result.properties.postcode)
        pincode = result.properties.postcode;
      if (result.properties.country) country = result.properties.country;
    }

    return { address, city, state, pincode, country };
  };

  // Handle location selection
  const handleSelectLocation = (result: LocationResult) => {
    setSelectedLocation(result);
    setSearchQuery(result.place_name);
    setShowResults(false);

    const [lng, lat] = result.center;

    // Update map
    if (map.current) {
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }

      // Add new marker
      marker.current = new maptilersdk.Marker({ color: "#0d9488" })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Fly to location
      map.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        duration: 2000,
        essential: true,
      });
    }

    // Parse and emit location data
    const parsed = parseLocationContext(result);
    onLocationSelect({
      name: result.place_name.split(",")[0],
      address: parsed.address,
      city: parsed.city,
      state: parsed.state,
      pincode: parsed.pincode,
      country: parsed.country,
      geo: { lat, lng },
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setSelectedLocation(null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            placeholder="Search for hospital location, address, or landmark..."
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching && (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            )}
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-0"
                onClick={() => handleSelectLocation(result)}
              >
                <MapPin className="w-4 h-4 text-healthcare-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.place_name.split(",")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.place_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Badge */}
      {selectedLocation && (
        <div className="flex items-center gap-2 p-2 bg-healthcare-primary/10 rounded-lg">
          <Navigation className="w-4 h-4 text-healthcare-primary" />
          <span className="text-sm text-healthcare-primary font-medium truncate flex-1">
            {selectedLocation.place_name}
          </span>
          <span className="text-xs text-gray-500">
            {selectedLocation.center[1].toFixed(4)},{" "}
            {selectedLocation.center[0].toFixed(4)}
          </span>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-[300px] rounded-lg border border-gray-200 overflow-hidden"
        style={{ minHeight: "300px" }}
      />

      {/* Helper Text */}
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Search and select a location to automatically fill address details
      </p>
    </div>
  );
}

export default LocationMap;
