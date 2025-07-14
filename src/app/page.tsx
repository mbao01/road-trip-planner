import Link from "next/link"
import { PlaneIcon as PaperPlane } from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { HeroTrail } from "@/components/hero-trail"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <PaperPlane className="w-8 h-8 text-primary" />
          <span className="font-heading text-xl font-bold">Trip Planner</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {session?.user ? (
            <Button asChild>
              <Link href="/trips">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <HeroTrail />
      </main>
    </div>
  )
}
