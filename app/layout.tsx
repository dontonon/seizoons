import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snoozies NFT Dashboard",
  description: "Community analytics for Snoozies NFT holders",
};

export default function RootLayout({
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
