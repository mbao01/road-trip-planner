import Cookies from "universal-cookie";
import { FONT_COOKIE_NAME, FONTS } from "./constants";
import { type Font } from "./types";

export const saveFont = (font: Font) => {
  const cookies = new Cookies();
  cookies.set(FONT_COOKIE_NAME, font, { secure: true, path: "/" });
  document.body.setAttribute(FONT_COOKIE_NAME, font);

  const nextFont = FONTS[font];
  document.body.className = nextFont?.className;
};
