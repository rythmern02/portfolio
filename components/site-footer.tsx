import type React from "react";
import { booking, caseStudies, labs, nav, profile } from "@/lib/content";
import { BookButton } from "./booking";
import Seal from "./arcane/seal";

// A big, quiet footer: four columns of links, a hairline bar, and the domain
// set edge to edge in chrome-blue letters that fade into the dark. A soft
// light follows the cursor across the wordmark.

const COLUMNS = [
  { title: "explore", links: nav.map((n) => ({ label: n.label, href: n.href })) },
  {
    title: "selected work",
    links: [
      ...caseStudies.map((c) => ({ label: c.name, href: c.caseStudy ?? c.live })),
      { label: "Web3Spell Labs", href: labs.home },
    ],
  },
  { title: "elsewhere", links: profile.socials },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="group inline-flex items-center gap-1.5 text-[17px] text-white/70 transition-colors hover:text-white"
    >
      {children}
      {external && <span aria-hidden className="text-xs text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ice">↗</span>}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07]">
      <div className="mx-auto max-w-[84rem] px-5 pt-20 md:px-8 md:pt-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-mono text-[11px] lowercase tracking-[0.18em] text-white/35">{col.title}</p>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="font-mono text-[11px] lowercase tracking-[0.18em] text-white/35">say hello</p>
            <ul className="mt-6 space-y-3.5">
              <li>
                <FooterLink href={`mailto:${profile.email}`}>{profile.email}</FooterLink>
              </li>
              <li>
                <FooterLink href={profile.resume}>Resume</FooterLink>
              </li>
              <li>
                <FooterLink href={booking.url}>Calendly · {booking.length}</FooterLink>
              </li>
            </ul>
            <div className="mt-7">
              <BookButton />
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-white/[0.07] py-7 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] lowercase tracking-[0.14em] text-white/35">
            © {new Date().getFullYear()} rythme nagrani · rythme.world · one portrait, everything else is code
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["Solidity", "Rust · Anchor", "Zero knowledge", "Developer relations"].map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/45">
                {t}
              </span>
            ))}
            <a href="#top" className="ml-1 rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 transition hover:border-ice/50 hover:text-white">
              back to the circle ↑
            </a>
          </div>
        </div>
      </div>

      {/* The wordmark. Sized in vw so "rythme.world" always runs edge to edge. */}
      <div className="spot footer-mark relative select-none border-t border-white/[0.07] px-3 pt-6 md:px-5">
        <div aria-hidden className="pointer-events-none absolute -top-[18vw] right-[4vw] w-[22vw] text-ice/[0.06]" style={{ aspectRatio: "1" }}>
          <Seal numbers={false} className="h-full w-full" />
        </div>
        <p className="footer-word whitespace-nowrap text-center font-display font-bold leading-[0.78] tracking-[-0.065em]">
          rythme<span className="footer-dot">.</span>world
        </p>
      </div>
    </footer>
  );
}
