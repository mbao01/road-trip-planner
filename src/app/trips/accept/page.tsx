import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { inviteRepo } from "@/repository/invite";

export default async function TripsAcceptPage() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    return redirect("");
  }

  await inviteRepo.acceptInvites(session?.user?.id, session?.user?.email);

  redirect("/");
}
