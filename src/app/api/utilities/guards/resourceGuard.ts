import { getTripById, getTripCollaborator } from "@/services/trip";
import { TripAccess, TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { authGuard } from "./authGuard";
import { Resource } from "./constants";

const TRIP_ROLES: Record<TripRole, TripRole[]> = {
  [TripRole.VIEWER]: [TripRole.VIEWER, TripRole.EDITOR, TripRole.OWNER],
  [TripRole.EDITOR]: [TripRole.EDITOR, TripRole.OWNER],
  [TripRole.OWNER]: [TripRole.OWNER],
  [TripRole.PUBLIC]: [TripRole.PUBLIC],
} satisfies Record<TripRole, TripRole[]>;

export async function resourceGuard(
  m: Record<
    Resource,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [x: string]: any;
      roles: string[];
    } & {}
  >
) {
  const session = await authGuard();
  const userId = session.user.id;
  const resources = Object.keys(m) as unknown as Resource[];

  if (resources.includes(Resource.TRIP)) {
    const { roles, tripId } = m[Resource.TRIP];
    if (!tripId) {
      throw new Error("Access denied", { cause: { status: StatusCodes.FORBIDDEN } });
    }

    // TODO:: get trip here (tripId, userId) -> compare tripRole from collaborators in there with required tripRole
    const trip = await getTripById(tripId);
    if (trip?.access !== TripAccess.PUBLIC) {
      const collaborator = await getTripCollaborator(userId, tripId);
      const hasAccess =
        collaborator?.tripRole &&
        roles.every((role) => TRIP_ROLES[role as TripRole].includes(collaborator.tripRole));

      if (!hasAccess) {
        throw new Error("Access denied", { cause: { status: StatusCodes.FORBIDDEN } });
      }
    }
  }

  return session;
}
