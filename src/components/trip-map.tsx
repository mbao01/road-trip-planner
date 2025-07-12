"use client";

/// <reference types="google.maps" />
import type { Settings, Stop } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapStyle } from "@prisma/client";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface TripMapProps {
  mapStyle: Settings["mapStyle"];
  stops: Stop[];
  googleMapsApiKey: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapStyleOptions = {
  [MapStyle.DEFAULT]: [],
  [MapStyle.HYBRID]: [],
  [MapStyle.TERRAIN]: [],
  [MapStyle.ROADMAP]: [
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#a5b493" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#fdfcf8" }],
    },
  ],
  [MapStyle.SATELLITE]: [], // Satellite is a mapTypeId, not a style array
};

export function TripMap({ mapStyle, stops, googleMapsApiKey }: TripMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [activeMarker, setActiveMarker] = useState<Stop | null>(null);

  const center = useMemo(() => {
    if (stops.length > 0) {
      return { lat: stops[0].latitude, lng: stops[0].longitude };
    }
    return { lat: 54.97825, lng: -1.61778 }; // Default to Newcastle
  }, [stops]);

  const directionsCallback = useCallback(
    (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === "OK" && response) {
        setDirectionsResponse(response);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    },
    []
  );

  const directionsRequest = useMemo(() => {
    if (stops.length < 2) {
      setDirectionsResponse(null);
      return null;
    }
    const origin = { lat: stops[0].latitude, lng: stops[0].longitude };
    const destination = {
      lat: stops[stops.length - 1].latitude,
      lng: stops[stops.length - 1].longitude,
    };
    const waypoints = stops.slice(1, -1).map((stop) => ({
      location: { lat: stop.latitude, lng: stop.longitude },
      stopover: true,
    }));

    return {
      origin,
      destination,
      waypoints,
      // TODO:: use stop travel mode here
      travelMode: "DRIVING" as google.maps.TravelMode.DRIVING,
    };
  }, [stops]);

  useEffect(() => {
    if (!map || stops.length === 0) return;

    if (stops.length === 1) {
      map.panTo({ lat: stops[0].latitude, lng: stops[0].longitude });
      map.setZoom(12);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    stops.forEach((stop) => {
      bounds.extend(new google.maps.LatLng(stop.latitude, stop.longitude));
    });
    map.fitBounds(bounds);
  }, [map, stops]);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: mapStyle ? mapStyleOptions[mapStyle] : mapStyleOptions[MapStyle.DEFAULT],
        mapTypeId: mapStyle === MapStyle.SATELLITE ? "satellite" : "roadmap",
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {stops.map((stop, index) => (
        <Marker
          key={stop.id}
          position={{ lat: stop.latitude, lng: stop.longitude }}
          label={{
            text: (index + 1).toString(),
            color: "white",
            fontWeight: "bold",
          }}
          onClick={() => setActiveMarker(stop)}
        />
      ))}

      {activeMarker && (
        <InfoWindow
          position={{ lat: activeMarker.latitude, lng: activeMarker.longitude }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div className="text-sm font-medium p-1">{activeMarker.name}</div>
        </InfoWindow>
      )}

      {directionsRequest && (
        <DirectionsService options={directionsRequest} callback={directionsCallback} />
      )}

      {directionsResponse && (
        <DirectionsRenderer
          options={{
            directions: directionsResponse,
            suppressMarkers: true, // We use our own custom markers
            polylineOptions: {
              strokeColor: "#f97316",
              strokeOpacity: 0.8,
              strokeWeight: 6,
            },
          }}
        />
      )}
    </GoogleMap>
  );
}
