import Aura from "./arcane/aura";
import SpellButton from "./arcane/spell-button";

// The last thing on the page: one aura, one sentence, one button.
export default function BookSection() {
  return (
    <section id="book" aria-labelledby="book-title" className="relative flex min-h-[min(64rem,130vw)] items-center overflow-hidden px-5 py-24 md:px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(118vw,50rem)] w-[min(118vw,50rem)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <Aura className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center [text-shadow:0_2px_30px_rgba(4,5,10,0.6)]" data-reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-moon-soft">Thirty minutes, your pick of time</p>
        <h2 id="book-title" className="mt-5 font-display text-[3.2rem] leading-[0.95] tracking-[-0.02em] text-white sm:text-7xl md:text-[6.5rem]">
          Let&apos;s make <span className="aura-text italic">something</span> together.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/75 md:text-base">
          A role, a protocol, a hackathon, a talk. Grab a slot and I&apos;ll come prepared.
        </p>
        <div className="mt-9 flex justify-center">
          <SpellButton href="book" icon="✦" className="spell-xl">
            Book a call
          </SpellButton>
        </div>
      </div>
    </section>
  );
}
