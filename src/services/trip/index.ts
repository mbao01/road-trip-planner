import { prisma } from "@/lib/prisma";
import { isTempId } from "@/utilities/identity";
import { Role, TripStatus } from "@prisma/client";
import { addDays, differenceInDays, isAfter, isBefore } from "date-fns";

export const getTripsByUserId = async (userId: string) => {
  return prisma.trip.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          collaborators: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      days: {
        include: {
          stops: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
};

export async function getTripWithDetails(tripId: string, userId: string) {
  return prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    include: {
      days: {
        orderBy: { date: "asc" },
        include: {
          stops: { orderBy: { order: "asc" } },
        },
      },
      travel: true,
      settings: true,
      collaborators: { where: { userId } },
      _count: { select: { stops: true } },
    },
  });
}

export async function updateTrip(tripId: string, data: any) {
  return prisma.trip.update({ where: { id: tripId }, data });
}

export async function updateTripWithDays(tripId: string, data: any) {
  // Expects data to have: days, startDate, endDate
  const { days = [], startDate, endDate } = data;
  // Find existing days
  const existingDays = await prisma.day.findMany({ where: { tripId } });
  const daysToDelete = existingDays.filter((day) => !days.some((d: any) => d.id === day.id));

  // Update existing days
  await Promise.allSettled(
    days
      .filter((day: any) => !isTempId(day.id))
      .map((day: any) =>
        prisma.day.update({
          where: { id: day.id, tripId },
          data: { order: day.order, date: day.date },
        })
      )
  );

  // Delete removed days
  if (daysToDelete.length > 0) {
    await prisma.day.deleteMany({ where: { id: { in: daysToDelete.map((day: any) => day.id) } } });
  }

  // Update trip and create new days
  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      startDate,
      endDate,
      days: {
        createMany: {
          data: days
            .filter((d: any) => isTempId(d.id))
            .map((day: any) => ({ date: day.date, order: day.order })),
        },
      },
    },
  });

  return updatedTrip;
}

export async function deleteTrip(tripId: string) {
  return prisma.trip.delete({ where: { id: tripId } });
}

export async function updateTripDetails(tripId: string, data: any) {
  return prisma.trip.update({ where: { id: tripId }, data });
}

export async function getUserTrips(userId: string) {
  const userTrips = await prisma.trip.findMany({
    where: {
      OR: [{ ownerId: userId }, { collaborators: { some: { userId: userId } } }],
    },
    include: {
      days: { include: { stops: true } },
      collaborators: { where: { userId: userId } },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  return userTrips.map((trip) => {
    let tripStatus: TripStatus = TripStatus.NOT_STARTED;
    if (trip.status === TripStatus.ARCHIVED) {
      tripStatus = TripStatus.ARCHIVED;
    } else if (isBefore(now, trip.startDate)) {
      tripStatus = TripStatus.NOT_STARTED;
    } else if (isAfter(now, trip.endDate)) {
      tripStatus = TripStatus.COMPLETED;
    } else {
      tripStatus = TripStatus.IN_PROGRESS;
    }

    let access: Role = Role.OWNER;
    if (trip.ownerId !== userId) {
      const role = trip.collaborators[0]?.role;
      if (role === Role.EDITOR) access = Role.EDITOR;
      if (role === Role.VIEWER) access = Role.VIEWER;
    }

    return {
      id: trip.id,
      name: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      dayCount: trip.days.length,
      stopCount: trip.days.reduce((acc, day) => acc + day.stops.length, 0),
      status: tripStatus,
      access: access,
    };
  });
}

export async function createTripWithDaysAndStartStop({
  name,
  startDate,
  endDate,
  ownerId,
  startStop,
}: {
  name: string;
  startDate: Date;
  endDate: Date;
  ownerId: string;
  startStop: {
    name: string;
    placeId: string;
    latitude: number;
    longitude: number;
  };
}) {
  const dayCount = differenceInDays(endDate, startDate) + 1;
  const newTrip = await prisma.trip.create({
    data: {
      name,
      startDate,
      endDate,
      ownerId,
      settings: { create: {} },
    },
  });

  await prisma.day.createMany({
    data: Array.from({ length: dayCount }, (_, i) => ({
      date: addDays(startDate, i),
      tripId: newTrip.id,
      order: i,
    })),
  });

  const day = await prisma.day.findFirst({
    where: {
      tripId: newTrip.id,
      order: 0,
    },
  });

  if (day) {
    await prisma.stop.create({
      data: {
        order: 0,
        name: startStop.name,
        tripId: newTrip.id,
        placeId: startStop.placeId,
        latitude: startStop.latitude,
        longitude: startStop.longitude,
        dayId: day.id,
      },
    });
  }

  return { tripId: newTrip.id };
}
