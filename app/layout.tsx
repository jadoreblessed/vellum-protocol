import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vellum — programmable bearer notes",
  description: "Turn token positions into transferable instruments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
