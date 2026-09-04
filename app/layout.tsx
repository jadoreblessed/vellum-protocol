import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Syne } from "next/font/google";
import "./globals.css";
import noGlow from "./components/NoGlow.module.css";

const display = Syne({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Vellum — positions that can move",
  description: "Turn token positions into portable, transferable onchain notes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable} ${mono.variable} ${noGlow.site}`}>{children}</body></html>;
}
