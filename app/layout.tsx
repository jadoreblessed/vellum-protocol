import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import noGlow from "./components/NoGlow.module.css";

const display = localFont({ src: "./fonts/Syne-Latin.woff2", variable: "--font-display", weight: "500 800", display: "swap" });
const body = localFont({ src: "./fonts/Manrope-Latin.woff2", variable: "--font-body", weight: "400 700", display: "swap" });
const mono = localFont({ src: [
  { path: "./fonts/IBMPlexMono-Regular.woff2", weight: "400" },
  { path: "./fonts/IBMPlexMono-Medium.woff2", weight: "500" },
  { path: "./fonts/IBMPlexMono-SemiBold.woff2", weight: "600" },
], variable: "--font-mono", display: "swap" });
const experienceFont = localFont({ src: "./fonts/Geist-Latin.woff2", variable: "--font-vellum", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  title: "Vellum — positions that can move",
  description: "Turn token positions into portable, transferable onchain notes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable} ${mono.variable} ${experienceFont.variable} ${noGlow.site}`}>{children}</body></html>;
}
