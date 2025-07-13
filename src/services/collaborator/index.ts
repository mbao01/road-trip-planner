import {
  AddCollaboratorArg,
  UpdateCollaboratorArg,
} from "@/app/api/utilities/validation/schemas/collaborator";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "../user";

export const getCollaborator = async (collaboratorId: string) => {
  return prisma.collaborator.findUnique({
    where: { id: collaboratorId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
};

export const getCollaborators = async (tripId: string) => {
  return prisma.collaborator.findMany({
    where: { tripId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
};

export const addCollaborator = async (tripId: string, data: AddCollaboratorArg) => {
  const user = await getUserByEmail(data.email);

  if (!user) {
    // check if user exists. If not, then send an email invite with the org they need to join.
    //  we may need to create a collaborator (but inactive)!!
    return;
  }

  const userId = user.id;

  return prisma.collaborator.create({
    data: {
      userId,
      tripId,
      tripRole: data.tripRole,
    },
  });
};

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

export const removeCollaborator = async (tripId: string, collaboratorId: string) => {
  return prisma.collaborator.delete({
    where: { id: collaboratorId, tripId },
  });
};
