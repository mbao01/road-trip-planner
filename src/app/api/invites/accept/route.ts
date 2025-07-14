import { NextResponse } from "next/server";
import { acceptInvites } from "@/services/invite";
import { authGuard } from "../../utilities/guards";

/**
 * POST /api/invites/accept
 * Accepts all invites for a user
 * @param req - The request object
 * @returns The collaborators for the user
 */
export async function POST() {
  const session = await authGuard();

  if (!session || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const collaborators = await acceptInvites(session.user.id, session.user.email);

  return NextResponse.json(collaborators);
}
