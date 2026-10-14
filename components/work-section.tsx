import Image from "next/image";
import { ArrowUpRight, Check, Github } from "lucide-react";
import { caseStudies, labs, rootstock, type CaseStudy } from "@/lib/content";
import SectionHeading from "./section-heading";

// The cover is shown whole at its own 1600 x 949 ratio, as a banner, so it is
// never cropped at any screen size; the story and the proof sit below it.
function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article data-reveal className="card">
      <a
        href={study.caseStudy ?? study.live}
        target="_blank"
        rel="noopener"
        aria-label={`${study.name} case study`}
        className="group relative block aspect-[1600/949] overflow-hidden border-b border-white/[0.07] bg-black"
      >
        <Image
          src={study.cover}
          alt=""
          fill
          sizes="(min-width: 1152px) 72rem, 100vw"
          className="object-cover transition-transform [transition-duration:1200ms] ease-out group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3.5 py-1.5 text-xs text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Read the case study <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </a>

      <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip !border-azure/30 !text-ice">{study.chain}</span>
            <span className="font-mono text-xs text-white/50">
              {study.role} · {study.period}
            </span>
          </div>
          <h3 className="mt-5 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">{study.name}</h3>
          <p className="mt-3 text-xl leading-snug text-white/90">{study.summary}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">{study.detail}</p>
        </div>

        <div className="flex flex-col">
          <ul className="space-y-2.5">
            {study.proof.map((p) => (
              <li key={p.label} className="flex items-start gap-2.5 text-[15px] text-white/85">
                <Check className="mt-1 h-4 w-4 shrink-0 text-azure" aria-hidden />
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener" className="text-link !text-white/85 hover:!text-white">
                    {p.label}
                  </a>
                ) : (
                  p.label
                )}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Stack">
            {study.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-7 text-sm">
            {study.caseStudy && (
              <a href={study.caseStudy} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-white hover:text-ice">
                Case study <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
            <a href={study.live} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-white/65 hover:text-white">
              Live app <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            {study.code && (
              <a href={study.code} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-white/65 hover:text-white">
                <Github className="h-4 w-4" aria-hidden /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WorkSection() {
  return (
    <section id="work" className="px-5 py-24 md:px-6">
      <div className="mx-auto max-w-content">
        <SectionHeading index="01" eyebrow="selected work" title="Protocols I've shipped">
          Three products with real money, real audits or real users behind them. The full write-ups live on the{" "}
          <a href={labs.work} target="_blank" rel="noopener" className="text-link">
            Web3Spell Labs
          </a>{" "}
          case study pages.
        </SectionHeading>

        <div className="mt-12 space-y-8">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.name} study={study} />
          ))}
        </div>

        <article data-reveal className="card mt-6 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
            <div>
              <span className="chip !text-moon">Rootstock · 2026</span>
              <h3 className="mt-4 font-display text-2xl font-bold text-white">{rootstock.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">{rootstock.summary}</p>
            </div>
            <ul className="divide-y divide-white/10 self-center">
              {rootstock.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center justify-between gap-4 py-3 text-sm text-white/85 hover:text-white"
                  >
                    {l.label}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-moon" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
