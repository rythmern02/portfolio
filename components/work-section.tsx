import Image from "next/image";
import { ArrowUpRight, Check, Github } from "lucide-react";
import { caseStudies, labs, rootstock, type CaseStudy } from "@/lib/content";
import SectionHeading from "./section-heading";

function CaseStudyCard({ study, flip }: { study: CaseStudy; flip: boolean }) {
  return (
    <article data-reveal className="card grid overflow-hidden lg:grid-cols-2">
      <a
        href={study.caseStudy ?? study.live}
        target="_blank"
        rel="noopener"
        aria-label={`${study.name} case study`}
        className={`group relative block aspect-[16/10] overflow-hidden bg-black lg:aspect-auto lg:min-h-[22rem] ${flip ? "lg:order-2" : ""}`}
      >
        <Image
          src={study.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 36rem, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </a>

      <div className="flex flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip !text-moon">{study.chain}</span>
          <span className="font-mono text-xs text-white/55">
            {study.role} · {study.period}
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-white">{study.name}</h3>
        <p className="mt-2 text-lg leading-snug text-white/90">{study.summary}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-white/70">{study.detail}</p>

        <ul className="mt-5 space-y-1.5">
          {study.proof.map((p) => (
            <li key={p.label} className="flex items-start gap-2 text-sm text-white/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-moon" aria-hidden />
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

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
          {study.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 text-sm">
          {study.caseStudy && (
            <a href={study.caseStudy} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-white hover:text-moon">
              Read the case study <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          )}
          <a href={study.live} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-white/70 hover:text-white">
            Live app <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          {study.code && (
            <a href={study.code} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-white/70 hover:text-white">
              <Github className="h-4 w-4" aria-hidden /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function WorkSection() {
  return (
    <section id="work" className="px-5 py-24 md:px-6">
      <div className="mx-auto max-w-content">
        <SectionHeading index="I" eyebrow="Selected work" title="Protocols I've shipped">
          Three products with real money, real audits or real users behind them. The full write-ups live on the{" "}
          <a href={labs.work} target="_blank" rel="noopener" className="text-link">
            Web3Spell Labs
          </a>{" "}
          case study pages.
        </SectionHeading>

        <div className="mt-12 space-y-6">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.name} study={study} flip={i % 2 === 1} />
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
