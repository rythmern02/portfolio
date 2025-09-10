import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Lemonada, JetBrains_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Rythme Nagrani - Blockchain Wizard | Portfolio",
  icons: {
    icon: "/wizard-portrait.png",
  },
  description:
    "Blockchain Developer & Community Builder crafting the future of decentralized systems. Specializing in Solidity, Rust, and full-stack dApp development.",
  keywords: [
    "blockchain",
    "developer",
    "solidity",
    "rust",
    "web3",
    "defi",
    "smart contracts",
    "rythme nagrani",
  ],
  authors: [{ name: "Rythme Nagrani" }],
  creator: "Rythme Nagrani",
  openGraph: {
    title: "Rythme Nagrani - Blockchain Wizard",
    description:
      "Blockchain Developer & Community Builder crafting the future of decentralized systems",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rythme Nagrani - Blockchain Wizard",
    description:
      "Blockchain Developer & Community Builder crafting the future of decentralized systems",
    creator: "@RythmeNagr64107",
  },
  robots: {
    index: true,
    follow: true,
  },
};
const lemonada = Lemonada({
  subsets: ["latin"], // choose subsets you need
  weight: ["400", "700"], // optional: pick weights // optional: CSS variable
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${lemonada.className}`}>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
