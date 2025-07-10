"use client";

import type { TripWithSettings } from "@/lib/api";
import type { Day, Settings, Stop, Travel } from "@prisma/client";
import type { DateRange } from "react-day-picker";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import * as api from "@/lib/api";
import { formatCurrency } from "@/utilities/numbers";
import { Currency, DistanceUnit } from "@prisma/client";
import { format } from "date-fns";
import {
  BanknoteIcon,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  MapPin,
  Route,
} from "lucide-react";
import { SettingsModal } from "./settings-modal";
import { ShareModal } from "./share-modal";
import { TripHeader } from "./trip-header";
import { TripMap } from "./trip-map";
import { TripSidebar } from "./trip-sidebar";

interface TripPlannerClientProps {
  initialTripData: TripWithSettings | null;
  tripId: string;
}

export function TripPlannerClient({ initialTripData, tripId }: TripPlannerClientProps) {
  const [trip, setTrip] = useState<TripWithSettings | null>(initialTripData);
  const [isLoading, setIsLoading] = useState(!initialTripData);
  const [error, setError] = useState<string | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

    if (!initialTripData) {
      setIsLoading(true);
      Promise.allSettled([api.fetchTrip(tripId), api.fetchDays(tripId)])
        .then(([_trip, _days]) => {
          if (_trip.status === "fulfilled" && _days.status === "fulfilled") {
            setTrip({ ..._trip.value, ..._days.value });
          }
          setError(null);
        })
        .catch((e) => {
          setError("Failed to load trip data. Please try again later.");
          console.error(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, [initialTripData, tripId]);

  const handleUpdateSettings = async (
    newSettings: Omit<Settings, "id" | "tripId" | "createdAt" | "updatedAt">
  ) => {
    if (!trip) return;
    const previousTripData = trip;
    const updatedSettings = { ...trip.settings, ...newSettings };
    setTrip({ ...trip, settings: updatedSettings });

    try {
      await api.updateSettings(tripId, newSettings);
      toast({ title: "Settings updated" });
    } catch (e) {
      setTrip(previousTripData);
      toast({ variant: "destructive", title: "Failed to update settings" });
    }
  };

  const handleTripDetailsChange = async (data: {
    name?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    if (!trip) return;
    const previousTripData = trip;
    setTrip({ ...trip, ...data });

    try {
      await api.updateTripDetails(tripId, data);
      toast({ title: "Trip updated" });
    } catch (e) {
      setTrip(previousTripData);
      toast({ variant: "destructive", title: "Failed to update trip details" });
    }
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (!trip || !newDateRange?.from || !newDateRange?.to) return;
    handleTripDetailsChange({
      startDate: newDateRange.from,
      endDate: newDateRange.to,
    });
  };

  const stats = useMemo(() => {
    if (!trip)
      return {
        days: 0,
        stops: 0,
        distance: 0,
        hours: 0,
        countries: 1,
        cost: 0,
      };
    let totalStops = 0,
      totalDistance = 0,
      totalHours = 0,
      totalCost = 0;
    console.log("trip", trip);
    trip?.days?.forEach((day) => {
      totalStops += day.stops.length;

      day.stops.forEach((stop) => {
        if (stop.travel) {
          totalDistance += stop.travel.distance;
          totalCost += stop.travel.cost;
          totalHours += stop.travel.duration;
          // const distanceMatch = stop.driving.match(/(\d+\.?\d*)\s*(mi|km)/);
          // if (distanceMatch)
          //   totalDistance += Number.parseFloat(distanceMatch[1]);
          // const costMatch = stop.driving.match(/[£€$](\d+\.?\d*)/);
          // if (costMatch) totalCost += Number.parseFloat(costMatch[1]);
          // const hoursMatch = stop.driving.match(/(\d+)\s*hr/);
          // if (hoursMatch) totalHours += Number.parseInt(hoursMatch[1], 10);
          // const minutesMatch = stop.driving.match(/(\d+)\s*min/);
          // if (minutesMatch)
          //   totalHours += Number.parseInt(minutesMatch[1], 10) / 60;
        }
      });
    });

    return {
      days: trip.days.length,
      stops: totalStops,
      distance: Number.parseFloat(totalDistance.toFixed(1)),
      hours: Number.parseFloat(totalHours.toFixed(2)),
      countries: 1,
      cost: Number.parseFloat(totalCost.toFixed(2)),
    };
  }, [trip]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error || "Trip data could not be loaded."}</p>
      </div>
    );
  }

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Google Maps API key is missing.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-background">
        <div className="w-96 border-r bg-background flex flex-col">
          <TripHeader
            trip={trip}
            access={trip.access}
            onTripDataChange={(d) => handleTripDetailsChange(d)}
            onDateRangeChange={handleDateRangeChange}
            onSettings={() => setShowSettings(true)}
            onShare={() => setShowShare(true)}
          />
          <div className="p-4 border-b">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.days}</div>
                <div className="text-xs text-muted-foreground">days</div>
              </div>
              <div className="text-center">
                <MapPin className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.stops}</div>
                <div className="text-xs text-muted-foreground">stops</div>
              </div>
              <div className="text-center">
                <Route className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.distance}</div>
                <div className="text-xs text-muted-foreground">
                  {DISTANCE_UNITS[trip.settings.distanceUnit ?? DistanceUnit.MI]}
                </div>
              </div>
              <div className="text-center">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.hours}</div>
                <div className="text-xs text-muted-foreground">hours</div>
              </div>
              <div className="text-center">
                <Globe className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.countries}</div>
                <div className="text-xs text-muted-foreground">country</div>
              </div>
              <div className="text-center">
                <BanknoteIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.cost, { currency: trip.settings.currency ?? Currency.GBP })}
                </div>
                <div className="text-xs text-muted-foreground">cost</div>
              </div>
            </div>
          </div>
          <TripSidebar trip={trip} setTrip={setTrip} />
        </div>
        <div className="flex-1 relative">
          <TripMap
            mapStyle={trip.settings.mapStyle}
            stops={trip.days.flatMap((day) => day.stops)}
            googleMapsApiKey={googleMapsApiKey}
          />
        </div>
        <SettingsModal
          open={showSettings}
          onOpenChange={setShowSettings}
          tripName={trip.name}
          settings={trip.settings}
          onUpdateSettings={handleUpdateSettings}
        />
        <ShareModal open={showShare} onOpenChange={setShowShare} tripName={trip.name} />
      </div>
      <Toaster />
    </>
  );
}
