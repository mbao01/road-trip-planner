"use client";

import type { TripWithSettings } from "@/lib/api";
import type { PlaceDetails } from "@/lib/google-maps-api";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Day, Stop } from "@prisma/client";
import type React from "react";
import type { FC } from "react";
import { useState } from "react";
import { dayHelpers } from "@/helpers/day";
import { stopHelpers } from "@/helpers/stop";
import * as api from "@/lib/api";
import { createTempId } from "@/utilities/identity";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { addDays } from "date-fns";
import { DayCard } from "./day-card";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { StopCard } from "./stop-card";

// function getMockDrivingDetails(
//   fromStopName: string,
//   toStopName: string,
//   settings: Settings
// ): string {
//   const currencySymbol = CURRENCY_SYMBOLS[settings.currency ?? Currency.GBP];
//   const hash = (str: string) => {
//     let h = 0;
//     for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
//     return h;
//   };
//   const combinedHash = Math.abs(hash(fromStopName + toStopName));
//   let baseMiles = (combinedHash % 80) + 10 + (combinedHash % 100) / 100;
//   if (settings.avoidMotorways) baseMiles *= 1.15;
//   if (settings.avoidTolls) baseMiles *= 1.05;
//   const distance = settings.distanceUnit === DistanceUnit.KM ? baseMiles * 1.60934 : baseMiles;
//   let minutes = Math.floor(baseMiles * 1.5) + (combinedHash % 15);
//   if (settings.avoidMotorways) minutes += 15;
//   const hours = Math.floor(minutes / 60);
//   const remainingMinutes = minutes % 60;
//   let timeString = "";
//   if (hours > 0) timeString += `${hours} hr `;
//   timeString += `${remainingMinutes} min`;
//   let costString = "";
//   if (settings.calculateCosts) {
//     const GALLONS_PER_LITRE = 0.219969;
//     const cost =
//       settings.mpg && settings.fuelCostPerLitre
//         ? (baseMiles / settings.mpg) * (settings.fuelCostPerLitre / GALLONS_PER_LITRE)
//         : 0;
//     costString = ` (${currencySymbol}${cost.toFixed(2)})`;
//   }
//   return `Drive ${distance.toFixed(1)} ${settings.distanceUnit}${costString}, ${timeString.trim()}`;
// }

// --------------- Component ---------------
interface TripSidebarProps {
  trip: TripWithSettings;
  handleAction: (
    action: () => Promise<unknown>,
    optimisticState: TripWithSettings,
    successMessage: string,
    failureMessage: string
  ) => Promise<void>;
}

export const TripSidebar: FC<TripSidebarProps> = ({ trip, handleAction }) => {
  const [activeStop, setActiveStop] = useState<Stop | null>(null);
  const [dayToDelete, setDayToDelete] = useState<Day | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveStop(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const srcDayId = active.data.current?.dayId;
    const dstDayId = over.data.current?.day?.id || over.data.current?.dayId;
    if (!srcDayId || !dstDayId) return;

    const { clone } = stopHelpers.reorderStop(trip, srcDayId, dstDayId, active.id, over.id);

    handleAction(
      () => api.reorderTrip(trip.id, clone),
      clone,
      "Trip reordered",
      "Failed to reorder"
    );
  };

  const addStop = async (dayId: Day["id"], loc: PlaceDetails) => {
    const { clone, newStopData } = stopHelpers.addStop(trip, dayId, loc);

    handleAction(
      () => api.addStop(clone.id, dayId, newStopData as Omit<Stop, "id">),
      clone,
      "Stop added",
      "Failed to add stop"
    );
  };

  const deleteStop = (dayId: Day["id"], stopId: Stop["id"]) => {
    const { clone } = stopHelpers.deleteStop(trip, dayId, stopId);

    handleAction(
      async () => {
        await api.deleteStop(clone.id, stopId);
        await api.reorderTrip(clone.id, clone);
      },
      clone,
      "Stop deleted",
      "Failed to delete stop"
    );
  };

  const confirmDeleteDay = () => {
    if (!dayToDelete) return;
    const { clone } = dayHelpers.deleteDay(trip, dayToDelete.id);

    handleAction(
      async () => {
        await api.deleteDay(clone.id, dayToDelete.id);
        await api.updateTrip(clone.id, clone);
      },
      clone,
      "Day deleted",
      "Failed to delete day"
    );
    setDayToDelete(null);
  };

  const moveDay = (dayId: Day["id"], direction: "up" | "down") => {
    const { clone } = dayHelpers.moveDay(trip, dayId, direction);

    handleAction(() => api.reorderTrip(trip.id, clone), clone, "Day moved", "Failed to move day");
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
                travel={trip.travel}
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
              travel={trip.travel}
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
