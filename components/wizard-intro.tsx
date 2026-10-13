"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface WizardIntroProps {
  onAnimationComplete: () => void
}

export default function WizardIntro({ onAnimationComplete }: WizardIntroProps) {
  const [stage, setStage] = useState<"center" | "moving" | "complete">("center")
  useEffect(() => {
    const isMdUp = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!isMdUp || reducedMotion) {
      setStage("complete")
      onAnimationComplete()
      return
    }

    const centerTimer = setTimeout(() => {
      setStage("moving")
    }, 1000)

    const completeTimer = setTimeout(() => {
      setStage("complete")
      onAnimationComplete()
    }, 3000)

    return () => {
      clearTimeout(centerTimer)
      clearTimeout(completeTimer)
    }
  }, [onAnimationComplete])

  const isVisible = stage !== "complete"

  return (
    <div
      className={`fixed inset-0 z-40 pointer-events-none bg-black/30 overflow-hidden  hidden md:block ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity md:duration-500`}
    >
      <div className="absolute inset-0">
        {/* Floating torn paper fragments */}
        <div className="absolute top-20 left-10 w-32 h-24 bg-white/10 transform rotate-12 animate-float-slow">
          <div
            className="w-full h-full bg-gradient-to-br from-white/20 to-transparent border border-white/30 shadow-2xl"
            style={{ clipPath: "polygon(0% 0%, 85% 0%, 100% 15%, 95% 100%, 10% 90%, 0% 75%)" }}
          >
            <div className="p-2 text-xs text-white/60 font-mono">
              <div className="h-1 bg-white/20 mb-1"></div>
              <div className="h-1 bg-white/15 mb-1 w-3/4"></div>
              <div className="h-1 bg-white/10 w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Ink splash effects */}
        <div className="absolute top-1/3 right-20 w-40 h-40 opacity-20">
          <div
            className="w-full h-full bg-white transform rotate-45"
            style={{ clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 85% 70%, 60% 100%, 30% 85%, 0% 60%, 15% 25%)" }}
          ></div>
        </div>

        {/* Geometric fragments */}
        <div className="absolute bottom-32 left-1/4 w-20 h-20 border-2 border-white/30 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/3 w-1 h-32 bg-white/20 transform rotate-12"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-1 bg-white/25"></div>

        {/* Code fragments floating */}
        <div className="absolute top-40 right-32 bg-black/80 border border-white/20 p-3 transform -rotate-6 animate-float font-mono text-xs text-white/70">
          <div>pragma solidity ^0.8.0;</div>
          <div className="text-white/40">contract Magic {`{`}</div>
        </div>

        {/* Mystical symbols */}
        <div className="absolute top-60 left-1/2 text-white/30 text-2xl transform rotate-12 animate-spin-slow">⟐</div>
        <div className="absolute bottom-40 left-20 text-white/20 text-xl transform -rotate-45">◊</div>
      </div>

      <div
        className={`absolute transition-none duration-0 md:transition-all md:duration-2000 ease-out ${
          stage === "center" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : "top-0 right-0 h-screen"
        }`}
      >
        <div
          className={`relative ${stage === "center" ? "w-80 h-80" : "w-auto h-full pr-8 flex items-center justify-end"}`}
        >
          <div className="relative">
            {/* Geometric frame elements */}
            
            <div
              className={`relative ${
                stage === "center" ? "w-80 h-80 rounded-full" : "w-[50vw] h-[calc(100vh)] rounded-lg"
              } overflow-hidden  transition-none  duration-0 md:transition-all md:duration-2000 shadow-2xl`}
            >
              <WizardGlow />
              <Image
                src="/wizard-portrait.png"
                alt="Rythme Nagrani - Blockchain Wizard"
                fill
                sizes="(min-width: 768px) 50vw, 320px"
                className="object-contain object-bottom"
                priority
              />
            </div>

            {/* Floating code elements around the image */}
            <div className="absolute -top-8 -left-12 bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 text-xs font-mono text-white/80 transform -rotate-12">
              0x1a2b3c...
            </div>
            <div className="absolute -bottom-6 -right-8 bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 text-xs font-mono text-white/80 transform rotate-6">
              Web3.eth
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PermanentWizardPortrait() {
  return (
    <div className="absolute top-0 right-0 h-screen w-96 z-30 pointer-events-none hidden md:block">
      <div className="h-full flex items-center justify-end">
        <div className="relative">
          

          <div className="relative w-[50vw] h-[calc(100vh)] rounded-lg overflow-hidden  ">
            <WizardGlow />
            <Image
              src="/wizard-portrait.png"
              alt="Rythme Nagrani - Blockchain Wizard"
              fill
              sizes="50vw"
              className="object-contain object-bottom"
              priority
            />

            {/* Overlay effects */}
            
          </div>

          
        </div>
      </div>
    </div>
  )
}

// Moonlight halo behind the transparent portrait.
function WizardGlow() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(43,108,176,0.45),rgba(6,7,11,0)_65%)]"
    />
  )
}
