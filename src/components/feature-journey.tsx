"use client"
import { motion } from "framer-motion"
import { UserPlus, MapPin, ListChecks, Plane } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create an account to start planning your next adventure.",
    position: { top: "10%", left: "10%" },
  },
  {
    icon: MapPin,
    title: "Choose Destination",
    description: "Pick a place, or two, or ten! Your journey starts here.",
    position: { top: "35%", right: "10%" },
  },
  {
    icon: ListChecks,
    title: "Build Itinerary",
    description: "Add stops, book hotels, and organize your daily schedule.",
    position: { top: "60%", left: "15%" },
  },
  {
    icon: Plane,
    title: "Take Off!",
    description: "Share your plan, pack your bags, and get ready to explore.",
    position: { top: "85%", right: "15%" },
  },
]

const FeatureCard = ({ feature, index }) => (
  <motion.div
    className="absolute"
    style={{ ...feature.position }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
  >
    <Card className="w-64 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 bg-primary/20 rounded-md">
          <feature.icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

export function FeatureJourney() {
  return (
    <div className="relative w-full h-[150vh] my-24">
      <div className="sticky top-1/4 h-screen">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <motion.path
            d="M 220 150 C 400 150, 300 380, 500 380 C 700 380, 800 650, 650 650 C 500 650, 300 880, 500 880"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray="5 10"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </div>
  )
}
