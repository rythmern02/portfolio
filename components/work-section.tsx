import Image from "next/image";
import { ArrowUpRight, Check, Github } from "lucide-react";
import { caseStudies, labs, rootstock, type CaseStudy } from "@/lib/content";
import SectionHeading from "./section-heading";
import Carousel from "./carousel";
import Seal from "./arcane/seal";

// Cinematic cards: the cover shown whole at its own 1600 x 949 ratio (never
// cropped), the story and the proof underneath. Width keeps the whole card
// inside one screen on a laptop.
const SLIDE = "w-[88vw] md:w-[min(920px,80vw)]";

function CaseStudyCard({ study, n }: { study: CaseStudy; n: number }) {
  return (
    <article className="cs-card card h-full">
      <a
        href={study.caseStudy ?? study.live}
        target="_blank"
        rel="noopener"
        draggable={false}
        aria-label={`${study.name} case study`}
        className="cs-cover group relative block aspect-[1600/949] overflow-hidden border-b border-white/[0.07] bg-black"
      >
        <Image src={study.cover} alt="" fill draggable={false} sizes="(min-width: 768px) 920px, 88vw" className="object-cover" />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3.5 py-1.5 text-xs text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Read the case study <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </a>

      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8">
        <div>
          <p className="font-mono text-[11px] text-white/45">
            <span className="text-azure">{String(n).padStart(2, "0")} · {study.chain}</span> · {study.role} · {study.period}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">{study.name}</h3>
          <p className="mt-2 text-[17px] leading-snug text-white/85">{study.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
            {study.stack.slice(0, 5).map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <ul className="space-y-2">
            {study.proof.map((p) => (
              <li key={p.label} className="flex items-start gap-2.5 text-sm text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-azure" aria-hidden />
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener" draggable={false} className="text-link !text-white/80 hover:!text-white">
                    {p.label}
                  </a>
                ) : (
                  p.label
                )}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5 text-sm">
            {study.caseStudy && (
              <a href={study.caseStudy} target="_blank" rel="noopener" draggable={false} className="inline-flex items-center gap-1 font-medium text-white hover:text-ice">
                Case study <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
            <a href={study.live} target="_blank" rel="noopener" draggable={false} className="inline-flex items-center gap-1 text-white/60 hover:text-white">
              Live <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            {study.code && (
              <a href={study.code} target="_blank" rel="noopener" draggable={false} className="inline-flex items-center gap-1 text-white/60 hover:text-white">
                <Github className="h-4 w-4" aria-hidden /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// Rootstock has no product screenshot, so its cover is drawn: the seal on a
// field of blue, with the official-portal credits as the headline.
function RootstockCard({ n }: { n: number }) {
  return (
    <article className="cs-card card h-full">
      <div className="cs-cover relative aspect-[1600/949] overflow-hidden border-b border-white/[0.07] bg-[radial-gradient(ellipse_at_30%_20%,#1a3a8a_0%,#0b1630_45%,#04060c_100%)]">
        <div aria-hidden className="absolute -right-[12%] top-1/2 h-[120%] -translate-y-1/2 text-ice/25" style={{ aspectRatio: "1" }}>
          <Seal numbers={false} className="h-full w-full" />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 font-mono text-[11px] text-white/80">
          {String(n).padStart(2, "0")} · Rootstock
        </span>
        <div className="absolute bottom-6 left-6 max-w-[70%] md:bottom-10 md:left-10">
          <p className="font-mono text-[11px] text-ice/70">dev.rootstock.io · github.com/rsksmart</p>
          <p className="mt-2 font-display text-[8vw] font-bold leading-[0.9] tracking-[-0.05em] text-white md:text-6xl">
            Docs and tools Rootstock ships.
          </p>
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8">
        <div>
          <p className="font-mono text-[11px] text-white/45">Builder Rootcamp · 2026</p>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">{rootstock.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">{rootstock.summary}</p>
        </div>
        <ul className="divide-y divide-white/[0.07] self-start">
          {rootstock.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener"
                draggable={false}
                className="group flex items-center justify-between gap-4 py-2.5 text-sm text-white/80 hover:text-white"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/35 transition-colors group-hover:text-ice" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function WorkSection() {
  return (
    <section id="work" className="py-24">
      <div className="mx-auto max-w-content px-5 md:px-6">
        <SectionHeading index="01" eyebrow="selected work" title="Protocols I've shipped">
          Real money, real audits, real users. Drag through them; the full write-ups live on{" "}
          <a href={labs.work} target="_blank" rel="noopener" className="text-link">
            Web3Spell Labs
          </a>
          .
        </SectionHeading>
      </div>

      <div data-reveal className="mt-12">
        <Carousel label="Selected protocols" slideClassName={SLIDE}>
          {[
            ...caseStudies.map((study, i) => <CaseStudyCard key={study.name} study={study} n={i + 1} />),
            <RootstockCard key="rootstock" n={caseStudies.length + 1} />,
          ]}
        </Carousel>
      </div>
    </section>
  );
}
