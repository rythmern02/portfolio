import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { builds, earlierWork, labs } from "@/lib/content";
import SectionHeading from "./section-heading";
import Carousel from "./carousel";
import TiltCard from "./tilt-card";
import Seal from "./arcane/seal";

const SLIDE = "w-[78vw] sm:w-[340px] md:w-[360px]";

export default function BuildsSection() {
  return (
    <section id="builds" className="py-24">
      <div className="mx-auto max-w-content px-5 md:px-6">
        <SectionHeading index="02" eyebrow="latest builds" title="Fresh from the forge">
          Account abstraction, agent payments, staking and 3D web, from 2025 and 2026.
        </SectionHeading>
      </div>

      <div data-reveal className="mt-12">
        <Carousel label="Latest builds" slideClassName={SLIDE}>
          {[
            ...builds.map((b, i) => (
              <TiltCard key={b.name} className="card group flex h-full flex-col">
                <div className="relative aspect-[16/11] overflow-hidden bg-black">
                  <Image
                    src={b.image}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(min-width: 640px) 360px, 78vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#09101f] to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[10px] text-white/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 pt-3">
                  <p className="font-mono text-[11px] text-azure">
                    {b.chain} · {b.year}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold tracking-[-0.035em] text-white">{b.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{b.what}</p>
                  <div className="mt-auto flex gap-4 pt-5 text-sm">
                    {b.live && (
                      <a href={b.live} target="_blank" rel="noopener" draggable={false} className="inline-flex items-center gap-1 text-white hover:text-ice">
                        Live <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">{b.name}</span>
                      </a>
                    )}
                    <a href={b.code} target="_blank" rel="noopener" draggable={false} className="inline-flex items-center gap-1 text-white/60 hover:text-white">
                      <Github className="h-3.5 w-3.5" aria-hidden /> Code
                      <span className="sr-only">for {b.name}</span>
                    </a>
                  </div>
                </div>
              </TiltCard>
            )),
            // The last slide sends people to everything else.
            <TiltCard key="all" className="card h-full">
              <a
                href={labs.portfolio}
                target="_blank"
                rel="noopener"
                draggable={false}
                className="relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden bg-[radial-gradient(ellipse_at_50%_25%,#1a3a8a_0%,#0b1630_50%,#09101f_100%)] p-6"
              >
                <div aria-hidden className="absolute left-1/2 top-8 w-[78%] -translate-x-1/2 text-ice/40" style={{ aspectRatio: "1" }}>
                  <Seal numbers={false} className="h-full w-full" />
                </div>
                <p className="relative font-mono text-[11px] text-ice/70">labs.web3spell.fun</p>
                <p className="relative mt-2 font-display text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white">
                  All 15+ builds
                </p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm text-white/75">
                  Open the full portfolio <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </a>
            </TiltCard>,
          ]}
        </Carousel>
      </div>

      <p className="mx-auto mt-10 max-w-content px-5 text-sm text-white/55 md:px-6">
        Earlier:{" "}
        {earlierWork.map((w, i) => (
          <span key={w.href}>
            <a href={w.href} target="_blank" rel="noopener" className="text-link !text-white/70 hover:!text-white">
              {w.label}
            </a>
            {i < earlierWork.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>
    </section>
  );
}
