import {
  AddCollaboratorArg,
  UpdateCollaboratorArg,
} from "@/app/api/utilities/validation/schemas/collaborator";
import { sendTripCollaboratorEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { inviteRepo } from "@/repository/invite";
import { tripRepo } from "@/repository/trip";
import { userRepo } from "@/repository/user";
import { TripRole } from "@prisma/client";

/**
 * Gets a collaborator
 * @param collaboratorId - The ID of the collaborator
 * @returns The collaborator
 */
const getCollaborator = async (collaboratorId: string) => {
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
const getCollaborators = async (tripId: string) => {
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
const addCollaborator = async (tripId: string, inviterId: string, data: AddCollaboratorArg) => {
  const [trip, inviter, collaboratorUser] = await Promise.all([
    tripRepo.getTripById(tripId),
    userRepo.getUserById(inviterId),
    userRepo.getUserByEmail(data.email),
  ]);

  if (!trip || !inviter) {
    throw new Error("Could not invite user");
  }

  // If the user doesn't exist, create an invite for them.
  if (!collaboratorUser?.email) {
    await inviteRepo.createTripInvite(inviterId, tripId, data.email, data.tripRole);
    return;
  }

  // If the user already exists, add them as a collaborator and send them an email.
  const newCollaborator = await createCollaborator(collaboratorUser.id, tripId, data.tripRole);

  await sendTripCollaboratorEmail(
    collaboratorUser.email,
    trip.id,
    trip.name,
    inviter.name ?? "<concealed>",
    data.tripRole
  );

  return newCollaborator;
};

/**
 * Creates a collaborator
 * @param userId - The ID of the user
 * @param tripId - The ID of the trip
 * @param tripRole - The role of the user in the trip
 * @returns The created collaborator
 */
const createCollaborator = async (userId: string, tripId: string, tripRole: TripRole) => {
  return prisma.collaborator.create({
    data: {
      userId,
      tripId,
      tripRole,
    },
  });
};

/**
 * Updates a collaborator
 * @param tripId - The ID of the trip
 * @param collaboratorId - The ID of the collaborator
 * @param data - The data to update the collaborator with
 * @returns The updated collaborator
 */
const updateCollaborator = async (
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
const removeCollaborator = async (tripId: string, collaboratorId: string) => {
  return prisma.collaborator.delete({
    where: { id: collaboratorId, tripId },
  });
};

export const collaboratorRepo = {
  getCollaborator,
  getCollaborators,
  addCollaborator,
  createCollaborator,
  updateCollaborator,
  removeCollaborator,
};
