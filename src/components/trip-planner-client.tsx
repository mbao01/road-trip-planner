"use client";

import type { Settings, Travel, Trip } from "@prisma/client";
import type { DateRange } from "react-day-picker";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import { dayHelpers } from "@/helpers/day";
import { tripHelpers } from "@/helpers/trip";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { DayWithStops, TripFull } from "@/types/trip";
import { formatCurrency } from "@/utilities/numbers";
import { Currency, DistanceUnit } from "@prisma/client";
import { BanknoteIcon, Calendar, Clock, Globe, Loader2, MapPin, Route } from "lucide-react";
import { DeleteDaysConfirmationDialog } from "./delete-days-confirmation-dialog";
import { SettingsModal } from "./settings-modal";
import { ShareModal } from "./share-modal";
import { TripHeader } from "./trip-header";
import { TripMap } from "./trip-map";
import { TripSidebar } from "./trip-sidebar";

interface TripPlannerClientProps {
  tripId: string;
}

export function TripPlannerClient({ tripId }: TripPlannerClientProps) {
  const [trip, setTrip] = useState<TripFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  }, [tripId]);

  /**
   * Handles an action that updates the trip and trip travel.
   * @param action The action to perform.
   * @param optimisticState The optimistic state to set.
   * @param successMessage The success message to display.
   * @param failureMessage The failure message to display.
   */
  const handleAction = async (
    action: () => Promise<unknown>,
    optimisticState: TripFull,
    successMessage: string,
    failureMessage: string,
    options: { refetchTripTravel?: boolean } = {}
  ) => {
    const { refetchTripTravel = true } = options;
    const originalState = trip;
    setTrip(optimisticState);
    try {
      await action();
      if (refetchTripTravel) {
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
      }
      toast({ title: successMessage });
    } catch (error) {
      setTrip(originalState);
      console.error(error);
      toast({ variant: "destructive", title: failureMessage });
    }
  };

  /**
   * Handles an update to the trip's settings.
   * @param newSettings The new settings.
   */
  const handleUpdateSettings = async (
    newSettings: Omit<Settings, "id" | "tripId" | "createdAt" | "updatedAt">
  ) => {
    if (!trip) return;
    const clone = structuredClone(trip);
    clone.settings = { ...clone.settings, ...newSettings };

    handleAction(
      () => api.updateSettings(tripId, newSettings),
      clone,
      "Settings updated",
      "Failed to update settings",
      { refetchTripTravel: false }
    );
  };

  /**
   * Handles a change in the trip's details.
   * @param data The new trip details.
   */
  const handleTripDetailsChange = async (
    data: Partial<Omit<Trip, "id" | "createdAt" | "updatedAt">>
  ) => {
    if (!trip) return;
    const clone = { ...structuredClone(trip), ...data };

    handleAction(
      () => api.updateTripDetails(tripId, data),
      clone,
      "Trip updated",
      "Failed to update trip details",
      { refetchTripTravel: false }
    );
  };

  /**
   * Handles a change in the trip's date range in other to update the trip days.
   * @param newDateRange The new date range.
   */
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (!trip || !newDateRange?.from || !newDateRange?.to) return;
    const { from, to } = newDateRange;
    const result = tripHelpers.changeTripRange(trip, { from, to }, setDaysToDeleteInfo);

    if (!result?.clone) return;

    handleAction(
      () => api.updateTrip(trip.id, result.clone),
      result.clone,
      "Date range updated",
      "Failed to update date range"
    );
  };

  /**
   * Handles the confirmation of deleting excess days with at least one of them having stop(s) in them.
   */
  const confirmDeleteExcessDays = () => {
    if (!trip || !daysToDeleteInfo?.newDateRange?.from || !daysToDeleteInfo?.newDateRange?.to)
      return;

    const { from, to } = daysToDeleteInfo.newDateRange;
    const { clone } = dayHelpers.pruneDays(trip, { from, to });

    handleAction(
      () => api.updateTrip(trip.id, clone),
      clone,
      "Days deleted and date range updated",
      "Failed to update date range"
    );

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
          <TripSidebar trip={trip} handleAction={handleAction} />
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
