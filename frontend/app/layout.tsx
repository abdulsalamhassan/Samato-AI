import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAMATO AI",
  description: "AI-powered drought crisis detection and community alert system for Somalia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
