import type React from "react";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@/lib/content";
import { siteName, siteUrl } from "@/lib/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

const title = "Rythme Nagrani · Protocol Engineer & Developer Relations";
const description =
  "Rythme Nagrani (rythme.world): protocol engineer and developer advocate, co-founder of Web3Spell Labs. Certora-reviewed DeFi on Base, ZK payroll on Solana, 75+ developer events.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${title} | rythme.world`, template: `%s | rythme.world` },
  description,
  applicationName: siteName,
  alternates: { canonical: "/" },
  keywords: [
    "Rythme Nagrani",
    "rythme world",
    "rythme.world",
    "Rythme",
    "rythmern",
    "developer relations",
    "DevRel engineer",
    "protocol engineer",
    "Solidity developer",
    "Rust Anchor Solana",
    "zero knowledge",
    "Web3Spell Labs",
    "ChainPot",
    "Civitas",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  openGraph: {
    title,
    description,
    url: "/",
    siteName,
    type: "profile",
    firstName: "Rythme",
    lastName: "Nagrani",
    username: "rythmern",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@rythmern",
    site: "@rythmern",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the Google Search Console token into this env var to verify ownership.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

// Structured data: tells search engines who this page is about and which
// profiles belong to the same person, so a search for the name or the
// domain resolves to this site.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      alternateName: ["rythme world", "Rythme Nagrani", "rythme"],
      description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: `${profile.name} · rythme.world`,
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      givenName: "Rythme",
      familyName: "Nagrani",
      alternateName: ["rythme", "rythmern", "rythme world"],
      url: siteUrl,
      image: `${siteUrl}/opengraph-image.png`,
      email: `mailto:${profile.email}`,
      jobTitle: "Protocol Engineer & Developer Relations",
      description,
      worksFor: { "@type": "Organization", name: "Web3Spell Labs", url: "https://labs.web3spell.fun" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Samrat Ashok Technological Institute (SATI), Vidisha" },
      address: { "@type": "PostalAddress", addressLocality: "Bhopal", addressCountry: "IN" },
      award: ["Winner, TOKEN2049 Origins Hackathon, Singapore", "Thrive Power List, Top 500"],
      knowsAbout: ["Solidity", "Rust", "Anchor", "Solana", "Base", "Rootstock", "Zero-knowledge proofs", "Developer relations", "DeFi"],
      sameAs: [...profile.socials.map((s) => s.href), "https://labs.web3spell.fun"],
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${bricolage.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
