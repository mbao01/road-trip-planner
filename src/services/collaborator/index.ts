import {
  AddCollaboratorArg,
  UpdateCollaboratorArg,
} from "@/app/api/utilities/validation/schemas/collaborator";
import { sendTripCollaboratorEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createTripInvite } from "../invite";
import { getTripById } from "../trip";
import { getUserByEmail, getUserById } from "../user";

/**
 * Gets a collaborator
 * @param collaboratorId - The ID of the collaborator
 * @returns The collaborator
 */
export const getCollaborator = async (collaboratorId: string) => {
  return prisma.collaborator.findUnique({
    where: { id: collaboratorId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
};

/**
 * Gets collaborators for a trip
 * @param tripId - The ID of the trip
 * @returns The collaborators for the trip
 */
export const getCollaborators = async (tripId: string) => {
  return prisma.collaborator.findMany({
    where: { tripId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
};

/**
 * Adds a collaborator to a trip
 * @param tripId - The ID of the trip
 * @param adderUserId - The ID of the user adding the collaborator
 * @param data - The data to add the collaborator with
 * @returns The added collaborator or trip invite
 */
export const addCollaborator = async (
  tripId: string,
  inviterId: string,
  data: AddCollaboratorArg
) => {
  const [trip, inviter, collaboratorUser] = await Promise.all([
    getTripById(tripId),
    getUserById(inviterId),
    getUserByEmail(data.email),
  ]);

  if (!trip || !inviter) {
    throw new Error("Could not invite user");
  }

  // If the user doesn't exist, create an invite for them.
  if (!collaboratorUser?.email) {
    return createTripInvite(inviterId, tripId, data.email, data.tripRole);
  }

  // If the user already exists, add them as a collaborator and send them an email.
  const newCollaborator = await prisma.collaborator.create({
    data: {
      userId: collaboratorUser.id,
      tripId,
      tripRole: data.tripRole,
    },
  });

  await sendTripCollaboratorEmail(
    collaboratorUser.email,
    trip.name,
    inviter.name ?? "<concealed>",
    data.tripRole
  );

  return newCollaborator;
};

/**
 * Updates a collaborator
 * @param tripId - The ID of the trip
 * @param collaboratorId - The ID of the collaborator
 * @param data - The data to update the collaborator with
 * @returns The updated collaborator
 */
export const updateCollaborator = async (
  tripId: string,
  collaboratorId: string,
  data: UpdateCollaboratorArg
) => {
  return prisma.collaborator.update({
    where: { id: collaboratorId, tripId },
    data,
  });
};

/**
 * Removes a collaborator from a trip
 * @param tripId - The ID of the trip
 * @param collaboratorId - The ID of the collaborator
 * @returns The removed collaborator
 */
export const removeCollaborator = async (tripId: string, collaboratorId: string) => {
  return prisma.collaborator.delete({
    where: { id: collaboratorId, tripId },
  });
};
