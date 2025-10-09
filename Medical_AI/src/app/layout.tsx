import type { Metadata } from "next";
import "./globals.css";
import { ApiClient } from "@/lib/query";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ApiClient>{children}</ApiClient>
      </body>
    </html>
  );
}
