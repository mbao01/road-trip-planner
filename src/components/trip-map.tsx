"use client";

/// <reference types="google.maps" />
import type { Stop } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StopInfoWindow } from "@/components/stop-info-window";
import { NormalizedSettings } from "@/helpers/settings";
import { MapStyle } from "@prisma/client";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface TripMapProps {
  settings: NormalizedSettings;
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
  [MapStyle.SATELLITE]: [], // Satellite is a mapTypeId, not a style array
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
  [MapStyle.MINIMAL]: [
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#d3d3d3" }, { weight: 1 }],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e6e6e6" }, { weight: 0.5 }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [{ color: "#f7f7f7" }],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [{ visibility: "simplified" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#f5a66e" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#c9e6f5" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#999999" }],
    },
  ],
};

const getMarkerIcon = () => {
  const svg = `
    <svg viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C8.058 0 0 8.058 0 18C0 28.296 15.66 46.308 16.524 47.328C17.256 48.192 18.744 48.192 19.476 47.328C20.34 46.308 36 28.296 36 18C36 8.058 27.942 0 18 0Z" fill="#FFEDD5"/>
      <path d="M18 0.5C27.663 0.5 35.5 8.286 35.5 18C35.5 27.852 20.652 45.228 18.888 47.34C18.36 47.964 17.64 47.964 17.112 47.34C15.348 45.228 0.5 27.852 0.5 18C0.5 8.286 8.337 0.5 18 0.5Z" stroke="#F97316" stroke-opacity="0.8"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export function TripMap({ settings, stops, googleMapsApiKey }: TripMapProps) {
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

  const displayMarker = activeMarker;

  const handleCloseInfoWindow = () => {
    setActiveMarker(null);
  };

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
        styles: settings.mapStyle
          ? mapStyleOptions[settings.mapStyle]
          : mapStyleOptions[MapStyle.DEFAULT],
        mapTypeId: settings.mapStyle === MapStyle.SATELLITE ? "satellite" : "roadmap",
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
            color: "#F97316",
            fontWeight: "bold",
          }}
          icon={{
            url: getMarkerIcon(),
            scaledSize: new google.maps.Size(36, 48),
            anchor: new google.maps.Point(18, 48),
          }}
          zIndex={activeMarker?.id === stop.id ? 100 : index}
          onClick={() => setActiveMarker(stop)}
        />
      ))}

      {/* {activeMarker && (
        <InfoWindow
          position={{ lat: activeMarker.latitude, lng: activeMarker.longitude }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div className="text-sm font-medium p-1">{activeMarker.name}</div>
        </InfoWindow>
      )} */}

      {displayMarker && (
        <OverlayView
          position={{ lat: displayMarker.latitude, lng: displayMarker.longitude }}
          mapPaneName={OverlayView.FLOAT_PANE}
          getPixelPositionOffset={(width, height) => ({
            x: -(width / 2),
            y: -(height + 10),
          })}
        >
          <StopInfoWindow
            stop={displayMarker}
            settings={settings}
            onClose={handleCloseInfoWindow}
          />
        </OverlayView>
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
