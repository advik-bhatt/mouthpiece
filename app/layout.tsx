import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  title: "PublicWire , Self-running local newspapers, powered by civic agents",
  description:
    "PublicWire monitors public city sites, county notices, transit alerts, agendas, school updates, and event calendars, then publishes short cited briefs when something meaningful changes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground font-sans">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
