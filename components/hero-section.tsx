"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Phone, MapPin, Twitter } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Torn paper fragments with code snippets */}
        <div className="absolute top-20  w-48 h-32 bg-white/5 transform rotate-12 animate-float-slow">
          <div
            className="w-full h-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-sm"
            style={{
              clipPath:
                "polygon(0% 0%, 90% 0%, 100% 20%, 85% 100%, 5% 95%, 0% 70%)",
            }}
          >
            <div className="p-3 text-xs text-white/70 font-mono leading-tight">
              <div className="text-white/90">contract Wizard {`{`}</div>
              <div className="text-white/60 ml-2">mapping(address =&gt;</div>
              <div className="text-white/60 ml-4">uint256) magic;</div>
              <div className="text-white/40">...</div>
            </div>
          </div>
        </div>

        {/* Ink splashes and abstract shapes */}
        <div className="absolute top-1/4 right-20 w-64 h-64 opacity-15">
          <div
            className="w-full h-full bg-white transform rotate-12"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 85% 70%, 70% 100%, 30% 100%, 0% 70%, 15% 30%)",
            }}
          ></div>
        </div>

        {/* Geometric wireframes */}
        <div className="absolute bottom-32 left-1/4 w-32 h-32 border border-white/20 transform rotate-45 animate-pulse">
          <div className="absolute inset-4 border border-white/15 transform -rotate-12"></div>
          <div className="absolute inset-8 border border-white/10"></div>
        </div>

        {/* Floating code blocks */}
        <div className="absolute top-1/3 left-1/3 bg-black/90 border border-white/30 p-4 transform -rotate-6 animate-float font-mono text-sm text-white/80 shadow-2xl">
          <div className="text-white/60">// Blockchain Magic</div>
          <div className="text-white">function castSpell() {`{`}</div>
          <div className="text-white/70 ml-4">return "✨";</div>
          <div className="text-white">{`}`}</div>
        </div>

        {/* Abstract line patterns */}
        <div className="absolute top-60 right-1/3 w-40 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-40 left-20 w-1 h-40 bg-gradient-to-b from-transparent via-white/25 to-transparent transform rotate-45"></div>

        {/* Mystical symbols */}
        <div className="absolute top-1/2 right-10 text-white/20 text-4xl transform rotate-12 animate-spin-slow">
          ⬢
        </div>
        <div className="absolute bottom-1/3 left-1/2 text-white/15 text-2xl transform -rotate-45">
          ◊
        </div>
      </div>

      <div className="absolute inset-0 bg-black/80 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="text-white border-white/50 bg-white/10 backdrop-blur-sm"
            >
              🧙‍♂️ Blockchain Wizard
            </Badge>
            <h1 className="text-6xl lg:text-7xl font-bold text-balance">
              <span className="text-white drop-shadow-2xl">RYTHME</span>
              <br />
              <span className="text-white/90 drop-shadow-xl">NAGRANI</span>
            </h1>
            <p className="text-xl text-white/70 text-pretty leading-relaxed">
              Blockchain Developer & Community Builder crafting the future of
              decentralized systems. Specializing in Solidity, Rust, and
              full-stack dApp development!
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <Phone className="w-4 h-4 text-white" />
              +91 7000 938 600
            </div>
            <div className="flex items-center gap-2 text-white/60 text-[11px] md:text-sm">
              <Mail className="w-4 h-4 text-white" />
              rythmenagrani@gmail.com
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="w-4 h-4 text-white" />
              Bhopal, India
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Twitter className="w-4 h-4 text-white" />
              @RythmeNagr64107
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 shadow-2xl"
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View My Work
            </Button>
            <Link href={"https://github.com/rythmern02"}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub Profile
              </Button>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-white/60">EXPERTISE</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Solidity",
                "Rust",
                "TypeScript",
                "Next.js",
                "Web3",
                "DeFi",
                "NFTs",
                "Smart Contracts",
              ].map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-white/10 text-white/80 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
