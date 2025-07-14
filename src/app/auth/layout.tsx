import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session) {
    redirect("/"); // or wherever you want to send them
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {children}
    </main>
  );
}
