import { authGuard } from "@/app/api/utilities/guards";
import { inviteRepo } from "@/repository/invite";

const acceptInvites = async () => {
  const session = await authGuard();

  const collaborators = await inviteRepo.acceptInvites(session.user.id, session.user.email);

  return { collaborators };
};

export const inviteService = {
  acceptInvites,
};
