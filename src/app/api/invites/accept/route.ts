import { NextResponse } from "next/server";
import { inviteService } from "@/services/invite";

/**
 * POST /api/invites/accept
 * Accepts all invites for a user
 * @param req - The request object
 * @returns The collaborators for the user
 */
export async function POST() {
  const { collaborators } = await inviteService.acceptInvites();

  return NextResponse.json(collaborators);
}
