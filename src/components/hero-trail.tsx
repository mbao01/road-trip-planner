"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Ship, Plane } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const locations = [
  {
    name: "Paris",
    position: { top: "15%", left: "15%" },
    image: "/placeholder.svg?width=400&height=300",
    transportToNext: Plane,
  },
  {
    name: "The Maldives",
    position: { top: "50%", left: "40%" },
    image: "/placeholder.svg?width=400&height=300",
    transportToNext: Ship,
  },
  {
    name: "Tokyo",
    position: { top: "30%", left: "75%" },
    image: "/placeholder.svg?width=400&height=300",
    transportToNext: Plane,
  },
  {
    name: "New York",
    position: { top: "70%", left: "85%" },
    image: "/placeholder.svg?width=400&height=300",
  },
]

const Path = ({ from, to, transport: TransportIcon }) => {
  const pathRef = React.useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = React.useState(0)
  const { scrollYProgress } = useScroll({
    target: from,
    offset: ["start center", "end center"],
  })

  const pathOffset = useTransform(scrollYProgress, [0, 1], [1, 0])
  const pathLengthTransform = useTransform(scrollYProgress, [0, 1], [0, 1])

  React.useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [])

  return (
    <>
      <motion.path
        ref={pathRef}
        d={to}
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        style={{ pathLength: pathLengthTransform }}
        transition={{ duration: 0.5, ease: "linear" }}
      />
      {TransportIcon && (
        <motion.g style={{ offsetDistance: useTransform(pathOffset, (v) => `${v * 100}%`) }}>
          <motion.path d={to} fill="none" stroke="transparent" strokeWidth="20" />
          <g transform="translate(-12, -12)">
            <TransportIcon className="w-6 h-6 text-primary" />
          </g>
        </motion.g>
      )}
    </>
  )
}

const LocationMarker = ({ location }) => {
  const ref = React.useRef(null)
  return (
    <div
      ref={ref}
      id={location.name}
      className="absolute"
      style={{ top: location.position.top, left: location.position.left }}
    >
      <div className="group relative">
        <div className="w-4 h-4 rounded-full bg-primary border-2 border-background ring-2 ring-primary" />
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Card className="w-[250px] shadow-2xl">
            <CardContent className="p-0">
              <Image
                src={location.image || "/placeholder.svg"}
                width={250}
                height={180}
                alt={`Postcard from ${location.name}`}
                className="rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-heading font-semibold">{location.name}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function HeroTrail() {
  const fromRefs = React.useRef(locations.map(() => React.createRef<HTMLDivElement>()))

  return (
    <div className="relative w-full h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <Path from={fromRefs.current[0]} to="M 180 180 C 280 350, 350 350, 420 515" transport={Plane} />
          <Path from={fromRefs.current[1]} to="M 430 530 C 550 650, 650 450, 760 330" transport={Ship} />
          <Path from={fromRefs.current[2]} to="M 780 330 C 850 450, 850 600, 865 710" transport={Plane} />
        </svg>

        {locations.map((location, index) => (
          <div
            key={location.name}
            ref={fromRefs.current[index]}
            className="absolute"
            style={{ top: location.position.top, left: location.position.left }}
          >
            <LocationMarker location={location} />
          </div>
        ))}
      </div>
    </div>
  )
}
