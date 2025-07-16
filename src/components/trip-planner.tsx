"use client";

import type { DayWithStops, UserTrip } from "@/types/trip";
import type { Settings, Travel, Trip } from "@prisma/client";
import type { DateRange } from "react-day-picker";
import { useMemo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import { dayHelpers } from "@/helpers/day";
import { settingsHelpers } from "@/helpers/settings";
import { tripHelpers } from "@/helpers/trip";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { formatCurrency } from "@/utilities/numbers";
import { BanknoteIcon, Calendar, Clock, Globe, MapPin, Route } from "lucide-react";
import { useSession } from "next-auth/react";
import { DeleteDaysConfirmationDialog } from "./delete-days-confirmation-dialog";
import { SettingsModal } from "./settings-modal";
import { ShareModal } from "./share-modal";
import { TripHeader } from "./trip-header";
import { TripMap } from "./trip-map";
import { TripSidebar } from "./trip-sidebar";

interface TripPlannerProps {
  trip: UserTrip;
}

export function TripPlanner({ trip: initialTrip }: TripPlannerProps) {
  const session = useSession();
  const [trip, setTrip] = useState<UserTrip>(initialTrip);
  const [daysToDeleteInfo, setDaysToDeleteInfo] = useState<{
    days: DayWithStops[];
    newDateRange: DateRange;
  } | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { toast } = useToast();
  const settings = settingsHelpers.getNormalizedSettings(trip.settings);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  /**
   * Handles an action that updates the trip and trip travel.
   * @param action The action to perform.
   * @param optimisticState The optimistic state to set.
   * @param successMessage The success message to display.
   * @param failureMessage The failure message to display.
   */
  const handleAction = async (
    action: () => Promise<unknown>,
    optimisticState: UserTrip,
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
          api.updateTripTravel(trip.id),
          api.fetchTrip(trip.id),
        ]);
        const travel =
          travelPromise.status === "fulfilled"
            ? travelPromise.value
            : (originalState?.travel ?? ({} as Travel));
        const updatedTrip = tripPromise.status === "fulfilled" ? tripPromise.value : undefined;

        setTrip({ ...optimisticState, ...updatedTrip, travel });
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
    clone.settings = { ...settings, ...newSettings };

    handleAction(
      // TODO upsert settings
      () => api.updateSettings(trip.id, newSettings),
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
      () => api.updateTripDetails(trip.id, data),
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

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        <p>Google Maps API key is missing.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-background">
        <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
          <Sidebar>
            <div className="w-96 border-r bg-background flex flex-col h-screen">
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
                      {DISTANCE_UNITS[settings.distanceUnit]}
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
                      {formatCurrency(stats.cost, {
                        currency: settings.currency,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">cost</div>
                  </div>
                </div>
              </div>

              <SidebarContent className="flex-1 p-0">
                <TripSidebar trip={trip} handleAction={handleAction} />
              </SidebarContent>
            </div>
          </Sidebar>
          <SidebarInset>
            <div className="absolute top-4 left-4 z-10">
              <SidebarTrigger className="bg-background text-primary rounded-sm" />
            </div>
            <div className="flex-1 relative w-full">
              <TripMap
                settings={settings}
                stops={trip.days.flatMap((day) => day.stops)}
                googleMapsApiKey={googleMapsApiKey}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
        <SettingsModal
          open={showSettings}
          onOpenChange={setShowSettings}
          tripName={trip.name}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
        <ShareModal
          trip={trip}
          userId={session.data?.user?.id}
          open={showShare}
          onOpenChange={setShowShare}
          onTripChange={(t) => setTrip({ ...trip, ...t })}
        />
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
