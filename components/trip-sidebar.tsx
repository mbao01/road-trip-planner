"use client";

import type { TripWithSettings } from "@/lib/api";
import type { PlaceDetails } from "@/lib/google-maps-api";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Day, Settings, Stop } from "@prisma/client";
import type React from "react";
import type { FC } from "react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CURRENCY_SYMBOLS } from "@/helpers/constants/currency";
import * as api from "@/lib/api";
import { getDistanceMatrix } from "@/lib/google-maps-api";
import { StopWithTravel } from "@/types/trip";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Currency, DistanceUnit, Travel } from "@prisma/client";
import { addDays, format, parse } from "date-fns";
import { DayCard } from "./day-card";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { StopCard } from "./stop-card";

function getMockDrivingDetails(
  fromStopName: string,
  toStopName: string,
  settings: Settings
): string {
  const currencySymbol = CURRENCY_SYMBOLS[settings.currency ?? Currency.GBP];
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return h;
  };
  const combinedHash = Math.abs(hash(fromStopName + toStopName));
  let baseMiles = (combinedHash % 80) + 10 + (combinedHash % 100) / 100;
  if (settings.avoidMotorways) baseMiles *= 1.15;
  if (settings.avoidTolls) baseMiles *= 1.05;
  const distance = settings.distanceUnit === DistanceUnit.KM ? baseMiles * 1.60934 : baseMiles;
  let minutes = Math.floor(baseMiles * 1.5) + (combinedHash % 15);
  if (settings.avoidMotorways) minutes += 15;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  let timeString = "";
  if (hours > 0) timeString += `${hours} hr `;
  timeString += `${remainingMinutes} min`;
  let costString = "";
  if (settings.calculateCosts) {
    const GALLONS_PER_LITRE = 0.219969;
    const cost =
      settings.mpg && settings.fuelCostPerLitre
        ? (baseMiles / settings.mpg) * (settings.fuelCostPerLitre / GALLONS_PER_LITRE)
        : 0;
    costString = ` (${currencySymbol}${cost.toFixed(2)})`;
  }
  return `Drive ${distance.toFixed(1)} ${settings.distanceUnit}${costString}, ${timeString.trim()}`;
}

function recalculateTravelDetails(trip: TripWithSettings): TripWithSettings {
  const newTrip = structuredClone(trip);
  let previousStop: Stop | null = null;
  for (const day of newTrip.days) {
    for (const stop of day.stops) {
      if (previousStop === null) {
        stop.travel = undefined;
      } else {
        getDistanceMatrix(stop, previousStop);
        // TODO: Calculate travel details
        // stop.travel = getMockDrivingDetails(
        //   previousStop.name,
        //   stop.name,
        //   trip.settings
        // );
      }
      previousStop = stop;
    }
  }
  return newTrip;
}

// --------------- Component ---------------
interface TripSidebarProps {
  trip: TripWithSettings;
  setTrip: React.Dispatch<React.SetStateAction<TripWithSettings | null>>;
}

export const TripSidebar: FC<TripSidebarProps> = ({ trip, setTrip }) => {
  const [activeStop, setActiveStop] = useState<StopWithTravel | null>(null);
  const [dayToDelete, setDayToDelete] = useState<Day | null>(null);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleAction = async (
    action: () => Promise<any>,
    optimisticState: TripWithSettings,
    successMessage: string,
    failureMessage: string
  ) => {
    const originalState = trip;
    setTrip(optimisticState);
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      setTrip(originalState);
      console.error(error);
      toast({ variant: "destructive", title: failureMessage });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveStop(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const srcDayId = active.data.current?.dayId;
    const dstDayId = over.data.current?.day?.id || over.data.current?.dayId;
    if (!srcDayId || !dstDayId) return;

    const clone = structuredClone(trip);
    const srcDay = clone.days.find((d) => d.id === srcDayId)!;
    const dstDay = clone.days.find((d) => d.id === dstDayId)!;

    if (srcDayId === dstDayId) {
      const oldIndex = srcDay.stops.findIndex((s) => `stop-${s.id}` === active.id);
      const newIndex = String(over.id).startsWith("stop-")
        ? dstDay.stops.findIndex((s) => `stop-${s.id}` === over.id)
        : dstDay.stops.length - 1;
      const [item] = srcDay.stops.splice(oldIndex, 1);
      srcDay.stops.splice(newIndex, 0, item);
    } else {
      const oldIndex = srcDay.stops.findIndex((s) => `stop-${s.id}` === active.id);
      const [moved] = srcDay.stops.splice(oldIndex, 1);
      if (String(over.id).startsWith("stop-")) {
        const newIndex = dstDay.stops.findIndex((s) => `stop-${s.id}` === over.id);
        dstDay.stops.splice(newIndex, 0, moved);
      } else {
        dstDay.stops.push(moved);
      }
    }
    const recalculatedTrip = recalculateTravelDetails(clone);
    handleAction(
      () => api.reorderTrip(trip.id, recalculatedTrip),
      recalculatedTrip,
      "Trip reordered",
      "Failed to reorder"
    );
  };

  const addStop = async (dayId: Day["id"], loc: PlaceDetails) => {
    const clone = structuredClone(trip);
    const day = clone.days.find((d) => d.id === dayId)!;
    const newStopData = {
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      customName: null,
      order: day.stops.length,
      dayId: dayId,
      tripId: trip.id,
    };
    const tempId = Date.now().toString();
    day.stops.push({ ...newStopData, id: tempId } as StopWithTravel);
    const recalculatedTrip = recalculateTravelDetails(clone);
    setTrip(recalculatedTrip); // Optimistic update with temp ID

    try {
      const savedStop = await api.addStop(dayId, newStopData as Omit<Stop, "id">);
      // Replace temp stop with real one from server
      const finalTrip = structuredClone(recalculatedTrip);
      const finalDay = finalTrip.days.find((d) => d.id === dayId)!;
      const stopIndex = finalDay.stops.findIndex((s) => s.id === tempId);
      if (stopIndex !== -1) finalDay.stops[stopIndex] = savedStop;
      setTrip(recalculateTravelDetails(finalTrip));
      toast({ title: "Stop added" });
    } catch (error) {
      setTrip(trip); // Revert
      console.error(error);
      toast({ variant: "destructive", title: "Failed to add stop" });
    }
  };

  const deleteStop = (dayId: Day["id"], stopId: Stop["id"]) => {
    const clone = structuredClone(trip);
    const day = clone.days.find((d) => d.id === dayId)!;
    day.stops = day.stops.filter((s) => s.id !== stopId);
    const recalculatedTrip = recalculateTravelDetails(clone);
    handleAction(
      () => api.deleteStop(stopId),
      recalculatedTrip,
      "Stop deleted",
      "Failed to delete stop"
    );
  };

  const confirmDeleteDay = () => {
    if (!dayToDelete) return;
    const clone = structuredClone(trip);
    clone.days = clone.days.filter((d) => d.id !== dayToDelete.id);
    const recalculatedTrip = recalculateTravelDetails(clone);
    handleAction(
      () => api.deleteDay(dayToDelete.id),
      recalculatedTrip,
      "Day deleted",
      "Failed to delete day"
    );
    setDayToDelete(null);
  };

  const moveDay = (dayId: Day["id"], direction: "up" | "down") => {
    const clone = structuredClone(trip);
    const index = clone.days.findIndex((d) => d.id === dayId);
    if (index === -1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= clone.days.length) return; // Swap the days in the array
    [clone.days[index], clone.days[swapIndex]] = [clone.days[swapIndex], clone.days[index]];

    // Recalculate dates for all days based on the new order
    const { startDate } = trip;
    clone.days.forEach((day, i) => {
      day.date = addDays(startDate, i);
    });

    const recalculatedDays = recalculateTravelDetails(clone);
    handleAction(
      () => api.reorderTrip(trip.id, recalculatedDays),
      recalculatedDays,
      "Day moved",
      "Failed to move day"
    );
  };

  let stopCounter = 0;
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={(e) =>
          e.active.data.current?.type === "stop" && setActiveStop(e.active.data.current.stop)
        }
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {trip.days.map((day, i) => {
            const offset = stopCounter;
            stopCounter += day.stops.length;
            return (
              <DayCard
                key={day.id}
                day={day}
                stops={day.stops}
                dayIndex={i}
                totalDays={trip.days.length}
                stopNumberOffset={offset}
                onMoveDay={moveDay}
                onDeleteDay={() => setDayToDelete(day)}
                onAddStop={addStop}
                onDeleteStop={deleteStop}
                settings={trip.settings}
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeStop && (
            <StopCard
              stop={activeStop}
              dayId="0"
              stopNumber={0}
              settings={trip.settings}
              onDeleteStop={() => {}}
              isFirstStopOfTrip={false}
            />
          )}
        </DragOverlay>
      </DndContext>
      {dayToDelete && (
        <DeleteConfirmationDialog
          open
          onOpenChange={() => setDayToDelete(null)}
          onConfirm={confirmDeleteDay}
          dayNumber={trip.days.findIndex((d) => d.id === dayToDelete.id) + 1}
        />
      )}
    </>
  );
};
