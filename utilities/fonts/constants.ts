import { Inter, Manrope } from "next/font/google";

export const FONT_COOKIE_NAME = "data-font";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export const FONTS = {
  inter,
  manrope,
  system: { className: "system-ui" },
};
