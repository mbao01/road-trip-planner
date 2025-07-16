import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppLogo } from "@/components/app-logo";
import { auth } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session) {
    redirect("/"); // or wherever you want to send them
  }

  return (
    <main className="flex flex-col gap-6 min-h-screen items-center justify-center bg-background">
      <AppLogo className="text-primary w-16 h-16" />
      {children}
    </main>
  );
}
