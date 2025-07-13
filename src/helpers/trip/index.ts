import type { TripWithSettings } from "@/lib/api";
import type { DayWithStops } from "@/types/trip";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInDays } from "date-fns";
import { dayHelpers } from "../day";

/**
 * @param trip - The trip to update
 * @param dateRange - The new date range
 * @param setDaysToDeleteInfo - A callback function to set the days to delete and the new date range
 * @returns The updated trip
 */
const changeTripRange = (
  trip: TripWithSettings,
  dateRange: { from: Date; to: Date },
  setDaysToDeleteInfo?: (info: { days: DayWithStops[]; newDateRange: DateRange }) => void
) => {
  const clone = structuredClone(trip);

  const oldDays = clone.days;
  const { from: startDate, to: endDate } = dateRange;
  const newDayCount = differenceInDays(endDate, startDate) + 1;

  const updatedDays = oldDays.slice(0, Math.min(oldDays.length, newDayCount)).map((day, index) => ({
    ...day,
    date: addDays(startDate, index),
  }));

  let finalDays: DayWithStops[];

  if (newDayCount < oldDays.length) {
    const daysToRemove = oldDays.slice(newDayCount);
    const hasStopsInDaysToRemove = daysToRemove.some((d) => d.stops.length > 0);

    if (hasStopsInDaysToRemove) {
      setDaysToDeleteInfo?.({ days: daysToRemove, newDateRange: dateRange });
      return; // skip because we require confirmation
    } else {
      finalDays = updatedDays.slice(0, newDayCount);
    }
  } else if (newDayCount > oldDays.length) {
    const additionalDays = dayHelpers.createTripDays({
      size: newDayCount - oldDays.length, // no. of additional days
      tripId: clone.id,
      lastDayIndex: oldDays.length,
      firstDayStartDate: startDate,
    });
    finalDays = [...updatedDays, ...additionalDays];
  } else {
    finalDays = updatedDays;
  }

  clone.startDate = startDate;
  clone.endDate = endDate;
  clone.days = finalDays;

  return { clone };
};

export const tripHelpers = {
  changeTripRange,
};
