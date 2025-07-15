"use client";

import type { Stop } from "@prisma/client";
import { X } from "lucide-react";

interface StopInfoWindowProps {
  stop: Stop;
  onClose: () => void;
}

export function StopInfoWindow({ stop, onClose }: StopInfoWindowProps) {
  const [place, country] = stop.name.split(",").map((s) => s.trim());

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64 relative text-gray-900 font-sans">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-lg font-bold pr-6">{place}</h3>
      <p className="text-sm text-gray-500">{country || ""}</p>
    </div>
  );
}
