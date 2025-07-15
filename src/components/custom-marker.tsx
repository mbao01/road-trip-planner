"use client";

import type { Stop } from "@prisma/client";
import { StopTypeIcon } from "@/components/stop-type-icon";
import { cn } from "@/lib/utils";

interface CustomMarkerProps {
  stop: Stop;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export function CustomMarker({
  stop,
  index,
  isActive,
  isHovered,
  onClick,
  onMouseOver,
  onMouseOut,
}: CustomMarkerProps) {
  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{
        // Offset to center the marker pin
        transform: "translate(-50%, -100%)",
      }}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <div
        className={cn(
          "absolute -top-2 -right-2 z-10 transition-transform",
          isActive || isHovered ? "scale-110" : ""
        )}
      >
        <StopTypeIcon value={stop.stopEvent} isMapIcon />
      </div>
      <div
        className={cn("w-9 h-12 transition-transform", isActive || isHovered ? "scale-110" : "")}
        style={{
          clipPath:
            "path('M18 0C8.058 0 0 8.058 0 18C0 28.296 15.66 46.308 16.524 47.328C17.256 48.192 18.744 48.192 19.476 47.328C20.34 46.308 36 28.296 36 18C36 8.058 27.942 0 18 0Z')",
        }}
      >
        <div className="w-full h-full bg-orange-100 border border-orange-600/80 flex items-center justify-center pt-1">
          <span className="text-base font-bold text-orange-600">{index}</span>
        </div>
      </div>
    </div>
  );
}
