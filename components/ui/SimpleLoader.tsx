"use client";

import React from 'react';
import MedicalLogo from './MedicalLogo';

interface SimpleLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SimpleLoader({ message = "Loading...", size = 'md' }: SimpleLoaderProps) {
  const sizes = {
    sm: { container: 'p-4', logo: 32, spinner: 'w-6 h-6' },
    md: { container: 'p-8', logo: 48, spinner: 'w-8 h-8' },
    lg: { container: 'p-12', logo: 64, spinner: 'w-12 h-12' }
  };
  
  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Medical logo */}
      <div className="relative">
        <div className="bg-blue-50 rounded-2xl p-3 flex items-center justify-center">
          <MedicalLogo width={currentSize.logo} height={currentSize.logo} />
        </div>
      </div>
      
      {/* Simple spinner */}
      <div className={`${currentSize.spinner} border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
      
      {/* Message */}
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <SimpleLoader message={message} size="lg" />
      </div>
    </div>
  );
}

export default SimpleLoader;
