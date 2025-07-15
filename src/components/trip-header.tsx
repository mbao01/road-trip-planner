"use client";

import type { UserTrip } from "@/types/trip";
import type React from "react";
import type { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX__NO_OF_TRIP_DAYS } from "@/utilities/constants/date";
import { isSameDay } from "date-fns";
import { CheckIcon, Download, PlaneIcon as PaperPlane, Settings, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { AppLogo } from "./app-logo";
import { DateRangePicker } from "./date-range-picker";
import { TripRoleBadge } from "./trip-role-badge";
import { UserDropdown } from "./user-dropdown";

interface TripHeaderProps {
  trip: UserTrip;
  onTripNameChange: (data: { name?: string }) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onSettings: () => void;
  onShare: () => void;
}

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
          <Link href="/trips" className="flex items-center gap-1 text-foreground">
            {/* <PaperPlane className="w-8 h-8 text-primary" /> */}
            <AppLogo className="w-8 h-8 text-primary" />
            <span className="font-heading text-lg font-semibold">RTP</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            <span className="sr-only">Download</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onSettings}>
            <Settings className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button size="sm" onClick={onShare}>
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
          className="font-heading !text-2xl font-bold mb-2 h-auto border-none focus-visible:ring-0 shadow-none p-1"
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
                className="h-auto p-0.5 w-auto bg-transparent"
              >
                <CheckIcon className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              <Button
                onClick={handleCancelDates}
                size="icon"
                variant="outline"
                aria-label="Cancel date changes"
                className="h-auto p-0.5 w-auto bg-transparent"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </>
          )}

          {collaborator && (
            <span className="ml-auto">
              <TripRoleBadge tripRole={collaborator.tripRole} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
