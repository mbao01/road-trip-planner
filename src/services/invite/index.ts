import { authGuard } from "@/app/api/utilities/guards";
import { inviteRepo } from "@/repository/invite";

/**
 * Accepts all trip invites for a user
 * @returns The collaborators created
 */
const acceptInvites = async () => {
  const session = await authGuard();

  const collaborators = await inviteRepo.acceptInvites(session.user.id, session.user.email);

  return { collaborators };
};

export const inviteService = {
  acceptInvites,
};
