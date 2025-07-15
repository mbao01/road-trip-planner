"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarDays, Car, Map, PenSquare, UserPlus } from "lucide-react";

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function AnimatedJourney() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-labelledby="journey-title"
        role="img"
      >
        <title id="journey-title">An illustration of the trip planning journey.</title>
        <defs>
          <motion.path
            id="journey-path"
            d="M 50,50 C 150,50 150,150 250,150 S 350,50 350,50 M 50,200 C 150,200 50,350 150,350 S 350,250 350,250"
            stroke="hsl(var(--brand-foreground) / 0.1)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </defs>

        {/* Use the path definition for the animation */}
        <use href="#journey-path" />

        {/* Icons */}
        <motion.g
          transform="translate(40, 40)"
          variants={iconVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          <circle r="20" fill="hsl(var(--brand-background))" />
          <UserPlus className="text-brand-foreground" x="-12" y="-12" width="24" height="24" />
        </motion.g>

        <motion.g
          transform="translate(250, 150)"
          variants={iconVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.8 }}
        >
          <circle r="20" fill="hsl(var(--brand-background))" />
          <Map className="text-brand-foreground" x="-12" y="-12" width="24" height="24" />
        </motion.g>

        <motion.g
          transform="translate(350, 50)"
          variants={iconVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 1.2 }}
        >
          <circle r="20" fill="hsl(var(--brand-background))" />
          <PenSquare className="text-brand-foreground" x="-12" y="-12" width="24" height="24" />
        </motion.g>

        <motion.g
          transform="translate(150, 350)"
          variants={iconVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 1.6 }}
        >
          <circle r="20" fill="hsl(var(--brand-background))" />
          <CalendarDays className="text-brand-foreground" x="-12" y="-12" width="24" height="24" />
        </motion.g>

        <motion.g
          transform="translate(350, 250)"
          variants={iconVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 2 }}
        >
          <circle r="20" fill="hsl(var(--brand-background))" />
          <Car className="text-brand-foreground" x="-12" y="-12" width="24" height="24" />
        </motion.g>
      </svg>
    </div>
  );
}
