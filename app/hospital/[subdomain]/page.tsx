"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HospitalService, HospitalProfile } from "@/lib/hospital-service";
import HospitalLandingPage from "./components/HospitalLandingPage";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, AlertCircle } from "lucide-react";

export default function HospitalSubdomainPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHospital() {
      if (!subdomain) {
        setError("Invalid subdomain");
        setLoading(false);
        return;
      }

      try {
        const hospitalData = await HospitalService.getHospitalBySubdomain(
          subdomain
        );

        if (!hospitalData) {
          setError("Hospital not found");
        } else {
          setHospital(hospitalData);
        }
      } catch (err) {
        console.error("Error fetching hospital:", err);
        setError("Failed to load hospital information");
      } finally {
        setLoading(false);
      }
    }

    fetchHospital();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="p-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Hospital Portal
            </h2>
            <p className="text-gray-600">
              Please wait while we prepare your healthcare experience...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="p-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Hospital Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error ||
                "The hospital you are looking for does not exist or has been removed."}
            </p>
            <div className="text-sm text-gray-500">
              Subdomain:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{subdomain}</code>
            </div>
            <div className="mt-6">
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <HospitalLandingPage hospital={hospital} />;
}
