import {
  CreateTripArg,
  UpdateTripArg,
  UpdateTripDetailsArg,
} from "@/app/api/utilities/validation/schemas/trip";
import { prisma } from "@/lib/prisma";
import { isTempId } from "@/utilities/identity";
import { TripAccess, TripRole, TripStatus } from "@prisma/client";
import { addDays, differenceInDays } from "date-fns";

/**
 * @param tripId - The ID of the trip to retrieve
 * @returns The trip with the specified ID, or null if not found
 */
export const getTripById = async (tripId: string) => {
  return prisma.trip.findFirst({
    where: { id: tripId },
  });
};

/**
 * @param userId - The ID of the user to retrieve
 * @param tripId - The ID of the trip to retrieve
 * @returns The collaborator with the specified user ID and trip ID, or null if not found
 */
export const getTripCollaborator = async (userId: string, tripId: string) => {
  return prisma.collaborator.findFirst({
    where: { userId, tripId },
  });
};

const TRIP_QUERY_BASE_INCLUDE = {
  days: {
    orderBy: { date: "asc" },
    include: {
      stops: { orderBy: { order: "asc" }, include: { _count: true } },
    },
  },
  collaborators: {
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  },
  invites: { orderBy: { createdAt: "desc" } },
  _count: { select: { stops: true } },
} as const;

/**
 * @param userId - The ID of the user to retrieve
 * @returns An array of trips owned by the specified user
 */
export const getUserTrips = async (userId: string) => {
  const userTrips = await prisma.trip.findMany({
    where: {
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    include: TRIP_QUERY_BASE_INCLUDE,
    orderBy: { createdAt: "desc" },
  });

  return userTrips.map((trip) => {
    const isOwner = trip.ownerId === userId;
    const ownerId = isOwner ? trip.ownerId : null;
    const invites = isOwner ? trip.invites : null;
    const collaborators = ownerId
      ? trip.collaborators
      : trip.collaborators.filter((c) => c.userId === userId);

    return {
      invites,
      ownerId,
      id: trip.id,
      name: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
      status: trip.status,
      access: trip.access,

      // new properties of Trip type
      collaborators,
      collaboratorsCount: trip.collaborators.length,
      dayCount: trip.days.length,
      stopCount: trip.days.reduce((acc, day) => acc + day.stops.length, 0),
    };
  });
};

/**
 * @param userId - The ID of the user to retrieve
 * @param tripId - The ID of the trip to retrieve
 * @returns The trip with the specified ID and user ID, or null if not found
 */
export async function getUserTrip(userId: string, tripId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    include: {
      travel: true,
      settings: true,
      ...TRIP_QUERY_BASE_INCLUDE,
    },
  });

  if (!trip) {
    return trip;
  }

  const isOwner = trip.ownerId === userId;
  const ownerId = isOwner ? trip.ownerId : null;
  const invites = isOwner ? trip.invites : null;

  return { ...trip, invites, ownerId };
}

/**
 * @param tripId - The ID of the trip to update
 * @param data - The data to update the trip with
 * @returns The updated trip
 */
export async function updateTripWithDays(tripId: string, data: UpdateTripArg) {
  const trip = await prisma.$transaction(async (tx) => {
    // Expects data to have: days, startDate, endDate
    const { days = [], startDate, endDate } = data;
    // Find existing days
    const existingDays = await tx.day.findMany({ where: { tripId } });
    const daysToDelete = existingDays.filter((day) => !days.some((d) => d.id === day.id));

    // Update existing days
    // TODO:: in order to avoid a connection/pool timeout, confirm that this query is batched
    await Promise.allSettled(
      days
        .filter((day) => !isTempId(day.id))
        .map((day) =>
          tx.day.update({
            where: { id: day.id, tripId },
            data: { order: day.order, date: day.date },
          })
        )
    );

    // Delete removed days
    if (daysToDelete.length > 0) {
      await tx.day.deleteMany({
        where: { id: { in: daysToDelete.map((day) => day.id) } },
      });
    }

    // Update trip and create new days
    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        startDate,
        endDate,
        days: {
          createMany: {
            data: days
              .filter((d) => isTempId(d.id))
              .map((day) => ({ date: day.date, order: day.order })),
          },
        },
      },
    });

    return updatedTrip;
  });

  return trip;
}

/**
 * @param userId - The ID of the user to update the trip for
 * @param tripId - The ID of the trip to update
 * @param data - The data to update the trip with
 * @returns The updated trip
 */
export async function updateTripDetails(
  userId: string,
  tripId: string,
  data: UpdateTripDetailsArg
) {
  return prisma.trip.update({
    where: {
      id: tripId,
      collaborators: { some: { userId } },
    },
    data,
  });
}

/**
 * @param name - The name of the trip
 * @param startDate - The start date of the trip
 * @param endDate - The end date of the trip
 * @param ownerId - The ID of the owner of the trip
 * @param startStop - The start stop of the trip
 * @returns The created trip
 */
export async function createTrip({
  name,
  startDate,
  endDate,
  ownerId,
  startStop,
}: CreateTripArg & {
  ownerId: string;
}) {
  const trip = await prisma.$transaction(async (tx) => {
    const dayCount = differenceInDays(endDate, startDate) + 1;

    const newTrip = await tx.trip.create({
      data: {
        name,
        startDate,
        endDate,
        ownerId,
        status: TripStatus.NOT_STARTED,
        access: TripAccess.PRIVATE,
        settings: { create: {} },
        collaborators: {
          create: {
            userId: ownerId,
            tripRole: TripRole.OWNER,
          },
        },
      },
    });

    await tx.day.createMany({
      data: Array.from({ length: dayCount }, (_, i) => ({
        date: addDays(startDate, i),
        tripId: trip.id,
        order: i,
      })),
    });

    const day = await tx.day.findFirst({
      where: {
        tripId: trip.id,
        order: 0,
      },
    });

    if (day) {
      await tx.stop.create({
        data: {
          order: 0,
          name: startStop.name,
          tripId: trip.id,
          placeId: startStop.placeId,
          latitude: startStop.latitude,
          longitude: startStop.longitude,
          dayId: day.id,
        },
      });
    }

    return newTrip;
  });

  return trip;
}

/**
 * @param userId - The ID of the user to delete the trip for
 * @param tripId - The ID of the trip to delete
 * @returns The deleted trip
 */
export async function deleteTrip(userId: string, tripId: string) {
  return prisma.trip.delete({
    where: { id: tripId, ownerId: userId },
  });
}
