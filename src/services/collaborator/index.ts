import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import {
  AddCollaboratorArg,
  addCollaboratorSchema,
  UpdateCollaboratorArg,
  updateCollaboratorSchema,
} from "@/app/api/utilities/validation/schemas/collaborator";
import { collaboratorRepo } from "@/repository/collaborator";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

/**
 * Gets a collaborator
 * @param collaboratorId - The ID of the collaborator
 * @returns The collaborator
 */
const getCollaborator = async ({
  collaboratorId,
  tripId,
}: {
  collaboratorId: string;
  tripId: string;
}) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const collaborator = await collaboratorRepo.getCollaborator(collaboratorId);

  return { collaborator };
};

/**
 * Gets collaborators for a trip
 * @param tripId - The ID of the trip
 * @returns The collaborators for the trip
 */
const getCollaborators = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const collaborators = await collaboratorRepo.getCollaborators(tripId);

  return { collaborators };
};

/**
 * Adds a collaborator to a trip
 * @param tripId - The ID of the trip
 * @param data - The data to add the collaborator with
 * @returns The added collaborator
 */
const addCollaborator = async ({ tripId }: { tripId: string }, data: AddCollaboratorArg) => {
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  const result = validator(data, addCollaboratorSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const collaborator = await collaboratorRepo.addCollaborator(tripId, session.user.id, result.data);
  return { collaborator };
};

/**
 * Updates a collaborator
 * @param tripId - The ID of the trip
 * @param collaboratorId - The ID of the collaborator
 * @param data - The data to update the collaborator with
 * @returns The updated collaborator
 */
const updateCollaborator = async (
  { collaboratorId, tripId }: { collaboratorId: string; tripId: string },
  data: UpdateCollaboratorArg
) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  const result = validator(data, updateCollaboratorSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const collaborator = await collaboratorRepo.updateCollaborator(
    tripId,
    collaboratorId,
    result.data
  );

  return { collaborator };
};

/**
 * Removes a collaborator from a trip
 * @param tripId - The ID of the trip
 * @param collaboratorId - The ID of the collaborator
 * @returns The removed collaborator
 */
const removeCollaborator = async ({
  collaboratorId,
  tripId,
}: {
  collaboratorId: string;
  tripId: string;
}) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  await collaboratorRepo.removeCollaborator(tripId, collaboratorId);
};

export const collaboratorService = {
  getCollaborator,
  getCollaborators,
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
};
