import { sendTripInviteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/services/trip";
import { TripRole } from "@prisma/client";
import { getUserById } from "./../user/index";

/**
 * Creates a trip invite
 * @param userId - The ID of the user who is inviting
 * @param tripId - The ID of the trip
 * @param email - The email of the user to invite
 * @param tripRole - The role of the user in the trip
 * @returns The created trip invite
 */
export const createTripInvite = async (
  userId: string,
  tripId: string,
  email: string,
  tripRole: TripRole
) => {
  const [trip, user] = await Promise.allSettled([getTripById(tripId), getUserById(userId)]);

  if (!trip.value || !user.value) {
    throw new Error("Trip or user not found");
  }

  const tripInvite = await prisma.tripInvite.create({
    data: {
      email,
      tripRole,
      tripId,
    },
  });

  await sendTripInviteEmail(email, trip.value.name, user.value.name);

  return tripInvite;
};

/**
 * Deletes a trip invite
 * @param tripId - The ID of the trip
 * @param email - The email of the user to invite
 * @returns The deleted trip invite
 */
export const deleteTripInvite = async (tripId: string, email: string) => {
  return prisma.tripInvite.delete({
    where: {
      tripId,
      email,
    },
  });
};

/**
 * Gets a trip invite
 * @param tripId - The ID of the trip
 * @param email - The email of the user to invite
 * @returns The trip invite
 */
export const getTripInvite = async (tripId: string, email: string) => {
  return prisma.tripInvite.findUnique({
    where: {
      tripId,
      email,
    },
  });
};

/**
 * Gets all trip invites for a trip
 * @param tripId - The ID of the trip
 * @returns The trip invites
 */
export const getTripInvites = async (tripId: string) => {
  return prisma.tripInvite.findMany({
    where: {
      tripId,
    },
  });
};
