import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cleveland Clinic AI Triage Assistant",
  description: "AI-powered medical triage and appointment booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
