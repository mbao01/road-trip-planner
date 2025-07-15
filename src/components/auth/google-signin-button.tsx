"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { signIn } from "next-auth/react";
import { siGoogle } from "simple-icons";

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const onClick = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <Button variant="outline" className="w-full bg-transparent" onClick={onClick}>
      <Icon src={siGoogle} className="mr-2 h-4 w-4" />
      Sign In with Google
    </Button>
  );
}
