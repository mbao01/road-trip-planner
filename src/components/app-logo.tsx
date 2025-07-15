export const AppLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Pin Shape */}
      <path
        d="M50 5C33 5 20 18 20 35c0 17 30 55 30 55s30-38 30-55C80 18 67 5 50 5z"
        fill="currentColor"
      />

      {/* Inner Circle */}
      <circle cx="50" cy="35" r="8" fill="white" />

      {/* Vertical Line through entire pin */}
      <line x1="50" y1="5" x2="50" y2="90" stroke="white" strokeWidth="2" />

      {/* Horizontal Line through entire pin */}
      <line x1="20" y1="35" x2="80" y2="35" stroke="white" strokeWidth="2" />
    </svg>
  );
};
