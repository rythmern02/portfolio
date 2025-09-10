"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Layers, Shield, Users, Zap, Brain } from "lucide-react"

const skillCategories = [
  {
    title: "Smart Contract Engineering",
    icon: Code,
    description: "Building secure and efficient blockchain applications",
    skills: [
      "Solidity",
      "Rust (Stylus, Anchor)",
      "Move (intermediate)",
      "Hardhat",
      "Foundry",
      "Remix",
      "NFT & Token Standards",
      "Smart Contract Auditing",
    ],
    gradient: "from-primary to-accent",
  },
  {
    title: "Full-Stack Infrastructure",
    icon: Layers,
    description: "End-to-end development and deployment solutions",
    skills: [
      "JavaScript",
      "TypeScript",
      "Next.js",
      "React Native",
      "Python",
      "Django",
      "Ethers.js",
      "Wagmi",
      "RPC Configuration",
      "IPFS",
      "Web3Auth",
    ],
    gradient: "from-accent to-primary",
  },
  {
    title: "Developer Support & Security",
    icon: Shield,
    description: "Ensuring robust and secure blockchain systems",
    skills: [
      "Debugging",
      "Encryption & Security",
      "RPC Endpoint Management",
      "Cross-Chain Integration",
      "Wallet SDKs",
      "Deployment",
      "Git & CI/CD",
      "Cloud Management",
    ],
    gradient: "from-primary/80 to-accent/80",
  },
  {
    title: "Community & DevRel",
    icon: Users,
    description: "Building and nurturing developer communities",
    skills: [
      "Developer Content Strategy",
      "Technical Writing",
      "Community Building",
      "DevRel Campaigns",
      "Ambassador Programs",
      "Event Management",
      "Growth Loops",
    ],
    gradient: "from-accent/80 to-primary",
  },
  {
    title: "Business Development",
    icon: Zap,
    description: "Strategic growth and ecosystem development",
    skills: [
      "Go-To-Market Planning",
      "Business Development",
      "Ecosystem Growth",
      "Project Coordination",
      "Notion & Webflow Ops",
      "Discord Analytics",
      "Web3 Marketing",
    ],
    gradient: "from-primary to-accent/80",
  },
  {
    title: "Emerging Technologies",
    icon: Brain,
    description: "Cutting-edge blockchain and AI integration",
    skills: [
      "AI x Blockchain",
      "RWA Integration",
      "Cross-Chain Protocols",
      "Wormhole",
      "Push Protocol",
      "Oraichain",
      "DeFi Protocols",
      "Layer 2 Solutions",
    ],
    gradient: "from-accent to-primary/80",
  },
]

export default function SkillsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Shattered Glass Effect */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
          <polygon
            points="200,100 400,80 350,250 150,280"
            stroke="white"
            strokeWidth="1"
            fill="white"
            className="animate-pulse"
          />
          <polygon
            points="600,150 800,120 750,300 550,320"
            stroke="white"
            strokeWidth="1"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <polygon
            points="900,200 1100,180 1050,400 850,420"
            stroke="white"
            strokeWidth="1"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Code Fragment Floating */}
      <div className="absolute top-20 right-10 opacity-10 text-white font-mono text-xs">
        <div className="animate-pulse">
          <div>pragma solidity ^0.8.0;</div>
          <div>contract Wizard {`{`}</div>
          <div>&nbsp;&nbsp;mapping(address =&gt; uint) magic;</div>
          <div>{`}`}</div>
        </div>
      </div>

      {/* Binary Rain Effect */}
      <div className="absolute left-10 top-1/2 opacity-5 text-white font-mono text-xs">
        <div className="animate-pulse flex flex-col space-y-1">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
              {Math.random().toString(2).substr(2, 8)}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header with Cracked Paper */}
        <div className="text-center space-y-4 relative">
          {/* Cracked paper effect behind header */}
          <div className="absolute inset-0 -z-10 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <path
                d="M50,60 L100,50 L150,65 L200,55 L250,70 L300,60 L350,75 L350,140 L300,130 L250,145 L200,135 L150,150 L100,140 L50,155 Z"
                fill="white"
                stroke="white"
                strokeWidth="1"
                className="animate-pulse"
              />
              {/* Crack lines */}
              <line x1="150" y1="50" x2="160" y2="160" stroke="white" strokeWidth="0.5" className="animate-pulse" />
              <line x1="250" y1="55" x2="240" y2="150" stroke="white" strokeWidth="0.5" className="animate-pulse" />
            </svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white relative">
            Technical Expertise
            {/* Scattered dots effect */}
            <div className="absolute -top-4 -right-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div
              className="absolute -bottom-4 -left-4 w-1 h-1 bg-white rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </h2>
          <p className="text-xl text-gray-300 text-balance">
            Comprehensive blockchain development and community building skills
          </p>
        </div>

        {/* Skills Grid with Torn Paper Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card
                key={index}
                className="group bg-black border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Torn paper corner effect */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                    <path d="M32,0 L32,20 Q25,15 20,20 L0,0 Z" fill="white" />
                  </svg>
                </div>

                <CardHeader className="space-y-4 relative z-10">
                  <div className="w-fit p-3 rounded-lg bg-white/10 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-xl text-white group-hover:text-white/90 transition-all duration-300">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400 leading-relaxed">{category.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors cursor-default"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                {/* Ink stain effect */}
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/10 rounded-full blur-sm animate-pulse"></div>
              </Card>
            )
          })}
        </div>

        {/* Education Section with Manuscript Style */}
        <div className="space-y-8 pt-16 relative">
          {/* Manuscript background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
              <rect x="50" y="50" width="700" height="300" fill="white" stroke="white" strokeWidth="2" rx="10" />
              {/* Manuscript lines */}
              {Array.from({ length: 15 }, (_, i) => (
                <line
                  key={i}
                  x1="80"
                  y1={80 + i * 18}
                  x2="720"
                  y2={80 + i * 18}
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
            </svg>
          </div>

          <div className="text-center space-y-4 relative z-10">
            <h3 className="text-3xl font-bold text-white">Education & Certifications</h3>
            <p className="text-gray-200">Continuous learning in blockchain and emerging technologies</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                title: "Blockchain Development",
                institution: "Alchemy University",
                period: "2023-24",
                focus: "Smart Contract Security, Testing, DApp Architectures",
              },
              {
                title: "Solana Development",
                institution: "Narra8ive",
                period: "2023-24",
                focus: "Rust, Anchor Framework, Solana Dev Tooling",
              },
              {
                title: "Computer Science Engineering",
                institution: "Samrat Ashoka Technological Institute",
                period: "2022-25",
                focus: "Core CS fundamentals and software engineering",
              },
            ].map((edu, index) => (
              <Card
                key={index}
                className="group bg-black border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-md hover:shadow-white/10 relative overflow-hidden"
              >
                {/* Certificate seal effect */}
                <div className="absolute top-2 right-2 w-6 h-6 border-2 border-white/20 rounded-full opacity-30">
                  <div className="w-2 h-2 bg-white/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <CardContent className="p-6 space-y-3 relative z-10">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white group-hover:text-white/90 transition-all">{edu.title}</h4>
                    <p className="text-sm font-medium text-gray-300">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.period}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{edu.focus}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
