import Image from "next/image";
import Link from "next/link";
import { HeroTitle } from "@/components/hero-title";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative flex flex-col min-h-screen bg-background text-white">
      <Image
        src="/placeholder.svg?width=1920&height=1080"
        alt="Scenic travel background"
        fill
        className="object-cover z-0"
      />

      <div className="relative z-20 flex flex-col flex-1 p-8 md:p-12 items-start">
        <HeroTitle />

        <div className="mt-auto flex flex-col items-center text-center w-full">
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            The ultimate planner for your next adventure. Collaborate with friends, discover hidden
            gems, and build your perfect itinerary—all in one place.
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
  );
}
