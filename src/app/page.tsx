import Link from "next/link"
import { ArrowRight, PlaneIcon as PaperPlane } from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

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
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="max-w-5xl">
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter">
              Make the most of travel
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
              The ultimate planner for your next adventure. Collaborate with friends, discover hidden gems, and build
              your perfect itinerary—all in one place.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={session?.user ? "/trips" : "/auth/signup"}>
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
