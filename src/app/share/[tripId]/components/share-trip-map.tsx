"use client";

import type { PublicTrip } from "@/types/trip";
import { useMemo, useState } from "react";
import { CustomMarker } from "@/components/custom-marker";
import { TravelDetails } from "@/components/travel-details";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MAP_STYLES } from "@/helpers/settings";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ShareStopInfoWindow } from "./share-stop-info-window";

interface ShareTripMapProps {
  trip: PublicTrip;
}

export function ShareTripMap({ trip }: ShareTripMapProps) {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const bounds = useMemo(() => {
    const bounds = new window.google.maps.LatLngBounds();
    trip.days.forEach((day) => {
      day.stops.forEach((stop) => {
        bounds.extend({ lat: stop.latitude, lng: stop.longitude });
      });
    });
    return bounds;
  }, [trip]);

  const mapStyle = MAP_STYLES[trip.settings?.mapStyle];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="relative h-full w-full">
        <div className="absolute top-4 left-4 z-10">
          <SidebarTrigger />
        </div>
        <Map
          defaultZoom={10}
          defaultCenter={{ lat: 51.5072, lng: -0.1276 }}
          mapId={mapStyle.id}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={false}
          zoomControl={false}
          onTilesLoaded={({ map }) => {
            if (trip.days.flatMap((d) => d.stops).length > 0) {
              map.fitBounds(bounds, 100);
            }
          }}
        >
          {trip.days.map((day) =>
            day.stops.map((stop) => (
              <CustomMarker key={stop.id} stop={stop} onClick={() => setSelectedStopId(stop.id)} />
            ))
          )}

          {selectedStopId && (
            <ShareStopInfoWindow
              stop={trip.days.flatMap((d) => d.stops).find((s) => s.id === selectedStopId)!}
              onCloseClick={() => setSelectedStopId(null)}
            />
          )}

          {trip.travels.map((travel) => (
            <TravelDetails key={travel.id} travel={travel} />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
