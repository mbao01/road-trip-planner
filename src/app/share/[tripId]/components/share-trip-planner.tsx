"use client";

import type { PublicTrip } from "@/types/trip";
import type React from "react";
import { TripMap } from "@/components/trip-map";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NormalizedSettings } from "@/helpers/settings";
import { ShareTripSidebar } from "./share-trip-sidebar";

interface ShareTripPlannerProps {
  trip: PublicTrip;
  settings: NormalizedSettings;
}

export function ShareTripPlanner({ trip, settings }: ShareTripPlannerProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
        <Sidebar>
          <ShareTripSidebar trip={trip} settings={settings} />
        </Sidebar>
        <SidebarInset>
          <div className="absolute top-4 left-4 z-10">
            <SidebarTrigger className="bg-background text-primary rounded-sm" />
          </div>
          <div className="flex-1 relative w-full">
            <TripMap
              mapStyle={settings.mapStyle}
              stops={trip.days.flatMap((day) => day.stops)}
              googleMapsApiKey={googleMapsApiKey}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
