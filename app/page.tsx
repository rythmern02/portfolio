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
import BookingModal from "@/components/booking"
import Seal from "@/components/arcane/seal"
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
    // Freeze the page while the booking modal is open, so the wheel scrolls
    // the calendar and not the film behind it.
    const stop = () => lenis.stop()
    const start = () => lenis.start()
    window.addEventListener("booking:open", stop)
    window.addEventListener("booking:close", start)
    return () => {
      window.removeEventListener("booking:open", stop)
      window.removeEventListener("booking:close", start)
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
      <div aria-hidden className="grain" />
      <WandCursor />
      <RevealObserver />

      <div className={`transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
        <Nav />
      </div>

      <Film />

      {/* A faint, still circle and a pool of blue light behind the chapters. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_10%,rgba(47,107,255,0.10),transparent_60%),radial-gradient(ellipse_70%_50%_at_10%_90%,rgba(11,22,48,0.6),transparent_70%)]" />
        <div className="h-[110vmin] w-[110vmin] rotate-[18deg] text-azure/[0.04]">
          <Seal numbers={false} className="h-full w-full" />
        </div>
      </div>

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
              © {new Date().getFullYear()} {profile.name}. One portrait, everything else is code.
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
