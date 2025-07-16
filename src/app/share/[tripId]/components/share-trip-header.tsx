"use client";

import type { PublicTrip } from "@/types/trip";
import { useMemo } from "react";
import { TripAccessBadge } from "@/components/trip-access-badge";
import { Button } from "@/components/ui/button";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import { NormalizedSettings } from "@/helpers/settings";
import { formatDate } from "@/utilities/dates";
import { formatCurrency } from "@/utilities/numbers";
import {
  BanknoteIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  MapPinIcon,
  MoonIcon,
  RouteIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface ShareTripHeaderProps {
  trip: PublicTrip;
  settings: NormalizedSettings;
}

export function ShareTripHeader({ trip, settings }: ShareTripHeaderProps) {
  const { theme, setTheme } = useTheme();
  const stats = useMemo(() => {
    if (!trip) {
      return {
        days: 0,
        stops: 0,
        distance: 0,
        hours: 0,
        countries: 1,
        cost: 0,
      };
    }
    const { computed } = calculateTravelDetails("trip", trip.travel, settings);
    const totalStops = trip?.days?.reduce((acc, day) => acc + day.stops.length, 0);

    return {
      days: trip.days.length,
      stops: totalStops,
      distance: Number.parseFloat(computed.distance.value.toFixed(1)),
      hours: Number.parseFloat(
        (computed.duration.hours + computed.duration.minutes / 60).toFixed(1)
      ),
      countries: 1,
      cost: Number.parseFloat(computed.cost.value.toFixed(2)),
    };
  }, [trip, settings]);

  return (
    <header className="relative">
      <div className="absolute right-4 top-2">
        {theme === "dark" && (
          <Button size="icon" variant="ghost" onClick={() => setTheme("light")} className="h-4 w-4">
            <SunIcon className="h-4 w-4" />
          </Button>
        )}
        {(theme === "light" || theme === "system") && (
          <Button size="icon" variant="ghost" onClick={() => setTheme("dark")} className="h-4 w-4">
            <MoonIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
          <span className="ml-auto">
            <TripAccessBadge tripAccess={trip.access} />
          </span>
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <CalendarIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{stats.days}</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
          <div className="text-center">
            <MapPinIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{stats.stops}</div>
            <div className="text-xs text-muted-foreground">stops</div>
          </div>
          <div className="text-center">
            <RouteIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{stats.distance}</div>
            <div className="text-xs text-muted-foreground">
              {DISTANCE_UNITS[settings.distanceUnit]}
            </div>
          </div>
          <div className="text-center">
            <ClockIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{stats.hours}</div>
            <div className="text-xs text-muted-foreground">hours</div>
          </div>
          <div className="text-center">
            <GlobeIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{stats.countries}</div>
            <div className="text-xs text-muted-foreground">country</div>
          </div>
          <div className="text-center">
            <BanknoteIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">
              {formatCurrency(stats.cost, {
                currency: settings.currency,
              })}
            </div>
            <div className="text-xs text-muted-foreground">cost</div>
          </div>
        </div>
      </div>
    </header>
  );
}
