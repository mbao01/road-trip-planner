import Link from "next/link"
import { ArrowRight, PlaneIcon as PaperPlane } from "lucide-react"

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
            <Button asChild variant="ghost">
              <Link href="/trips">Dashboard</Link>
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
        <section className="w-full pt-24">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col justify-center space-y-4 max-w-3xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Your Adventure, Perfectly Planned.
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                  Stop dreaming, start exploring. The ultimate tool to craft your perfect itinerary, collaborate with
                  friends, and discover hidden gems. Your next great story starts here.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button asChild size="lg">
                  <Link href={session?.user ? "/trips" : "/auth/signup"}>
                    Start Planning for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <HeroTrail />
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">More to Explore</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center mt-4">
              This is where more content about your app's features can go.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
