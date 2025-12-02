"use client";

import React from 'react';

interface MedicineCardProps {
  medication: any;
  onViewDetails?: (med: any) => void;
}

export default function MedicineCard({ medication, onViewDetails }: MedicineCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow flex flex-col justify-between">
      <div>
        <div className="text-2xl font-semibold">{medication?.pillImage ?? '💊'} {medication?.name}</div>
        <div className="text-sm text-slate-500 mt-1">{medication?.dosage} • {medication?.frequency}</div>
        <div className="text-xs text-slate-400 mt-2">Prescribed by {medication?.prescribedBy}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">Remaining: <span className="font-medium">{medication?.pillsRemaining ?? '-'}</span></div>
        <button
          onClick={() => onViewDetails?.(medication)}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-3 py-1 text-sm font-medium hover:bg-emerald-700"
        >
          View
        </button>
      </div>
    </div>
  );
}
