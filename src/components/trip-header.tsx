"use client";

import type React from "react";
import type { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TripFull } from "@/types/trip";
import { MAX__NO_OF_TRIP_DAYS } from "@/utilities/constants/date";
import { TripRole } from "@prisma/client";
import { isSameDay } from "date-fns";
import { CheckIcon, Download, Settings, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { DateRangePicker } from "./date-range-picker";
import { UserDropdown } from "./user-dropdown";

interface TripHeaderProps {
  trip: TripFull;
  onTripNameChange: (data: { name?: string }) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onSettings: () => void;
  onShare: () => void;
}

const roleBadgeColors: Record<TripRole, string> = {
  [TripRole.OWNER]: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  [TripRole.EDITOR]: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  [TripRole.VIEWER]: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  [TripRole.PUBLIC]: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
};

export function TripHeader({
  trip,
  onTripNameChange,
  onDateRangeChange,
  onSettings,
  onShare,
}: TripHeaderProps) {
  const session = useSession();
  const [name, setName] = useState(trip.name);
  const currentDateRange = {
    from: trip.startDate,
    to: trip.endDate,
  };
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
    currentDateRange
  );
  const collaborator = trip.collaborators.find((c) => c.userId === session.data?.user?.id);

  // Sync local state if props change from parent (e.g., after a successful save)
  useEffect(() => {
    setSelectedDateRange({ from: trip.startDate, to: trip.endDate });
  }, [trip.startDate, trip.endDate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    if (name !== trip.name) {
      onTripNameChange({ name });
    }
  };

  const handleSaveDates = () => {
    onDateRangeChange(selectedDateRange);
  };

  const handleCancelDates = () => {
    setSelectedDateRange(currentDateRange);
  };

  const isDateRangeChanged =
    !isSameDay(currentDateRange.from, selectedDateRange?.from || currentDateRange.from) ||
    !isSameDay(currentDateRange.to, selectedDateRange?.to || currentDateRange.to);

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link href="/trips">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button size="sm" onClick={onShare} className="bg-orange-500 hover:bg-orange-600">
            Share
          </Button>
          <UserDropdown />
        </div>
      </div>

      <div>
        <Input
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          className="!text-2xl font-bold mb-2 h-auto border-none focus-visible:ring-0 shadow-none p-1"
        />
        <div className="flex items-center gap-2">
          <DateRangePicker
            maxDays={MAX__NO_OF_TRIP_DAYS}
            date={selectedDateRange}
            onDateChange={setSelectedDateRange}
            triggerClassName="px-1 py-0"
          />
          {isDateRangeChanged && (
            <>
              <Button
                onClick={handleSaveDates}
                size="icon"
                variant="outline"
                aria-label="Save date changes"
                className="h-auto p-0.5 w-auto"
              >
                <CheckIcon className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              <Button
                onClick={handleCancelDates}
                size="icon"
                variant="outline"
                aria-label="Cancel date changes"
                className="h-auto p-0.5 w-auto"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </>
          )}

          {collaborator && (
            <Badge
              variant="outline"
              className={cn("font-medium ml-auto", roleBadgeColors[collaborator.tripRole])}
            >
              {collaborator.tripRole}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
