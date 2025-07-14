export function HeroTitle() {
  return (
    <svg viewBox="0 0 1200 950" className="h-[65vh] w-auto" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <style>
        {`
          .hero-text {
            font-family: var(--font-lexend), sans-serif;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.05em;
          }
        `}
      </style>
      <text x="0" y="200" className="hero-text" fontSize="250">
        MAKE
      </text>
      <text x="0" y="420" className="hero-text" fontSize="250">
        THE MOST
      </text>
      <text x="0" y="640" className="hero-text" fontSize="250">
        OF
      </text>
      <text x="0" y="860" className="hero-text" fontSize="250">
        TRAVEL
      </text>
    </svg>
  )
}
