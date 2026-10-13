import Image from "next/image";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { headlineProof, profile } from "@/lib/content";

export default function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pb-16 pt-24 md:pt-16">
      <div className="mx-auto w-full max-w-content px-5 md:px-6">
        {/* On md+ the portrait fills the right half, so the copy stays in the left half. */}
        <div className="md:max-w-[min(32rem,calc(50vw-3.5rem))]">
          {/* Mobile has no intro animation, so the portrait sits in the flow here. */}
          <div className="relative mx-auto mb-6 h-56 w-56 [mask-image:linear-gradient(to_bottom,black_80%,transparent)] md:hidden">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_60%,rgba(43,108,176,0.5),transparent_68%)]"
            />
            <Image
              src="/wizard-portrait.png"
              alt="Rythme Nagrani as a blockchain wizard"
              fill
              sizes="224px"
              className="object-contain"
              priority
            />
          </div>

          <p className="eyebrow">{profile.role}</p>

          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl">
            RYTHME
            <br />
            <span className="text-white/85">NAGRANI</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{profile.statement}</p>

          <p className="mt-4 flex items-center gap-2 text-sm text-white/65">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability} · {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn-primary">
              See selected work
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener" className="btn-ghost">
              <FileText className="h-4 w-4" aria-hidden />
              Resume
            </a>
            <a href="#contact" className="btn-ghost">
              Get in touch
            </a>
          </div>

          <ul className="mt-10 grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2" aria-label="Highlights">
            {headlineProof.map((p) => (
              <li key={p.label} className="card flex items-start gap-3 px-4 py-3 text-sm leading-snug text-white/85">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moon" />
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener" className="group hover:text-white">
                    {p.label}
                    <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5 text-white/40 group-hover:text-moon" aria-hidden />
                  </a>
                ) : (
                  <span>{p.label}</span>
                )}
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Profiles">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="text-white/65 transition-colors hover:text-moon">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
