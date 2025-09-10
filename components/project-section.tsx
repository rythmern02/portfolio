"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Zap,
  Shield,
  Gamepad2,
  Brain,
  Home,
  Play,
} from "lucide-react";

const projects = [
  {
    title: "InstaCredit",
    subtitle: "DeFi Lending protocol",
    description:
      "Cross-platform Flutter + Solidity-based app enabling decentralized credit lending. Deployed on Ethereum L2s with smart contract-based credit scoring.",
    icon: Zap,
    tech: ["Solidity", "Flutter", "Ethereum L2", "DeFi"],
    category: "ETHIndia '23",
    demo: "https://github.com/rythmern02/instacredit",
    code: "https://ethglobal.com/showcase/instacredit-2zwjr",
  },
  {
    title: "LiarsPoker",
    subtitle: "On-chain Bluffing Game",
    description:
      "Classic card bluff game with Anchor framework (Solana) and EVM compatibility. Real-time multiplayer and game logic fully on-chain.",
    icon: Gamepad2,
    tech: ["Rust", "Anchor", "Solana", "EVM"],
    category: "Gaming",
    demo: "https://github.com/rythmern02/liarspoker-Sol",
    code: "https://liarspoker-sol.vercel.app",
  },
  {
    title: "Cards Against Humanity: Blink Edition",
    subtitle: "Solana Dialect Game",
    description:
      "On-chain version of the viral party game built using Solana Blink for instant gameplay and DAO-friendly fun.",
    icon: Play,
    tech: ["Solana Blink", "Rust", "Gaming", "DAO"],
    category: "Social Gaming",
    demo: "https://cards-against-humanity-ten.vercel.app/",
    code: "https://github.com/rythmern02/Cards-Against-Humanity",
  },
  {
    title: "TerraGuardians",
    subtitle: "AI + IoT Waste Management",
    description:
      "Drone + AI-based waste detection system logging reports to a blockchain dashboard. A real-world impact dApp.",
    icon: Brain,
    tech: ["AI", "IoT", "Blockchain", "Environmental"],
    category: "Impact",
    demo: "https://github.com/rythmern02/TerraGuardians",
    code: "https://github.com/rythmern02/TerraGuardians",
  },
  {
    title: "HomeDapp",
    subtitle: "Decentralized Real Estate",
    description:
      "Ethereum-based registry for property listing, buying/selling, and title verification, a Web3-native alternative to MagicBricks.",
    icon: Home,
    tech: ["Ethereum", "Smart Contracts", "Real Estate", "Web3"],
    category: "PropTech",
    demo: "https://github.com/rythmern02/HomeDapp",
    code: "https://github.com/rythmern02/HomeDapp",
  },
  {
    title: "Web3 Development Playlists",
    subtitle: "Educational Content",
    description:
      "Created structured video content for Web3 developers covering Solana development basics and blockchain fundamentals.",
    icon: Shield,
    tech: ["Education", "Solana", "Content Creation", "Community"],
    category: "Education",
    demo: "https://www.youtube.com/@web3spell",
    code: "https://www.youtube.com/@Web3Spell/playlists",
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" id="projects">
      {/* Torn Paper Background */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M0,200 Q300,150 600,200 T1200,180 L1200,0 L0,0 Z"
            fill="white"
            className="animate-pulse"
          />
          <path
            d="M0,600 Q400,550 800,600 T1200,580 L1200,800 L0,800 Z"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Ink Splatter Effects */}
      <div className="absolute top-20 right-20 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full blur-sm"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-white rounded-full blur-sm"></div>
      </div>

      {/* Geometric Wire Frames */}
      <div className="absolute bottom-40 left-10 opacity-5">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <polygon
            points="100,20 180,60 160,140 40,140 20,60"
            stroke="white"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <circle
            cx="100"
            cy="100"
            r="30"
            stroke="white"
            strokeWidth="1"
            fill="none"
            className="animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <rect
            x="70"
            y="70"
            width="60"
            height="60"
            stroke="white"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header with Paper Texture */}
        <div className="text-center space-y-4 relative">
          <div className="absolute inset-0 -z-10 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <path
                d="M50,50 Q100,30 150,50 T250,45 Q300,40 350,50 L350,150 Q300,140 250,145 T150,150 Q100,160 50,150 Z"
                fill="white"
                className="animate-pulse"
              />
            </svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white relative">
            Project Highlights
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-white opacity-20 animate-pulse"></div>
          </h2>
          <p className="text-xl text-gray-300 text-balance">
            Innovative blockchain solutions across DeFi, Gaming, AI, and
            Real-world Applications
          </p>
        </div>

        {/* Projects Grid with Paper Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card
                key={index}
                className="group bg-black border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-2 opacity-20">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 300 20"
                    fill="none"
                  >
                    <path
                      d="M0,10 Q50,5 100,10 T200,8 Q250,6 300,10 L300,20 L0,20 Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <CardHeader className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-white/10 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-white/30 text-white bg-white/5"
                    >
                      {project.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-xl text-white group-hover:text-white/90 transition-all duration-300">
                      {project.title}
                    </CardTitle>
                    <p className="text-sm font-medium text-gray-300">
                      {project.subtitle}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                  </div>
                </CardContent>

                <div className="absolute bottom-0 left-0 w-full h-1 opacity-20">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 300 10"
                    fill="none"
                  >
                    <path
                      d="M0,5 Q75,2 150,5 T300,3 L300,10 L0,10 Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Section with Ink Splashes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute bottom-0 right-1/4 w-16 h-16 bg-white rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {[
            { number: "40,000$+", label: "Funds Raised" },
            { number: "700+", label: "Developers Onboarded" },
            { number: "50,000+", label: "Work Hours" },
            { number: "200K+", label: "Organic Impressions" },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-2 group relative">
              <div className="absolute inset-0 -z-10 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <polygon
                    points="20,20 80,25 75,80 15,75"
                    fill="white"
                    className="animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                </svg>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white group-hover:scale-110 transition-transform relative z-10">
                {stat.number}
              </div>
              <div className="text-sm text-gray-200 relative z-10">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
