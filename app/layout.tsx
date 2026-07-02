import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity Navigator",
  description: "AI-assisted education aid case management for counselors."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
