import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { HeroTitle } from "@/components/hero-title"

export default async function Home() {
  const session = await auth()

  return (
    <main className="relative flex flex-col min-h-screen bg-background text-white">
      <Image
        src="/placeholder.svg?width=1920&height=1080"
        alt="Scenic travel background"
        fill
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 flex flex-col flex-1 p-8 md:p-12">
        <HeroTitle />

        <nav className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-2 sm:gap-4">
          {session?.user ? (
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/trips">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hover:bg-white/10">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black"
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        <div className="mt-auto flex flex-col items-center text-center w-full">
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            The ultimate planner for your next adventure. Collaborate with friends, discover hidden gems, and build your
            perfect itinerary—all in one place.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href={session?.user ? "/trips" : "/auth/signup"}>
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
