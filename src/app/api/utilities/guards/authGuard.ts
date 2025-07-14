import { auth } from "@/lib/auth";
import { StatusCodes } from "http-status-codes";
import { NextAuthRequest } from "next-auth";

export async function authGuard(req?: NextAuthRequest) {
  const session = req?.auth ?? (await auth());

  if (!session?.user?.id || !session.user.email) {
    throw new Error("Unauthorized", { cause: { status: StatusCodes.UNAUTHORIZED } });
  }

  const { user } = session;

  return {
    ...session,
    user: {
      ...user,
      id: session.user.id,
      email: session.user.email,
    },
  };
}
