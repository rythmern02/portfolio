import Image from "next/image";
import { ArrowUpRight, Mic, PenLine, Trophy } from "lucide-react";
import { events, recognition, speaking, spellcast, stats, writing } from "@/lib/content";
import SectionHeading from "./section-heading";

export default function CommunitySection() {
  const [featured, ...rest] = events;

  return (
    <section id="community" className="px-5 py-24 md:px-6">
      <div className="mx-auto max-w-content">
        <SectionHeading index="III" eyebrow="Developer relations" title="Developers, brought onchain">
          Bootcamps, hackathons and build stations across India, run through Web3Spell with ecosystem teams from Solana,
          Arbitrum, Ethereum and more.
        </SectionHeading>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-panel px-5 py-6">
              <dt className="text-sm text-white/65">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {featured && (
            <a
              href={featured.caseStudy}
              target="_blank"
              rel="noopener"
              data-reveal className="card group relative overflow-hidden lg:col-span-2 lg:row-span-2"
            >
              {featured.image && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 46rem, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  {featured.name}
                  <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-moon" aria-hidden />
                </h3>
                <p className="mt-1.5 text-[15px] text-white/70">{featured.what}</p>
                <p className="mt-3 text-sm font-medium text-moon">Read the case study</p>
              </div>
            </a>
          )}
          {rest.map((e) => (
            <div key={e.name} data-reveal className="card p-6">
              <h3 className="text-lg font-semibold text-white">{e.name}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{e.what}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div data-reveal className="card p-6 md:col-span-2 lg:col-span-1">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <Mic className="h-4 w-4 text-moon" aria-hidden /> SpellCast podcast
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">{spellcast.blurb}</p>
            <div className="mt-4 flex gap-5 text-sm">
              <a href={spellcast.href} target="_blank" rel="noopener" className="text-link">
                Episodes
              </a>
              <a href={spellcast.youtube} target="_blank" rel="noopener" className="text-link">
                YouTube
              </a>
            </div>
          </div>

          <div data-reveal className="card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <Trophy className="h-4 w-4 text-moon" aria-hidden /> Recognition
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-snug text-white/75">
              {recognition.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div data-reveal className="card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <PenLine className="h-4 w-4 text-moon" aria-hidden /> Speaking & writing
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-snug text-white/75">
              {speaking.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm leading-snug">
              {writing.map((w) => (
                <li key={w.href}>
                  <a href={w.href} target="_blank" rel="noopener" className="text-link !text-white/80 hover:!text-white">
                    {w.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
