import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { acceptInvites } from "@/services/invite";

export default async function TripsAcceptPage() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    return redirect("");
  }

  await acceptInvites(session?.user?.id, session?.user?.email);

  redirect("/");
}
