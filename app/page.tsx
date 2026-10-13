"use client"

import { useCallback, useEffect, useState } from "react"
import Lenis from "lenis"
import Loader from "@/components/loader"
import Nav from "@/components/nav"
import Film from "@/components/arcane/film"
import WandCursor from "@/components/arcane/wand-cursor"
import RevealObserver from "@/components/arcane/reveal"
import WorkSection from "@/components/work-section"
import BuildsSection from "@/components/builds-section"
import CommunitySection from "@/components/community-section"
import ExperienceSection from "@/components/experience-section"
import ContactSection from "@/components/contact-section"
import BookSection from "@/components/book-section"
import BookingModal from "@/components/booking-modal"
import { labs, profile } from "@/lib/content"

export default function Home() {
  const [ready, setReady] = useState(false)

  const handleLoaded = useCallback(() => {
    setReady(true)
    window.dispatchEvent(new Event("arcane:ready"))
  }, [])

  // Smooth, weighted scrolling: it is what makes the film feel like a camera.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.12 })
    // The booking modal pauses page scrolling while it is open.
    const onLock = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start())
    window.addEventListener("arcane:lock", onLock)
    return () => {
      window.removeEventListener("arcane:lock", onLock)
      lenis.destroy()
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ink text-white">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to work
      </a>

      <Loader onComplete={handleLoaded} />
      <BookingModal />
      <WandCursor />
      <RevealObserver />

      <div className={`transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
        <Nav />
      </div>

      <Film />

      {/* Soft, still pools of light behind the chapters below the film. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(40%_35%_at_12%_20%,rgba(43,108,176,0.16),transparent),radial-gradient(35%_30%_at_88%_70%,rgba(140,110,255,0.12),transparent),radial-gradient(30%_25%_at_60%_105%,rgba(255,150,205,0.07),transparent)]"
      />

      <div className="relative z-10">
        <WorkSection />
        <BuildsSection />
        <CommunitySection />
        <ExperienceSection />
        <ContactSection />
        <BookSection />

        <footer className="border-t border-white/10 px-5 py-10 md:px-6">
          <div className="mx-auto flex max-w-content flex-col gap-3 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {profile.name}. Built with one portrait and a lot of code.
            </p>
            <p className="flex gap-5">
              <a href={labs.home} target="_blank" rel="noopener" className="hover:text-white">
                Web3Spell Labs
              </a>
              <a href={profile.resume} target="_blank" rel="noopener" className="hover:text-white">
                Resume
              </a>
              <a href="#top" className="hover:text-white">
                Back to the circle ↑
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
