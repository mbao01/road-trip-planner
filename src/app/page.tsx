import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { ArrowRight, PlaneIcon as PaperPlane } from "lucide-react"
import Image from "next/image"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <PaperPlane className="w-8 h-8 text-primary" />
          <span className="font-heading text-xl font-bold">Trip Planner</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {session?.user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/trips">Dashboard</Link>
              </Button>
            </>
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Adventure, Perfectly Planned.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Stop dreaming, start exploring. The ultimate tool to craft your perfect itinerary, collaborate with
                    friends, and discover hidden gems. Your next great story starts here.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href={session?.user ? "/trips" : "/auth/signup"}>
                      Start Planning for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/images/trip-planner-hero.png"
                width="550"
                height="550"
                alt="Illustration of people on a road trip"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                query="vibrant and fun illustration of friends on a road trip, with a car and scenic background, in a modern flat style"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
