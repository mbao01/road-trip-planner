import Cookies from "universal-cookie";
import { FONT_COOKIE_NAME } from "./constants";
import { type Font } from "./types";

export const getFont = () => {
  if (typeof window === "undefined") return null;

  const cookies = new Cookies();
  const theme = cookies.get(FONT_COOKIE_NAME) as Font;
  return theme;
};
