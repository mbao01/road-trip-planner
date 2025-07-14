import { sendTripInviteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { tripRepo } from "@/repository/trip";
import { userRepo } from "@/repository/user";
import { TripRole } from "@prisma/client";

/**
 * Accepts all trip invites for a user
 * @param userId - The ID of the user
 * @param email - The email of the user
 * @returns The collaborators created
 */
const acceptInvites = async (userId: string, email: string) => {
  const tripInvites = await getUserTripInvites(email);

  if (!tripInvites || tripInvites.length === 0) {
    return [];
  }

  const collaborators = await prisma.$transaction(async (tx) => {
    const collaborators = await tx.collaborator.createMany({
      data: tripInvites.map(({ tripId, tripRole }) => ({
        userId,
        tripId,
        tripRole,
      })),
    });

    await tx.tripInvite.deleteMany({
      where: {
        id: { in: tripInvites.map((invite) => invite.id) },
      },
    });

    return collaborators;
  });

  return collaborators;
};

/**
 * Creates a trip invite
 * @param userId - The ID of the user who is inviting
 * @param tripId - The ID of the trip
 * @param email - The email of the user to invite
 * @param tripRole - The role of the user in the trip
 * @returns The created trip invite
 */
const createTripInvite = async (
  userId: string,
  tripId: string,
  email: string,
  tripRole: TripRole
) => {
  const [trip, user] = await Promise.all([
    tripRepo.getTripById(tripId),
    userRepo.getUserById(userId),
  ]);

  if (!trip || !user) {
    throw new Error("Trip or user not found");
  }

  const tripInvite = await prisma.tripInvite.create({
    data: {
      email,
      tripRole,
      tripId,
    },
  });

  await sendTripInviteEmail(email, trip.name, user.name ?? "<concealed>", tripRole);

  return tripInvite;
};

/**
 * Deletes a trip invite
 * @param inviteId - The ID of the trip
 * @param tripId - The ID of the trip
 * @param email - The email of the user to invite
 * @returns The deleted trip invite
 */
const deleteTripInvite = async (tripId: string, inviteId: string, email: string) => {
  return prisma.tripInvite.delete({
    where: {
      id: inviteId,
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
const getTripInvite = async (tripId: string, email: string) => {
  return prisma.tripInvite.findFirst({
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
const getTripInvites = async (tripId: string) => {
  return prisma.tripInvite.findMany({
    where: {
      tripId,
    },
  });
};

/**
 * Gets all trip invites for a user
 * @param email - The email of the user
 * @returns The trip invites
 */
const getUserTripInvites = async (email: string) => {
  return prisma.tripInvite.findMany({
    where: {
      email,
    },
  });
};

export const inviteRepo = {
  acceptInvites,
  createTripInvite,
  deleteTripInvite,
  getTripInvite,
  getTripInvites,
  getUserTripInvites,
};
