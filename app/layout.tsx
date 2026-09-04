import type { Metadata } from "next";
import "./globals.css";
import noGlow from "./components/NoGlow.module.css";

export const metadata: Metadata = {
  title: "Vellum — positions that can move",
  description: "Turn token positions into portable, transferable onchain notes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={noGlow.site}>{children}</body></html>;
}
