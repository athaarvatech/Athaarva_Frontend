"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  useHospitalOnboarding,
  LocationData,
} from "@/contexts/HospitalOnboardingContextV2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Phone,
  Mail,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const LocationMapView = dynamic(() => import("./LocationMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  ),
});

interface PlaceResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const LOCATION_TYPES: { value: LocationData["type"]; label: string }[] = [
  { value: "hospital", label: "Hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "diagnostic_center", label: "Diagnostic Center" },
  { value: "pharmacy_outlet", label: "Pharmacy Outlet" },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

const generateLocationCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LOC-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const createEmptyLocation = (): LocationData => ({
  id: crypto.randomUUID(),
  location_code: generateLocationCode(),
  name: "",
  type: "hospital",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  geo: null,
  contact_phone: "",
  contact_email: "",
  emergency_hotline: "",
  is_headquarters: false,
  is_billing_entity: false,
  location_gstin: "",
  state_code: "",
});

export default function LocationsContactsStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationData | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<LocationData>(
    createEmptyLocation()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Ensure locations is always an array (defensive check for corrupted data)
  const locations = Array.isArray(data.locations) ? data.locations : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        "https://nominatim.openstreetmap.org/search?format=json&q=" +
          encodeURIComponent(query) +
          "&countrycodes=in&addressdetails=1&limit=5",
        { headers: { "Accept-Language": "en" } }
      );
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  const handlePlaceSelect = (place: PlaceResult) => {
    setCurrentLocation((prev) => ({
      ...prev,
      address_line_1:
        place.address?.road || place.display_name.split(",")[0] || "",
      city: place.address?.city || "",
      state: place.address?.state || "",
      pincode: place.address?.postcode || "",
      geo: { lat: parseFloat(place.lat), lng: parseFloat(place.lon) },
    }));
    setSearchQuery(place.display_name);
    setShowSearchResults(false);
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setCurrentLocation(createEmptyLocation());
    setSearchQuery("");
    setIsDialogOpen(true);
  };

  const handleEditLocation = (location: LocationData) => {
    setEditingLocation(location);
    setCurrentLocation({ ...location });
    setSearchQuery("");
    setIsDialogOpen(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    const updatedLocations = locations.filter((loc) => loc.id !== locationId);
    updateData("locations", updatedLocations);
  };

  const handleSaveLocation = () => {
    let updatedLocations: LocationData[];
    if (editingLocation) {
      updatedLocations = locations.map((loc) =>
        loc.id === editingLocation.id ? currentLocation : loc
      );
    } else {
      const newLocation = {
        ...currentLocation,
        is_headquarters:
          locations.length === 0 || currentLocation.is_headquarters,
      };
      updatedLocations = [...locations, newLocation];
    }
    if (currentLocation.is_headquarters) {
      updatedLocations = updatedLocations.map((loc) => ({
        ...loc,
        is_headquarters: loc.id === currentLocation.id,
      }));
    }
    updateData("locations", updatedLocations);
    setIsDialogOpen(false);
    setCurrentLocation(createEmptyLocation());
    setEditingLocation(null);
  };

  const updateCurrentLocation = (field: keyof LocationData, value: unknown) => {
    setCurrentLocation((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      currentLocation.name &&
      currentLocation.address_line_1 &&
      currentLocation.city &&
      currentLocation.state &&
      currentLocation.pincode &&
      currentLocation.contact_phone &&
      currentLocation.contact_email
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Locations & Contacts
          </h2>
          <p className="text-gray-600 mt-1">
            Add your hospital locations, branches, and contact information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddLocation} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Add New Location"}
              </DialogTitle>
              <DialogDescription>
                Enter the details for this location. Search for a place to
                auto-fill address.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Basic Details</TabsTrigger>
                <TabsTrigger value="address">Address & Map</TabsTrigger>
                <TabsTrigger value="contact">Contact & Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location_code">Location Code</Label>
                    <Input
                      id="location_code"
                      value={currentLocation.location_code}
                      onChange={(e) =>
                        updateCurrentLocation("location_code", e.target.value)
                      }
                      placeholder="LOC-XXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Location Type *</Label>
                    <Select
                      value={currentLocation.type}
                      onValueChange={(value) =>
                        updateCurrentLocation("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    value={currentLocation.name}
                    onChange={(e) =>
                      updateCurrentLocation("name", e.target.value)
                    }
                    placeholder="e.g., Main Hospital, Downtown Clinic"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label
                      htmlFor="is_headquarters"
                      className="text-base font-medium"
                    >
                      Headquarters
                    </Label>
                    <p className="text-sm text-gray-500">
                      Mark this as your primary/headquarters location
                    </p>
                  </div>
                  <Switch
                    id="is_headquarters"
                    checked={currentLocation.is_headquarters}
                    onCheckedChange={(checked) =>
                      updateCurrentLocation("is_headquarters", checked)
                    }
                  />
                </div>
              </TabsContent>
              <TabsContent value="address" className="space-y-4 mt-4">
                <div className="space-y-2 relative" ref={searchContainerRef}>
                  <Label htmlFor="place_search">Search Place</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="place_search"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() =>
                        searchResults.length > 0 && setShowSearchResults(true)
                      }
                      placeholder="Search for a place to auto-fill address..."
                      className="pl-10 pr-10"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                    {searchQuery && !isSearching && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((place) => (
                        <button
                          key={place.place_id}
                          onClick={() => handlePlaceSelect(place)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b last:border-b-0"
                        >
                          <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {place.display_name.split(",")[0]}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {place.display_name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-lg overflow-hidden border h-[300px]">
                  <LocationMapView
                    location={currentLocation.geo}
                    onLocationChange={(geo) =>
                      updateCurrentLocation("geo", geo)
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address_line_1">Address Line 1 *</Label>
                    <Input
                      id="address_line_1"
                      value={currentLocation.address_line_1}
                      onChange={(e) =>
                        updateCurrentLocation("address_line_1", e.target.value)
                      }
                      placeholder="Street address, building name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_line_2">Address Line 2</Label>
                    <Input
                      id="address_line_2"
                      value={currentLocation.address_line_2 || ""}
                      onChange={(e) =>
                        updateCurrentLocation("address_line_2", e.target.value)
                      }
                      placeholder="Apartment, suite, floor (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={currentLocation.city}
                        onChange={(e) =>
                          updateCurrentLocation("city", e.target.value)
                        }
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={currentLocation.state}
                        onValueChange={(value) =>
                          updateCurrentLocation("state", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={currentLocation.pincode}
                        onChange={(e) =>
                          updateCurrentLocation("pincode", e.target.value)
                        }
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={currentLocation.country}
                        onChange={(e) =>
                          updateCurrentLocation("country", e.target.value)
                        }
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contact_phone"
                        value={currentLocation.contact_phone}
                        onChange={(e) =>
                          updateCurrentLocation("contact_phone", e.target.value)
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_hotline">Emergency Hotline</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                      <Input
                        id="emergency_hotline"
                        value={currentLocation.emergency_hotline || ""}
                        onChange={(e) =>
                          updateCurrentLocation(
                            "emergency_hotline",
                            e.target.value
                          )
                        }
                        placeholder="Emergency number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact_email"
                      type="email"
                      value={currentLocation.contact_email}
                      onChange={(e) =>
                        updateCurrentLocation("contact_email", e.target.value)
                      }
                      placeholder="location@hospital.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label
                        htmlFor="is_billing_entity"
                        className="text-base font-medium"
                      >
                        Billing Entity
                      </Label>
                      <p className="text-sm text-gray-500">
                        This location has its own GST registration
                      </p>
                    </div>
                    <Switch
                      id="is_billing_entity"
                      checked={currentLocation.is_billing_entity}
                      onCheckedChange={(checked) =>
                        updateCurrentLocation("is_billing_entity", checked)
                      }
                    />
                  </div>
                  {currentLocation.is_billing_entity && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location_gstin">GSTIN</Label>
                        <Input
                          id="location_gstin"
                          value={currentLocation.location_gstin || ""}
                          onChange={(e) =>
                            updateCurrentLocation(
                              "location_gstin",
                              e.target.value
                            )
                          }
                          placeholder="22AAAAA0000A1Z5"
                          maxLength={15}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state_code">State Code</Label>
                        <Input
                          id="state_code"
                          value={currentLocation.state_code || ""}
                          onChange={(e) =>
                            updateCurrentLocation("state_code", e.target.value)
                          }
                          placeholder="e.g., 27"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLocation} disabled={!isFormValid()}>
                {editingLocation ? "Update Location" : "Add Location"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {locations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No locations added
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Add your first hospital location to get started
            </p>
            <Button
              onClick={handleAddLocation}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((location) => (
            <Card key={location.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {location.name}
                        {location.is_headquarters && (
                          <Badge variant="secondary" className="text-xs">
                            HQ
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="capitalize">
                          {location.type.replace("_", " ")}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>{location.location_code}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditLocation(location)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLocation(location.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`grid ${
                    location.geo ? "md:grid-cols-2" : "grid-cols-1"
                  } gap-4`}
                >
                  {/* Location Details */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-gray-600">
                          <p className="font-medium text-gray-800">
                            {location.address_line_1}
                          </p>
                          {location.address_line_2 && (
                            <p>{location.address_line_2}</p>
                          )}
                          <p>
                            {location.city}, {location.state} -{" "}
                            {location.pincode}
                          </p>
                          <p>{location.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">
                          {location.contact_phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-gray-600">
                          {location.contact_email}
                        </span>
                      </div>
                      {location.emergency_hotline && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-gray-600">
                            Emergency: {location.emergency_hotline}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {location.is_billing_entity && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          Billing Entity
                        </Badge>
                      )}
                      {location.location_gstin && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          GSTIN: {location.location_gstin}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Map View */}
                  {location.geo && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        <span className="text-xs font-medium text-gray-600">
                          {location.geo.lat.toFixed(6)},{" "}
                          {location.geo.lng.toFixed(6)}
                        </span>
                      </div>
                      <LocationMapView
                        location={location.geo}
                        height="180px"
                        interactive={false}
                      />
                    </div>
                  )}

                  {/* No map message */}
                  {!location.geo && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col items-center justify-center text-center">
                      <MapPin className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">
                        No map location set
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-500 mt-1"
                        onClick={() => handleEditLocation(location)}
                      >
                        Add map location
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {locations.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    {locations.length} location{locations.length > 1 ? "s" : ""}{" "}
                    configured
                  </span>
                </div>
                {locations.some((l) => l.is_headquarters) && (
                  <Badge variant="secondary">Headquarters Set</Badge>
                )}
              </div>
              {locations.some((l) => !l.geo) && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Some locations missing map coordinates
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
