import { UserTrip } from "@/types/trip";
import { createTempId } from "@/utilities/identity";
import { Day } from "@prisma/client";
import { addDays, differenceInDays } from "date-fns";

const createTripDays = ({
  size,
  tripId,
  lastDayIndex,
  firstDayStartDate,
}: {
  size: number;
  tripId: string;
  lastDayIndex: number;
  firstDayStartDate: Date;
}) => {
  const days = Array.from({ length: size }, (_, i) => {
    const dayIndex = lastDayIndex + i;
    const tempId = createTempId(Date.now() + i);
    return {
      tripId,
      id: tempId,
      order: dayIndex,
      date: addDays(firstDayStartDate, dayIndex),
      createdAt: new Date(),
      updatedAt: new Date(),
      stops: [],
    };
  });

  return days;
};

const deleteDay = (trip: UserTrip, dayId: Day["id"]) => {
  const clone = structuredClone(trip);

  if (clone.days.length <= 1) {
    return { clone };
  }

  clone.days = clone.days
    .filter((d) => d.id !== dayId)
    .map((day, index) => {
      day.date = addDays(clone.startDate, index);
      return day;
    });
  clone.startDate = clone.days[0].date;
  clone.endDate = clone.days[clone.days.length - 1].date;

  return { clone };
};

// const deleteDays = (trip: UserTrip, dayId: Day["id"]) => {
//   const clone = structuredClone(trip);
//   const { from: startDate, to: endDate } = daysToDeleteInfo.newDateRange;
//   const newDayCount = differenceInDays(endDate, startDate) + 1;
//   const finalDays = clone.days.slice(0, newDayCount).map((day, index) => ({
//     ...day,
//     date: addDays(startDate, index),
//   }));
//   clone.startDate = startDate;
//   clone.endDate = endDate;
//   clone.days = finalDays;
//   return { clone };
// };

/**
 * Deletes days outside the given range
 * @param trip
 * @param dayId
 * @returns
 */
const pruneDays = (trip: UserTrip, dateRange: { from: Date; to: Date }) => {
  const clone = structuredClone(trip);

  const { from: startDate, to: endDate } = dateRange;
  const newDayCount = differenceInDays(endDate, startDate) + 1;
  const finalDays = clone.days.slice(0, newDayCount).map((day, index) => ({
    ...day,
    date: addDays(startDate, index),
  }));

  clone.startDate = startDate;
  clone.endDate = endDate;
  clone.days = finalDays;

  return { clone };
};

const moveDay = (trip: UserTrip, dayId: Day["id"], direction: "up" | "down") => {
  const clone = structuredClone(trip);
  const index = clone.days.findIndex((d) => d.id === dayId);

  if (index === -1) {
    return { clone };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= clone.days.length) {
    return { clone }; // Swap the days in the array
  }
  [clone.days[index], clone.days[swapIndex]] = [clone.days[swapIndex], clone.days[index]];

  // Recalculate dates for all days based on the new order
  const { startDate } = trip;
  clone.days.forEach((day, i) => {
    day.date = addDays(startDate, i);
  });

  return { clone };
};

export const dayHelpers = {
  createTripDays,
  deleteDay,
  moveDay,
  pruneDays,
};
