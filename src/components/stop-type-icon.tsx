"use client";

import type { FC } from "react";
import { cn } from "@/lib/utils";
import { StopEvent } from "@prisma/client";
import { CameraIcon, Fuel, Moon, TreePine, Utensils } from "lucide-react";

export const STOP_TYPES = [
  {
    value: StopEvent.DEFAULT,
    icon: (isMapIcon = false) =>
      isMapIcon ? (
        <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow-md" />
      ) : (
        <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white" />
      ),
  },
  {
    value: StopEvent.OVERNIGHT,
    icon: (isMapIcon = false) => (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-blue-800 border-2 border-white shadow-md",
          isMapIcon ? "w-6 h-6" : "w-4 h-4"
        )}
      >
        <Moon className={cn("text-white", isMapIcon ? "w-3 h-3" : "w-2 h-2")} />
      </div>
    ),
  },
  {
    value: StopEvent.OUTDOOR_ACTIVITY,
    icon: (isMapIcon = false) => (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-green-600 border-2 border-white shadow-md",
          isMapIcon ? "w-6 h-6" : "w-4 h-4"
        )}
      >
        <TreePine className={cn("text-white", isMapIcon ? "w-3 h-3" : "w-2 h-2")} />
      </div>
    ),
  },
  {
    value: StopEvent.PLACE_OF_INTEREST,
    icon: (isMapIcon = false) => (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-teal-500 border-2 border-white shadow-md",
          isMapIcon ? "w-6 h-6" : "w-4 h-4"
        )}
      >
        <CameraIcon className={cn("text-white", isMapIcon ? "w-3 h-3" : "w-2 h-2")} />
      </div>
    ),
  },
  {
    value: StopEvent.FUEL,
    icon: (isMapIcon = false) => (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-red-500 border-2 border-white shadow-md",
          isMapIcon ? "w-6 h-6" : "w-4 h-4"
        )}
      >
        <Fuel className={cn("text-white", isMapIcon ? "w-3 h-3" : "w-2 h-2")} />
      </div>
    ),
  },
  {
    value: StopEvent.FOOD_AND_DRINK,
    icon: (isMapIcon = false) => (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-orange-500 border-2 border-white shadow-md",
          isMapIcon ? "w-6 h-6" : "w-4 h-4"
        )}
      >
        <Utensils className={cn("text-white", isMapIcon ? "w-3 h-3" : "w-2 h-2")} />
      </div>
    ),
  },
] as const;

export const StopTypeIcon: FC<{
  value: StopEvent | null;
  className?: string;
  isMapIcon?: boolean;
}> = ({ value, className, isMapIcon = false }) => {
  if (!value) return null;

  const type = STOP_TYPES.find((t) => t.value === value);
  if (!type) return null;
  return <div className={className}>{type?.icon(isMapIcon)}</div>;
};
