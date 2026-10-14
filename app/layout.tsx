import type React from "react";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile, siteUrl } from "@/lib/content";
import "lenis/dist/lenis.css";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

const description =
  "Protocol engineer and developer advocate. Co-founder of Web3Spell Labs. Certora-reviewed DeFi on Base, ZK payroll on Solana, 75+ developer events.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} · ${profile.role}`,
  description,
  icons: { icon: "/wizard-portrait.png" },
  keywords: ["Rythme Nagrani", "developer relations", "protocol engineer", "Solidity", "Rust", "Anchor", "Solana", "zero knowledge", "Web3Spell"],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} · Blockchain Wizard`,
    description,
    url: siteUrl,
    type: "website",
    locale: "en_US",
    images: [{ url: "/wizard-portrait.png", width: 500, height: 500, alt: "Rythme Nagrani as a blockchain wizard" }],
  },
  twitter: {
    card: "summary",
    title: `${profile.name} · Blockchain Wizard`,
    description,
    creator: "@rythmern",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${bricolage.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
