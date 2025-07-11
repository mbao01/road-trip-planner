"use client";

import type { TripWithSettings } from "@/lib/api";
import type { Settings, Travel, Trip } from "@prisma/client";
import type { DateRange } from "react-day-picker";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { DayWithStops } from "@/types/trip";
import { createTempId } from "@/utilities/identity";
import { formatCurrency } from "@/utilities/numbers";
import { Currency, DistanceUnit } from "@prisma/client";
import { addDays, differenceInDays } from "date-fns";
import { BanknoteIcon, Calendar, Clock, Globe, Loader2, MapPin, Route } from "lucide-react";
import { DeleteDaysConfirmationDialog } from "./delete-days-confirmation-dialog";
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
  const [daysToDeleteInfo, setDaysToDeleteInfo] = useState<{
    days: DayWithStops[];
    newDateRange: DateRange;
  } | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

    if (!initialTripData) {
      setIsLoading(true);
      api
        .fetchTrip(tripId)
        .then((trip) => {
          setTrip(trip);
          setError(null);
        })
        .catch((e) => {
          setError("Failed to load trip data. Please try again later.");
          console.error(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, [initialTripData, tripId]);

  // TODO:: use this method for all actions and pass it to children components
  const handleAction = async (
    action: () => Promise<unknown>,
    optimisticState: TripWithSettings,
    successMessage: string,
    failureMessage: string
  ) => {
    const originalState = trip;
    setTrip(optimisticState);
    try {
      await action();
      // const travel = await api.updateTripTravel(tripId);
      // const trip = await api.fetchTrip(tripId);
      const [travelPromise, tripPromise] = await Promise.allSettled([
        api.updateTripTravel(tripId),
        api.fetchTrip(tripId),
      ]);
      const travel =
        travelPromise.status === "fulfilled"
          ? travelPromise.value
          : (originalState?.travel ?? ({} as Travel));
      const trip = tripPromise.status === "fulfilled" ? tripPromise.value : undefined;

      setTrip({ ...optimisticState, ...trip, travel });
      toast({ title: successMessage });
    } catch (error) {
      setTrip(originalState);
      console.error(error);
      toast({ variant: "destructive", title: failureMessage });
    }
  };

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
      console.error(e);
      setTrip(previousTripData);
      toast({ variant: "destructive", title: "Failed to update settings" });
    }
  };

  const handleTripDetailsChange = async (
    data: Partial<Omit<Trip, "id" | "createdAt" | "updatedAt">>
  ) => {
    if (!trip) return;
    const previousTripData = trip;
    setTrip({ ...trip, ...data });

    try {
      await api.updateTripDetails(tripId, data);
      toast({ title: "Trip updated" });
    } catch (e) {
      setTrip(previousTripData);
      console.error(e);
      toast({ variant: "destructive", title: "Failed to update trip details" });
    }
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (!trip || !newDateRange?.from || !newDateRange?.to) return;

    const clone = structuredClone(trip);

    const oldDays = clone.days;
    const { from: startDate, to: endDate } = newDateRange;
    const newDayCount = differenceInDays(endDate, startDate) + 1;

    const updatedDays = oldDays
      .slice(0, Math.min(oldDays.length, newDayCount))
      .map((day, index) => ({
        ...day,
        date: addDays(startDate, index),
      }));

    let finalDays: DayWithStops[];

    if (newDayCount < oldDays.length) {
      const daysToRemove = oldDays.slice(newDayCount);
      const hasStopsInDaysToRemove = daysToRemove.some((d) => d.stops.length > 0);

      if (hasStopsInDaysToRemove) {
        setDaysToDeleteInfo({ days: daysToRemove, newDateRange });
        return; // skip because we require confirmation
      } else {
        finalDays = updatedDays.slice(0, newDayCount);
      }
    } else if (newDayCount > oldDays.length) {
      const additionalDays = Array.from({ length: newDayCount - oldDays.length }, (_, i) => {
        const dayIndex = oldDays.length + i;
        const tempId = createTempId(Date.now() + i);
        return {
          id: tempId,
          date: addDays(startDate, dayIndex),
          createdAt: new Date(),
          updatedAt: new Date(),
          tripId: clone.id,
          order: dayIndex,
          stops: [],
        };
      });
      finalDays = [...updatedDays, ...additionalDays];
    } else {
      finalDays = updatedDays;
    }

    clone.startDate = startDate;
    clone.endDate = endDate;
    clone.days = finalDays;

    handleAction(
      async () => {
        await api.updateTrip(trip.id, clone);
      },
      clone,
      "Date range updated",
      "Failed to update date range"
    );

    // handleUpdateTrip({ ...trip, days: finalDays, ...newDates }, "Date range updated");
  };

  const confirmDeleteExcessDays = () => {
    if (!trip || !daysToDeleteInfo?.newDateRange?.from || !daysToDeleteInfo?.newDateRange?.to)
      return;

    const clone = structuredClone(trip);

    const { from: startDate, to: endDate } = daysToDeleteInfo.newDateRange;
    const newDayCount = differenceInDays(endDate, startDate) + 1;
    const finalDays = clone.days.slice(0, newDayCount).map((day, index) => ({
      ...day,
      date: addDays(startDate, index),
    }));

    clone.startDate = startDate;
    clone.endDate = endDate;
    clone.days = finalDays;

    handleAction(
      () => api.updateTrip(trip.id, clone),
      clone,
      "Days deleted and date range updated",
      "Failed to update date range"
    );

    // handleUpdateTrip(
    //   { ...trip, days: finalDays, ...newDates },
    //   "Days deleted and date range updated"
    // );
    setDaysToDeleteInfo(null);
  };

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
    const { computed } = calculateTravelDetails("trip", trip.travel, trip.settings);
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
            onTripNameChange={({ name }) => handleTripDetailsChange({ name })}
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
      {daysToDeleteInfo && (
        <DeleteDaysConfirmationDialog
          open={!!daysToDeleteInfo}
          onOpenChange={() => setDaysToDeleteInfo(null)}
          onConfirm={confirmDeleteExcessDays}
          daysToDelete={daysToDeleteInfo.days}
        />
      )}
    </>
  );
}
