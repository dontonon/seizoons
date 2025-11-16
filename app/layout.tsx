import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snoozies NFT Dashboard - Community Analytics",
  description: "Showcasing the Snoozies NFT community's value for airdrops and marketing partnerships through onchain wallet analytics and Twitter community metrics.",
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
