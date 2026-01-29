"use client";

import React, { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";

// MapTiler API Key
const MAPTILER_API_KEY = "oGnm1sskGbQ70ZMikaPd";

// Initialize MapTiler
maptilersdk.config.apiKey = MAPTILER_API_KEY;

interface LocationMapViewProps {
  location: { lat: number; lng: number } | null;
  onLocationChange?: (geo: { lat: number; lng: number }) => void;
  height?: string;
  interactive?: boolean;
}

export default function LocationMapView({
  location,
  onLocationChange,
  height = "300px",
  interactive = true,
}: LocationMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  // NOTE: `@maptiler/sdk`'s `Marker` extends `maplibre-gl`'s Marker.
  // In some installs, TypeScript can't find `maplibre-gl`'s bundled .d.ts,
  // which makes inherited methods like `setLngLat` disappear from the type.
  // We keep this as `any` to avoid build-blocking type errors.
  const marker = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // If map already exists, just update the view
    if (map.current) {
      if (location) {
        // Update marker position
        if (marker.current) {
          marker.current.setLngLat([location.lng, location.lat]);
        } else {
          marker.current = new (maptilersdk.Marker as any)({ color: "#0d9488" })
            .setLngLat([location.lng, location.lat])
            .addTo(map.current);
        }

        // Fly to location
        map.current.flyTo({
          center: [location.lng, location.lat],
          zoom: 16,
          duration: 1500,
          essential: true,
        });
      }
      return;
    }

    // Default center - India
    const defaultCenter: [number, number] = location
      ? [location.lng, location.lat]
      : [79.89085, 19.74847];
    const defaultZoom = location ? 15 : 4.7;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: defaultCenter,
      zoom: defaultZoom,
    });

    // Add navigation controls
    map.current.addControl(new maptilersdk.NavigationControl(), "top-right");

    // If initial location exists, add marker
    if (location) {
      marker.current = new (maptilersdk.Marker as any)({ color: "#0d9488" })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
    }

    // Allow clicking on map to set location (only if interactive)
    if (interactive && onLocationChange) {
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        // Update or create marker
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        } else if (map.current) {
          marker.current = new (maptilersdk.Marker as any)({ color: "#0d9488" })
            .setLngLat([lng, lat])
            .addTo(map.current);
        }

        onLocationChange({ lat, lng });
      });
    }

    return () => {
      // Don't remove map on every re-render
    };
  }, [location, onLocationChange, interactive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-lg border border-gray-200 overflow-hidden"
      style={{ height, minHeight: height }}
    />
  );
}
