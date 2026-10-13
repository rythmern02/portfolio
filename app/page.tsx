"use client"

import { useCallback, useState } from "react"
import Loader from "@/components/loader"
import WizardIntro, { PermanentWizardPortrait } from "@/components/wizard-intro"
import Nav from "@/components/nav"
import HeroSection from "@/components/hero-section"
import WorkSection from "@/components/work-section"
import BuildsSection from "@/components/builds-section"
import CommunitySection from "@/components/community-section"
import ExperienceSection from "@/components/experience-section"
import ContactSection from "@/components/contact-section"
import { labs, profile } from "@/lib/content"

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [wizardAnimationComplete, setWizardAnimationComplete] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const handleLoadingComplete = useCallback(() => setLoadingComplete(true), [])

  const handleWizardAnimationComplete = useCallback(() => {
    setWizardAnimationComplete(true)
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 5)
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to work
      </a>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/illuminati-background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(43,108,176,0.16),transparent_55%)]"
      />

      {!loadingComplete && <Loader onComplete={handleLoadingComplete} />}

      {loadingComplete && !wizardAnimationComplete && (
        <div className="relative z-20">
          <WizardIntro onAnimationComplete={handleWizardAnimationComplete} />
        </div>
      )}

      {wizardAnimationComplete && <PermanentWizardPortrait />}

      {/* The nav sits above the portrait layer (z-30), so it lives outside the content wrapper. */}
      <div
        className={`relative z-50 transition-opacity duration-700 ${showContent ? "opacity-100" : "pointer-events-none opacity-0"}`}
        inert={!showContent}
      >
        <Nav />
      </div>

      {/* Content is always in the HTML for crawlers and no-JS; it just stays hidden until the intro ends. */}
      <div
        className={`relative z-20 transition-opacity duration-700 ${showContent ? "opacity-100" : "pointer-events-none opacity-0"}`}
        inert={!showContent}
      >
        <HeroSection />
        <WorkSection />
        <BuildsSection />
        <CommunitySection />
        <ExperienceSection />
        <ContactSection />

        <footer className="border-t border-white/10 px-5 py-10 md:px-6">
          <div className="mx-auto flex max-w-content flex-col gap-3 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} {profile.name}. Built with Next.js, deployed on Vercel.</p>
            <p className="flex gap-5">
              <a href={labs.home} target="_blank" rel="noopener" className="hover:text-white">
                Web3Spell Labs
              </a>
              <a href={profile.resume} target="_blank" rel="noopener" className="hover:text-white">
                Resume
              </a>
              <a href="#top" className="hover:text-white">
                Back to top ↑
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
