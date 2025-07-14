"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react";
import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const onClick = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <Button variant="outline" className="w-full bg-transparent" onClick={onClick}>
      <ChromeIcon className="mr-2 h-4 w-4" />
      Sign In with Google
    </Button>
  );
}
