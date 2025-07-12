"use client";

import type { FC } from "react";

interface TravelDetailsProps {
  details: string;
}

export const TravelDetails: FC<TravelDetailsProps> = ({ details }) => {
  if (!details) return null;

  return (
    <div className="flex items-center my-2 min-w-0">
      <div className="flex-grow h-px bg-gray-200"></div>
      <span className="px-2 text-xs text-muted-foreground whitespace-nowrap overflow-hidden truncate">
        {details}
      </span>
      <div className="flex-grow h-px bg-gray-200"></div>
    </div>
  );
};
