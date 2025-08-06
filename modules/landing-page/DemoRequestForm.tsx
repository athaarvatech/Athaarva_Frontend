"use client";

import React from "react";

interface DemoRequestFormProps {
  onClose: () => void;
}

export default function DemoRequestForm({ onClose }: DemoRequestFormProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Request a Demo</h3>
        <p className="text-gray-600 mb-4">
          Thank you for your interest! Our team will contact you soon to schedule a demo.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-healthcare-primary text-white py-2 px-4 rounded-lg hover:bg-healthcare-teal transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
