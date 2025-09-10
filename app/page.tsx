"use client"

import { useState } from "react"
import Loader from "@/components/loader"
import WizardIntro, { PermanentWizardPortrait } from "@/components/wizard-intro"
import HeroSection from "@/components/hero-section"
import ExperienceSection from "@/components/experience-section"
import ProjectsSection from "@/components/project-section"
import SkillsSection from "@/components/skills-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [wizardAnimationComplete, setWizardAnimationComplete] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const handleLoadingComplete = () => {
    setLoadingComplete(true)
  }

  const handleWizardAnimationComplete = () => {
    setWizardAnimationComplete(true)
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 5)
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative ">
      <div
        className="fixed inset-0 w-full h-full opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/illuminati-background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="fixed inset-0 bg-black/30 pointer-events-none z-10" />

      {/* Loading Screen */}
      {!loadingComplete && (
        <div className="relative z-20">
          <Loader onComplete={handleLoadingComplete} />
        </div>
      )}

      {/* Wizard Introduction Animation */}
      {loadingComplete && !wizardAnimationComplete && (
        <div className="relative z-20">
          <WizardIntro onAnimationComplete={handleWizardAnimationComplete} />
        </div>
      )}

      {wizardAnimationComplete && <PermanentWizardPortrait />}

      {/* Main Content */}
      {showContent && (
        <div className="animate-in fade-in duration-0 md:duration-1000 relative z-20">
          <HeroSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />

          {/* Footer */}
          <footer className="py-12 px-6 border-t border-border/50 backdrop-blur-sm bg-black/30">
            <div className="max-w-6xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span className="text-lg">△</span>
                <p>© 2024 Rythme Nagrani. Crafted with ancient wisdom and modern code</p>
                <span className="text-lg">△</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                Blockchain Wizard • Illuminati of Code • Master of Digital Realms
              </p>
              <p className="text-xs opacity-20 font-mono tracking-widest">ORDO AB CHAO • NOVUS ORDO SECLORUM</p>
            </div>
          </footer>
        </div>
      )}
    </main>
  )
}
