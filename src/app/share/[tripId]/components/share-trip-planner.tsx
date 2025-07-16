"use client";

import type { PublicTrip } from "@/types/trip";
import type React from "react";
import { TripMap } from "@/components/trip-map";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarToggle,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NormalizedSettings } from "@/helpers/settings";
import { ArrowBigUpDashIcon } from "lucide-react";
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
          <SidebarToggle>
            {({ open, openMobile, toggleSidebar }) =>
              !open && !openMobile ? (
                <div className="absolute top-1/2 -translate-y-1/2 z-50 -left-14">
                  <Button
                    size="sm"
                    className="transform rotate-90 cursor-pointer rounded-b-none text-white"
                    onClick={toggleSidebar}
                  >
                    <ArrowBigUpDashIcon className="w-4 h-4" />
                    Open Itinerary
                  </Button>
                </div>
              ) : null
            }
          </SidebarToggle>
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
    </div>
  );
}
