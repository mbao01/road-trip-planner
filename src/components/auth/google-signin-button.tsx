"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ChromeIcon } from "lucide-react"

export function GoogleSignInButton() {
  const onClick = () => {
    signIn("google", { callbackUrl: "/trips" })
  }

  return (
    <Button variant="outline" className="w-full bg-transparent" onClick={onClick}>
      <ChromeIcon className="mr-2 h-4 w-4" />
      Sign In with Google
    </Button>
  )
}
