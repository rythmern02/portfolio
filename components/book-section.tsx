import { booking } from "@/lib/content";
import Seal from "./arcane/seal";
import Rise from "./arcane/rise";
import { BookButton } from "./booking";

// The last thing on the page: one clear ask.
export default function BookSection() {
  return (
    <section id="book" className="relative overflow-hidden px-5 pb-28 pt-24 md:px-6 md:pb-36 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.22),rgba(11,22,48,0.15)_45%,transparent_70%)]" />
        <div className="h-[38rem] w-[38rem] text-ice/[0.12] md:h-[46rem] md:w-[46rem]">
          <Seal className="h-full w-full" />
        </div>
      </div>

      <div data-reveal className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow">
          <span className="text-azure">(06)</span> book a call
        </p>
        <h2 className="mt-5 font-display text-[3.4rem] font-bold leading-[0.9] tracking-[-0.055em] text-white md:text-[7rem]">
          <Rise text="got thirty minutes?" />
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/70">
          Pick a slot and we&apos;ll talk protocols, developer relations, or whatever you&apos;re building. {booking.length}, on video.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <BookButton className="!px-7 !py-4 !text-base">Book a 30 min call</BookButton>
          <a href="#contact" className="spell-trace">
            <span>or send a message</span>
            <span aria-hidden className="spell-arrow">
              ↗
            </span>
            <span aria-hidden className="spell-ink" />
          </a>
        </div>
      </div>
    </section>
  );
}
