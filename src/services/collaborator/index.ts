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

const getCollaborators = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const collaborators = await collaboratorRepo.getCollaborators(tripId);

  return { collaborators };
};

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
