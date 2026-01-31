// lib/fonts.ts
import {
  Inter,
  Roboto_Mono,
  Geist,
  Geist_Mono,
  Rowdies,
  Fredericka_the_Great,
  Comic_Neue,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const inter = Inter({
  subsets: ["latin", "latin-ext"], // suport română
  weight: ["400", "500"],
  variable: "--font-inter", // CSS var pentru Shadcn
  display: "swap",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const rowdies = Rowdies({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-rowdies",
  display: "swap",
});

export const fredericka = Fredericka_the_Great({
  subsets: ["latin"],
  weight: ["400"], // Doar 400 disponibil [web:11][web:20]
  variable: "--font-fredericka",
  display: "swap",
});

import { Tinos } from "next/font/google";

export const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"], // Normal și bold disponibile [web:44]
  variable: "--font-tinos",
  display: "swap",
});

export const comicRelief = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular și Bold
  variable: "--font-comic-relief",
  display: "swap",
});
