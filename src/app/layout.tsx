import LeftBar from "@/components/LeftBar";
import "./globals.css";
import RightBar from "@/components/RightBar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lama Dev X Clone",
  description: "Next.js social media application project",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
