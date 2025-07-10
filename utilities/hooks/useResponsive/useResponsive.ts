import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const useResponsive = () => {
  const [isClient, setIsClient] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isLaptop = useMediaQuery({ minWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return { isClient, isDesktop, isLaptop, isMobile, isTablet };
};
