"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to hospital selector for main domain auth access
    router.replace("/auth/selector");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to hospital selector...</p>
      </div>
    </div>
  );
}
