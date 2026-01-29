"use client";

import React from "react";

// Base interface for medication panel - accepts objects with at least these properties
interface BaseMedication {
  id: number;
  name: string;
  dosage: string;
  purpose?: string;
  pillsRemaining?: number;
  notes?: string;
}

interface MedicinePanelProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  medication: (BaseMedication & Record<string, any>) | null;
  onClose: () => void;
  onMarkTaken?: (id: number) => void;
  onRequestRefill?: (
    id: number,
    quantity: number,
    preferredDate: string
  ) => void;
}

export default function MedicinePanel({
  isOpen,
  medication,
  onClose,
  onMarkTaken,
  onRequestRefill,
}: MedicinePanelProps) {
  if (!isOpen || !medication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:w-2/3 lg:w-1/2 bg-white rounded-t-xl md:rounded-xl p-6 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{medication.name}</h3>
          <button onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500">Dosage</div>
            <div className="font-medium">{medication.dosage}</div>

            {medication.purpose && (
              <>
                <div className="text-sm text-slate-500 mt-3">Purpose</div>
                <div className="font-medium">{medication.purpose}</div>
              </>
            )}
          </div>

          <div>
            {medication.pillsRemaining !== undefined && (
              <>
                <div className="text-sm text-slate-500">Remaining</div>
                <div className="font-medium">{medication.pillsRemaining}</div>
              </>
            )}
            <div className="mt-3">
              <button
                onClick={() => onMarkTaken?.(medication.id)}
                className="mr-2 inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-3 py-1 text-sm font-medium hover:bg-emerald-700"
              >
                Mark Taken
              </button>
              <button
                onClick={() =>
                  onRequestRefill?.(
                    medication.id,
                    30,
                    new Date().toISOString().slice(0, 10)
                  )
                }
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium"
              >
                Request Refill
              </button>
            </div>
          </div>
        </div>

        {medication.notes && (
          <div className="mt-6 text-sm text-slate-500">
            Notes: {medication.notes}
          </div>
        )}
      </div>
    </div>
  );
}
