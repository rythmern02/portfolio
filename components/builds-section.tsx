import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { builds, earlierWork, labs } from "@/lib/content";
import SectionHeading from "./section-heading";
import SpellButton from "./arcane/spell-button";

export default function BuildsSection() {
  return (
    <section id="builds" className="px-5 py-24 md:px-6">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading index="II" eyebrow="Latest builds" title="Fresh from the forge">
            Smaller builds from 2025 and 2026: account abstraction, agent payments, staking and 3D web.
          </SectionHeading>
          <SpellButton href={labs.portfolio} variant="trace" className="shrink-0 self-start md:self-auto">
            All 15+ builds
          </SpellButton>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((b) => (
            <li key={b.name} data-reveal className="card group flex flex-col overflow-hidden transition-colors hover:border-white/25">
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <Image
                  src={b.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 23rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-white">{b.name}</h3>
                  <span className="font-mono text-[11px] text-white/55">
                    {b.chain} · {b.year}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{b.what}</p>
                <div className="mt-auto flex gap-4 pt-4 text-sm">
                  {b.live && (
                    <a href={b.live} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-white hover:text-moon">
                      Live <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">{b.name}</span>
                    </a>
                  )}
                  <a href={b.code} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-white/65 hover:text-white">
                    <Github className="h-3.5 w-3.5" aria-hidden /> Code
                    <span className="sr-only">for {b.name}</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-white/60">
          Earlier:{" "}
          {earlierWork.map((w, i) => (
            <span key={w.href}>
              <a href={w.href} target="_blank" rel="noopener" className="text-link !text-white/75 hover:!text-white">
                {w.label}
              </a>
              {i < earlierWork.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
