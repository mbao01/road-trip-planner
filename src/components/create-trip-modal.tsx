"use client";

import type { PlaceSearchResult } from "@/lib/google-maps-api";
import type { Stop } from "@prisma/client";
import type React from "react";
import type { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { createTrip } from "@/lib/api";
import { getPlaceDetails, searchPlaces } from "@/lib/google-maps-api";
import { MAX__NO_OF_TRIP_DAYS } from "@/utilities/constants/date";
import { Loader2, Search, X } from "lucide-react";
import { DateRangePicker } from "./date-range-picker";

interface CreateTripModalProps {
  trigger: React.ReactNode;
}

export function CreateTripModal({ trigger }: CreateTripModalProps) {
  const [name, setName] = useState("");
  const [dates, setDates] = useState<DateRange | undefined>();
  const [startStopQuery, setStartStopQuery] = useState("");
  const [startStopResults, setStartStopResults] = useState<PlaceSearchResult[]>([]);
  const [selectedStartStop, setSelectedStartStop] = useState<Pick<
    Stop,
    "name" | "placeId" | "latitude" | "longitude"
  > | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const debouncedQuery = useDebounce(startStopQuery, 300);

  useEffect(() => {
    if (debouncedQuery && !selectedStartStop) {
      setIsSearching(true);
      searchPlaces(debouncedQuery)
        .then((res) => {
          setStartStopResults(res);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setStartStopResults([]);
    }
  }, [debouncedQuery, selectedStartStop]);

  const handleSelectStop = async (location: PlaceSearchResult) => {
    setStartStopQuery(location.name);
    setStartStopResults([]);
    setIsSearching(true);
    try {
      const details = await getPlaceDetails(location.id);
      setSelectedStartStop({
        name: details.name,
        placeId: details.id,
        latitude: details.latitude,
        longitude: details.longitude,
      });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Could not fetch location details." });
    } finally {
      setIsSearching(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartStopQuery(e.target.value);
    if (selectedStartStop && e.target.value !== selectedStartStop.name) {
      setSelectedStartStop(null);
    }
  };

  const handleSubmit = async () => {
    if (!name || !dates?.from || !dates?.to || !selectedStartStop) {
      toast({ variant: "destructive", title: "Please fill all fields" });
      return;
    }
    setIsCreating(true);
    try {
      const trip = await createTrip({
        name,
        startDate: dates.from,
        endDate: dates.to,
        startStop: selectedStartStop,
      });
      toast({ title: "Trip created successfully!" });

      // Reset form
      setName("");
      setDates(undefined);
      setStartStopQuery("");
      setSelectedStartStop(null);

      // open new trip
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to create trip", description: String(error) });
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = name && dates?.from && dates?.to && selectedStartStop;

  return (
    <Modal
      trigger={trigger}
      title="Create a new trip"
      footer={({ closeModal }) => (
        <>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isCreating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Trip
          </Button>
        </>
      )}
      className="sm:max-w-md"
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="trip-name">Trip name</Label>
          <Input
            id="trip-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Roadtrip"
          />
        </div>
        <div className="space-y-2">
          <Label>Trip dates</Label>
          <DateRangePicker
            date={dates}
            onDateChange={setDates}
            maxDays={MAX__NO_OF_TRIP_DAYS}
            triggerClassName="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-stop">Trip start point</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="start-stop"
              value={startStopQuery}
              onChange={handleQueryChange}
              placeholder="Search for a city"
              className="pl-9"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
            {startStopQuery && !selectedStartStop && !isSearching && (
              <button
                onClick={() => setStartStopQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {startStopResults.length > 0 && !selectedStartStop && (
            <div className="relative">
              <div className="absolute z-10 w-full mt-1 p-2 border bg-background rounded-md shadow-lg max-h-48 overflow-y-auto">
                <ul>
                  {startStopResults.map((loc) => (
                    <li key={loc.id}>
                      <button
                        onMouseDown={() => handleSelectStop(loc)}
                        className="w-full text-left p-2 rounded-md hover:bg-accent/40"
                      >
                        {loc.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
