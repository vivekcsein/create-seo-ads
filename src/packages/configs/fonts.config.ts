import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

export const serifFont = IBM_Plex_Serif({
  weight: "400",
  style: "normal",
  variable: "--font-serif",
  subsets: ["latin"],
});

export const sansFont = IBM_Plex_Sans({
  weight: "400",
  style: "normal",
  variable: "--font-sans",
  subsets: ["latin"],
});

export const monoFont = IBM_Plex_Mono({
  weight: "400",
  style: "normal",
  variable: "--font-mono",
  subsets: ["latin"],
});
