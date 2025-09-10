"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    title: "CO FOUNDER",
    company: "Web3spell",
    location: "Universe",
    period: "June 2024 – Present",
    description:
      "Founded and scaled a builder-first Web3EdTech venture delivering modular blockchain education and ecosystem activation.",
    achievements: [
      "Led full-spectrum execution of cross-chain bootcamps and hackathons (Solana, Arbitrum, Ethereum), driving 700+ developer onboarding",
      "Produced 150+ dApp prototypes through structured learning programs",
      "Spearheaded technical architecture, dev curriculum (Rust, Solidity), and async contributor flows",
      "Engineered content-led growth loops via blogs, threads, and AMAs, generating 200K+ organic impressions",
    ],
    tech: ["Solidity", "Rust", "Next.js", "Community Building"],
  },
  {
    title: "ALL STACK BLOCKCHAIN DEV",
    company: "Freelance",
    location: "Universe",
    period: "Jan 2024 – Present",
    description:
      "Delivered full spectrum blockchain solutions for global clients across EVM and Solana ecosystems.",
    achievements: [
      "Built and deployed NFT/token staking platforms, DeFi dashboards, and credit-lending protocols",
      "Led end-to-end architecture, smart contract development, and cloud-based deployments",
      "Interfaced with clients to translate business logic into scalable, secure blockchain products",
      "Ensured on-time delivery and performance integrity for production-ready dApps",
    ],
    tech: ["Solidity", "Rust", "TypeScript", "Web3", "DeFi"],
  },
];

const ecosystemRoles = [
  {
    role: "SNS Ambassador",
    org: "Solana Name Service",
    focus: "Decentralized Identity",
  },
  {
    role: "Superteam Member",
    org: "Superteam",
    focus: "Protocol Missions & Grants",
  },
  {
    role: "Developer Advocate",
    org: "Oraichain",
    focus: "AI x Blockchain Tooling",
  },
  {
    role: "Push Protocol Ambassador",
    org: "Push Protocol",
    focus: "Notification Infrastructure",
  },
  {
    role: "CoinDCX Maxi",
    org: "CoinDCX",
    focus: "Spreading Web3 awareness",
  },
  {
    role: "Verbwire Advocate",
    org: "Push Protocol",
    focus: "Blockchain Infrastructure",
  },
  {
    role: "Mentor",
    org: "Paris Blockchain Week",
    focus: "Onboarding devs and Dapp building on Solana",
  },
  {
    role: "Speaker",
    org: "Arbitrum Ignite & Core Nexus",
    focus: "14-day Bootcamp + hackathon for 250+ learners",
  },
  {
    role: "Mentor",
    org: "GirlScript Summer of Code",
    focus: "Open Source Web3",
  },
  {
    role: "Mentor",
    org: "Winter of Blockchain",
    focus: "Web3 Guidance",
  },
  {
    role: "Speaker",
    org: "Web3camp",
    focus: "National level blockchain bootcamp",
  },
];

export default function ExperienceSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Large torn paper with experience text */}
        <div className="absolute top-10 right-10 w-80 h-60 bg-white/5 transform -rotate-12 animate-float-slow">
          <div
            className="w-full h-full bg-gradient-to-br from-white/8 to-transparent border border-white/20 shadow-2xl backdrop-blur-sm"
            style={{
              clipPath:
                "polygon(0% 0%, 95% 0%, 100% 25%, 90% 100%, 0% 95%, 5% 70%)",
            }}
          >
            <div className="p-6 text-white/40 font-mono text-xs leading-relaxed">
              <div className="text-white/60 font-bold mb-2">EXPERIENCE.md</div>
              <div>├── Web3spell (Co-Founder)</div>
              <div>├── Freelance (Full Stack)</div>
              <div>├── 700+ Developers Onboarded</div>
              <div>├── $40,000+ Grants Raised</div>
              <div>└── 150+ dApp Prototypes</div>
            </div>
          </div>
        </div>

        {/* Abstract ink splash */}
        <div className="absolute bottom-20 left-20 w-48 h-48 opacity-10">
          <div
            className="w-full h-full bg-white transform rotate-45"
            style={{
              clipPath:
                "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
            }}
          ></div>
        </div>

        {/* Code fragments */}
        <div className="absolute top-1/2 left-10 bg-black/95 border border-white/30 p-3 transform rotate-3 animate-float font-mono text-xs text-white/70 shadow-xl">
          <div className="text-white/50">// Building Web3 Future</div>
          <div className="text-white">const impact = {`{`}</div>
          <div className="text-white/80 ml-2">developers: 700+,</div>
          <div className="text-white/80 ml-2">grants: "$40k+"</div>
          <div className="text-white">{`}`};</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
            Professional Experience
          </h2>
          <p className="text-xl text-white/70 text-balance">
            Building the future of decentralized systems through code,
            community, and education
          </p>
        </div>

        {/* Main Experience */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className="group hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 bg-black/40 backdrop-blur-sm border-white/20"
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl text-white group-hover:drop-shadow-lg transition-all">
                      {exp.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-white/60 mt-2">
                      <span className="font-semibold text-white/90">
                        {exp.company}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-white/70 leading-relaxed">
                  {exp.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-white/90">
                    Key Achievements:
                  </h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-white/60"
                      >
                        <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-white/10 text-white/80 border-white/20 backdrop-blur-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ecosystem Involvement */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-white drop-shadow-xl">
              Ecosystem Involvement
            </h3>
            <p className="text-white/70">
              Active contributor across the Web3 ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemRoles.map((role, index) => (
              <Card
                key={index}
                className="group hover:border-white/50 transition-all duration-300 hover:shadow-md hover:shadow-white/10 bg-black/30 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white group-hover:drop-shadow-lg transition-all">
                      {role.role}
                    </h4>
                    <p className="text-sm font-medium text-white/90">
                      {role.org}
                    </p>
                    <p className="text-sm text-white/60">{role.focus}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
