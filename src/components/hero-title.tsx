"use client"

import { motion } from "framer-motion"

const svgVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const textVariants = {
  hidden: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -200 : 200,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
}

export function HeroTitle() {
  return (
    <motion.svg
      viewBox="0 0 1350 950"
      className="w-[55vw]"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
    >
      <g
        fontFamily="var(--font-lexend), sans-serif"
        fontWeight="800"
        letterSpacing="-0.05em"
        fontSize="250"
        fill="#4b1800"
      >
        <motion.text x="0" y="200" custom="left" variants={textVariants}>
          MAKE
        </motion.text>
        <motion.text x="0" y="420" custom="right" variants={textVariants}>
          THE MOST
        </motion.text>
        <motion.text x="0" y="640" custom="left" variants={textVariants}>
          OF
        </motion.text>
        <motion.text x="0" y="860" custom="right" variants={textVariants}>
          TRAVEL
        </motion.text>
      </g>
    </motion.svg>
  )
}
