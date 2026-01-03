"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Pill,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Truck,
  Store,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  Star,
  Navigation,
} from "lucide-react";

// Mock data for demonstration
const mockMedication = {
  id: 1,
  name: "Metformin",
  dosage: "500mg",
  frequency: "2x Daily",
  pillsLeft: 8,
  totalPills: 60,
  refillDue: "2025-08-08",
  lastRefilled: "2025-07-08",
  prescribingDoctor: "Dr. Priya Sharma",
  pharmacy: "Apollo Pharmacy",
};

const nearbyPharmacies = [
  {
    id: 1,
    name: "Apollo Pharmacy",
    distance: "0.5 km",
    rating: 4.8,
    price: "₹85",
    inStock: true,
    deliveryTime: "30 mins",
    address: "MG Road, Sector 14",
    phone: "+91 98765 43210",
    isPreferred: true,
  },
  {
    id: 2,
    name: "MedPlus",
    distance: "1.2 km",
    rating: 4.6,
    price: "₹78",
    inStock: true,
    deliveryTime: "45 mins",
    address: "City Center Mall",
    phone: "+91 98765 43211",
    isPreferred: false,
  },
  {
    id: 3,
    name: "1mg Pharmacy",
    distance: "2.1 km",
    rating: 4.7,
    price: "₹82",
    inStock: false,
    deliveryTime: "2-3 days",
    address: "Cyber City",
    phone: "+91 98765 43212",
    isPreferred: false,
  },
];

const RefillManagement = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedPharmacy, setSelectedPharmacy] = useState(nearbyPharmacies[0]);
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [quantity, setQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleRefillOrder = () => {
    setOrderConfirmed(true);
    // Here you would integrate with pharmacy APIs
    setTimeout(() => {
      router.push("/patient/medications");
    }, 3000);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#007C7C] mb-2">
              Order Confirmed! 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              Your refill for {mockMedication.name} has been ordered from{" "}
              {selectedPharmacy.name}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">
                  #MED{Date.now().toString().slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Estimated{" "}
                  {deliveryOption === "delivery" ? "Delivery" : "Pickup"}:
                </span>
                <span className="font-medium">
                  {selectedPharmacy.deliveryTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium text-[#007C7C]">
                  {selectedPharmacy.price}
                </span>
              </div>
            </div>
            <Button
              onClick={() => router.push("/patient/medications")}
              className="mt-6 bg-[#007C7C] hover:bg-[#006666]"
            >
              Back to Medicines
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#007C7C]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#007C7C] to-[#20B2AA] flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#007C7C]">
              Refill Medicine
            </h1>
          </div>
        </div>

        {/* Medicine Info */}
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💊</div>
                <div>
                  <h2 className="text-xl font-bold text-[#007C7C]">
                    {mockMedication.name}
                  </h2>
                  <p className="text-gray-600">
                    {mockMedication.dosage} • {mockMedication.frequency}
                  </p>
                  <p className="text-sm text-gray-500">
                    Prescribed by {mockMedication.prescribingDoctor}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-amber-100 text-amber-800 mb-2">
                  ⚠️ Refill Due
                </Badge>
                <p className="text-sm text-gray-600">
                  {mockMedication.pillsLeft} pills left
                </p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(mockMedication.refillDue).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#007C7C]" />
              Delivery Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deliveryOption === "delivery"
                  ? "border-[#007C7C] bg-[#F0F9FA]"
                  : "border-gray-200 hover:border-[#007C7C]"
              }`}
              onClick={() => setDeliveryOption("delivery")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#007C7C]" />
                  <div>
                    <h4 className="font-semibold">🚚 Home Delivery</h4>
                    <p className="text-sm text-gray-600">
                      Get medicines delivered to your doorstep
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#007C7C]">FREE</p>
                  <p className="text-xs text-gray-500">30-45 mins</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deliveryOption === "pickup"
                  ? "border-[#007C7C] bg-[#F0F9FA]"
                  : "border-gray-200 hover:border-[#007C7C]"
              }`}
              onClick={() => setDeliveryOption("pickup")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-[#007C7C]" />
                  <div>
                    <h4 className="font-semibold">🏪 Store Pickup</h4>
                    <p className="text-sm text-gray-600">
                      Collect from nearby pharmacy
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">INSTANT</p>
                  <p className="text-xs text-gray-500">Ready in 15 mins</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Pharmacies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#007C7C]" />
              Nearby Pharmacies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPharmacy.id === pharmacy.id
                    ? "border-[#007C7C] bg-[#F0F9FA]"
                    : "border-gray-200 hover:border-[#007C7C]"
                }`}
                onClick={() => setSelectedPharmacy(pharmacy)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#007C7C]">
                        {pharmacy.name}
                      </h4>
                      {pharmacy.isPreferred && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          ⭐ Preferred
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Navigation className="h-3 w-3 text-gray-500" />
                        <span>{pharmacy.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{pharmacy.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{pharmacy.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill className="h-3 w-3 text-gray-500" />
                        <span
                          className={
                            pharmacy.inStock ? "text-green-600" : "text-red-600"
                          }
                        >
                          {pharmacy.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {pharmacy.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-[#007C7C] mb-1">
                      {pharmacy.price}
                    </p>
                    <Button variant="outline" size="sm">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#007C7C]" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (months)</Label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border-2 border-[#E8F3F4] rounded-md focus:border-[#007C7C]"
                >
                  <option value={1}>1 month supply</option>
                  <option value={2}>2 months supply</option>
                  <option value={3}>3 months supply</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="flex items-center gap-2 p-2 border-2 border-[#E8F3F4] rounded-md">
                  <CreditCard className="h-4 w-4 text-[#007C7C]" />
                  <span>💳 UPI / Card</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F9FA] p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Medicine Cost:</span>
                <span>{selectedPharmacy.price}</span>
              </div>
              {deliveryOption === "delivery" && (
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-green-600">FREE</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-[#007C7C] border-t pt-2">
                <span>Total:</span>
                <span>{selectedPharmacy.price}</span>
              </div>
            </div>

            <Button
              onClick={handleRefillOrder}
              disabled={!selectedPharmacy.inStock}
              className="w-full bg-[#007C7C] hover:bg-[#006666] text-lg py-6"
            >
              {selectedPharmacy.inStock ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Order
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Out of Stock
                </>
              )}
            </Button>

            {!selectedPharmacy.inStock && (
              <p className="text-center text-sm text-gray-500">
                This medicine is currently out of stock at{" "}
                {selectedPharmacy.name}. Please select another pharmacy.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Auto-refill Option */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-800 mb-2">
                  🔄 Auto-Refill Service
                </h3>
                <p className="text-sm text-purple-700">
                  Never run out of medicines again! Get automatic refills before
                  you run out.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Enable Auto-Refill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefillManagement;
