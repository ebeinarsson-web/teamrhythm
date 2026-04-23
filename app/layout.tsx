import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "TeamRhythm",
  description: "Einfalt app fyrir reglulega stöðutöku teymis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="is">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
