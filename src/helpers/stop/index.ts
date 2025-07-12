import { TripWithSettings } from "@/lib/api";
import { PlaceDetails } from "@/lib/google-maps-api";
import { createTempId } from "@/utilities/identity";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Day, Stop } from "@prisma/client";

const addStop = (trip: TripWithSettings, dayId: Day["id"], loc: PlaceDetails) => {
  const clone = structuredClone(trip);
  const day = clone.days.find((d) => d.id === dayId)!;

  const newStopData = {
    name: loc.name,
    placeId: loc.id,
    latitude: loc.latitude,
    longitude: loc.longitude,
    customName: null,
    order: day.stops.length,
    dayId: dayId,
    tripId: trip.id,
  };
  const tempId = createTempId();
  day.stops.push({ ...newStopData, id: tempId } as Stop);

  return {
    clone,
    newStopData,
  };
};

const deleteStop = (trip: TripWithSettings, dayId: Day["id"], stopId: Stop["id"]) => {
  const clone = structuredClone(trip);
  const day = clone.days.find((d) => d.id === dayId)!;
  day.stops = day.stops.filter((s) => s.id !== stopId);

  return { clone };
};

const reorderStop = (trip: TripWithSettings, srcDayId: Day["id"], dstDayId: Day["id"], activeId: UniqueIdentifier, overId: UniqueIdentifier) => {
  const clone = structuredClone(trip);
  const srcDay = clone.days.find((d) => d.id === srcDayId)!;
  const dstDay = clone.days.find((d) => d.id === dstDayId)!;

  if (srcDayId === dstDayId) {
    const oldIndex = srcDay.stops.findIndex((s) => `stop-${s.id}` === activeId);
    const newIndex = String(overId).startsWith("stop-")
      ? dstDay.stops.findIndex((s) => `stop-${s.id}` === overId)
      : dstDay.stops.length - 1;
    const [item] = srcDay.stops.splice(oldIndex, 1);
    srcDay.stops.splice(newIndex, 0, item);
  } else {
    const oldIndex = srcDay.stops.findIndex((s) => `stop-${s.id}` === activeId);
    const [moved] = srcDay.stops.splice(oldIndex, 1);
    if (String(overId).startsWith("stop-")) {
      const newIndex = dstDay.stops.findIndex((s) => `stop-${s.id}` === overId);
      dstDay.stops.splice(newIndex, 0, moved);
    } else {
      dstDay.stops.push(moved);
    }
  }

  return { clone };
};

export const stopHelpers = {
  addStop,
  deleteStop,
  reorderStop,
};
