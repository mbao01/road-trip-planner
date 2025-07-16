import Link from "next/link";
import { HeroTitle } from "@/components/hero-title";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative flex flex-col bg-background text-white">
      <div className="relative z-20 flex flex-col flex-1 p-8 md:p-12 items-start">
        <div className="mx-auto flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="flex flex-col items-start text-left">
            <HeroTitle />
          </div>
          {/* <div className="w-full h-[60vh] max-h-[500px] md:h-auto md:min-h-[600px]">
            <FeatureShowcase />
          </div> */}
        </div>

        <div className="mt-auto flex flex-col items-center text-center w-full pb-3 pt-8">
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-stone-800">
            Your adventure, your way — plan, discover, and explore altogether with friends, all in
            one fun spot!
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href={session?.user ? "/trips" : "/auth/signup"}>
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
