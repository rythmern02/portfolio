// All copy and links for the site live here. Sources: the resume in /public and
// the Web3Spell Labs portfolio (labs.web3spell.fun). Keep numbers in sync with the resume.

export type Link = { label: string; href: string };

export type Proof = { label: string; href?: string };

export type CaseStudy = {
  name: string;
  role: string;
  period: string;
  chain: string;
  cover: string;
  summary: string;
  detail: string;
  stack: string[];
  proof: Proof[];
  live: string;
  code?: string;
  caseStudy?: string;
};

export type Build = {
  name: string;
  chain: string;
  year: string;
  image: string;
  what: string;
  live?: string;
  code: string;
};


export const profile = {
  name: "Rythme Nagrani",
  role: "Protocol Engineer & Developer Relations",
  statement:
    "I build onchain protocols and teach developers to build on them. I write the code I teach, so the docs, demos and tooling hold up in production.",
  location: "Bhopal, India · open to relocating to Singapore",
  availability: "Open to DevRel and protocol engineering roles",
  email: "rythmenagrani@gmail.com",
  resume: "/Rythme-Nagrani-Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/rythmern02" },
    { label: "X", href: "https://x.com/rythmern" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rythmern" },
    { label: "Hashnode", href: "https://rythme.hashnode.dev" },
  ] satisfies Link[],
};

export const labs = {
  home: "https://labs.web3spell.fun",
  work: "https://labs.web3spell.fun/work",
  portfolio: "https://labs.web3spell.fun/portfolio",
  spellcast: "https://labs.web3spell.fun/spellcast",
};

export const nav: Link[] = [
  { label: "Work", href: "#work" },
  { label: "Builds", href: "#builds" },
  { label: "Community", href: "#community" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

// The four facts a recruiter should see before scrolling.
export const headlineProof: Proof[] = [
  { label: "Winner, TOKEN2049 Origins Hackathon, Singapore" },
  {
    label: "$17K Compound grant, Certora-reviewed",
    href: "https://github.com/Web3Spell/chainpot/blob/main/smart-contracts/v4/CERTORA_REMEDIATION_REPORT.md",
  },
  { label: "75+ developer events, 5,000+ developers" },
  {
    label: "Author on the Rootstock Developer Portal",
    href: "https://dev.rootstock.io/use-cases/payments-assets/integrate-x402/",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    name: "ChainPot",
    role: "Founder & lead engineer",
    period: "2025 – now",
    chain: "Base",
    cover: "/work/chainpot.webp",
    summary: "Rotating savings circles (ROSCAs), the chit funds billions of people already use, run by smart contracts.",
    detail:
      "Members pool USDC each cycle. The payout goes to a Chainlink VRF draw or to the lowest bidder in a discount auction. Idle funds earn yield on Compound III, and 20% of the interest funds an insurance reserve.",
    stack: ["Solidity 0.8.24", "Foundry", "Compound III", "Chainlink VRF", "Next.js", "wagmi"],
    proof: [
      { label: "$17,000 Compound Protocol grant" },
      {
        label: "Certora review: all 21 findings fixed",
        href: "https://github.com/Web3Spell/chainpot/blob/main/smart-contracts/v4/CERTORA_REMEDIATION_REPORT.md",
      },
      { label: "48 / 48 Foundry tests passing", href: "https://github.com/Web3Spell/chainpot/tree/main/smart-contracts/v4/test" },
      {
        label: "Verified on Base Sepolia",
        href: "https://sepolia.basescan.org/address/0x3D5dd83A9977BBEA876F9380cfd56A6B9E064C95",
      },
    ],
    live: "https://chainpot.fun",
    code: "https://github.com/Web3Spell/chainpot",
    caseStudy: "https://labs.web3spell.fun/work/chainpot",
  },
  {
    name: "Civitas",
    role: "Co-founder & engineer",
    period: "2025 – 2026",
    chain: "Solana",
    cover: "/work/civitas.webp",
    summary: "Private payroll on Solana. Nobody outside the company can see who was paid or how much.",
    detail:
      "Salaries are stored as Nillion secret shares. Employees withdraw with Groth16 proofs that the program verifies onchain, and payments route through MagicBlock so amounts stay hidden. I wrote the Anchor program and the web app.",
    stack: ["Anchor (Rust)", "Circom", "Groth16", "Nillion", "MagicBlock", "Next.js"],
    proof: [
      { label: "Shipped on Solana devnet" },
      { label: "Colosseum Frontier Hackathon" },
    ],
    live: "https://meetcivitas.xyz",
    code: "https://github.com/MeetCivitas/Civitas-SOL",
    caseStudy: "https://labs.web3spell.fun/work/civitas",
  },
  {
    name: "Divergence Router",
    role: "Engineer",
    period: "2026",
    chain: "Somnia",
    cover: "/work/divergence-router.webp",
    summary: "A trading router that protects traders from fast-moving order books.",
    detail:
      "Before each order it measures price divergence, then places a maker order, a bounded IOC order, or halts. Both legs of a paired contract fill in one transaction, or the whole trade reverts.",
    stack: ["Solidity", "ERC-6909", "Viem", "Next.js", "DreamDEX"],
    proof: [{ label: "11 Solidity contracts, atomic settlement" }, { label: "Live app" }],
    live: "https://divergence-router.vercel.app",
    code: "https://github.com/rythmern02/Divergence-Router",
    caseStudy: "https://labs.web3spell.fun/work/divergence-router",
  },
];

// Rootstock work gets its own block: it is the clearest DevRel signal.
export const rootstock = {
  title: "Rootstock developer tooling",
  summary:
    "Built during the Rootstock Builder Rootcamp. Two guides I wrote are on Rootstock's official developer portal, and my lending starter kit is published in Rootstock's GitHub organisation.",
  links: [
    { label: "x402 payments guide", href: "https://dev.rootstock.io/use-cases/payments-assets/integrate-x402/" },
    { label: "LI.FI integration guide", href: "https://dev.rootstock.io/use-cases/interoperability/integrate-lifi/" },
    { label: "RBTC/USDT0 lending boilerplate (rsksmart)", href: "https://github.com/rsksmart/rbtc-usdt0-lending-boilerplate" },
    { label: "Fee-Radar: peg-out cost estimator", href: "https://github.com/rythmern02/Fee-Radar" },
    { label: "Permit-Wiz: EIP-712 signature debugger", href: "https://github.com/rythmern02/Permit-Wiz" },
  ] satisfies Link[],
};

export const builds: Build[] = [
  {
    name: "Rootstock Paymaster Kit",
    chain: "Rootstock",
    year: "2026",
    image: "/builds/rootstock-paymaster.webp",
    what: "ERC-4337 v0.7 paymaster so users pay gas in ERC-20 tokens instead of RBTC, with an off-chain signing service.",
    live: "https://explorer.testnet.rootstock.io/address/0x6f944C5EDeb5629ca4972eEeb6aEf998bC11783A",
    code: "https://github.com/rythmern02/Rootstock-Paymaster-Kit",
  },
  {
    name: "Liveness Vault",
    chain: "Rootstock",
    year: "2026",
    image: "/builds/liveness-vault.webp",
    what: "Staking where members send heartbeats and keepers slash anyone who goes quiet. Foundry invariant tests, full coverage.",
    live: "https://liveness-vault.vercel.app",
    code: "https://github.com/rythmern02/liveness-vault",
  },
  {
    name: "Swarm Broker",
    chain: "BOT Chain",
    year: "2026",
    image: "/builds/swarm-broker.webp",
    what: "AI agents paying each other for services over x402, settled with EIP-2612 permits.",
    code: "https://github.com/rythmern02/Swarm-Broker",
  },
  {
    name: "Labelo",
    chain: "Initia",
    year: "2026",
    image: "/builds/labelo.webp",
    what: "Marketplace that pays people onchain for labeling AI training data. Built for DoraHacks INITIATE.",
    live: "https://youtu.be/sFbP8MftqH0",
    code: "https://github.com/rythmern02/Labelo",
  },
  {
    name: "SkyScreen",
    chain: "WebGL",
    year: "2026",
    image: "/builds/skyscreen.webp",
    what: "Cinematic 3D site for an airborne display company: custom GLSL sky shaders and an exploded drone rig.",
    live: "https://skyscreen-one.vercel.app",
    code: "https://github.com/rythmern02/skyscreen",
  },
  {
    name: "Petoverse",
    chain: "Avalanche",
    year: "2025",
    image: "/builds/petoverse.webp",
    what: "AI companions in 3D that each own a smart wallet and act on their own.",
    live: "https://petoverse-web.vercel.app",
    code: "https://github.com/rythmern02/Petoverse-web",
  },
];

export const earlierWork: Link[] = [
  { label: "InstaCredit (ETHIndia '23)", href: "https://github.com/rythmern02/InstaCredit" },
  { label: "PokerLiars, an onchain bluffing game", href: "https://github.com/rythmern02/PokerLiars" },
  { label: "Cards Against Humanity Blink", href: "https://github.com/rythmern02/Cards-Against-Humanity" },
];

export const stats = [
  { value: "75+", label: "developer events run" },
  { value: "5,000+", label: "developers reached" },
  { value: "150+", label: "projects shipped at Core Nexus" },
  { value: "2", label: "global conference partnerships" },
];

export const events = [
  {
    name: "Core Nexus Hackathon",
    what: "36-hour hackathon in Bhopal: 250+ builders, 150+ project submissions.",
    caseStudy: "https://labs.web3spell.fun/work/core-nexus",
    image: "/work/core-nexus.webp",
  },
  {
    name: "Arbitrum Ignite",
    what: "12-day Web3 bootcamp for 250+ developers, run with the Arbitrum ecosystem.",
  },
  {
    name: "Hackathon build stations",
    what: "Solana, Helius, Story Protocol and Mantra stations. One Bhopal station sent 40+ projects to a global hackathon; several went on to win grants.",
  },
];

export const recognition = [
  "Winner, TOKEN2049 Origins Hackathon, Singapore",
  "Official community partner, TOKEN2049 Singapore 2025",
  "Official community partner, Consensus Hong Kong 2026",
  "Thrive Power List, Top 500",
  "Superteam grantee",
];

export const speaking = [
  "Paris Blockchain Week 2025 · mentor",
  "Arbitrum Ignite · speaker",
  "Core Nexus · mentor",
  "GirlScript Summer of Code · mentor",
  "Winter of Blockchain · mentor",
  "Web3camp · speaker",
];

export const spellcast = {
  href: labs.spellcast,
  youtube: "https://www.youtube.com/@web3spell",
  blurb: "A technical podcast with protocol founders and DevRel leads, including MagicBlock's DevRel lead, on stablecoin payments, ecosystem scaling and onchain privacy.",
};

export const writing: Link[] = [
  {
    label: "Why your crypto needs more than one key: Polkadot multisig",
    href: "https://rythme.hashnode.dev/why-your-crypto-needs-more-than-one-key-the-real-story-of-polkadot-multisig-wallets",
  },
  { label: "Wormhole and the fragmented Web3 landscape", href: "https://rythme.hashnode.dev/wormhole-bridging-the-fragmented-web3-landscape" },
  {
    label: "Okto SDK for multichain apps",
    href: "https://medium.com/@rythmenagrani/okto-sdk-your-ultimate-ticket-to-the-web3-multiverse-87a3cb2e6324",
  },
];

export const experience = [
  {
    org: "Web3Spell Labs",
    href: labs.home,
    role: "Co-founder · Engineering & Developer Relations",
    period: "2024 – now",
    points: [
      "Lead engineering for a studio shipping protocols on Solana, Base, Rootstock and Somnia, from contract design to testnet launch.",
      "Organised 75+ developer events reaching 5,000+ developers, including Arbitrum Ignite and Core Nexus.",
      "Host SpellCast, a podcast with protocol founders and DevRel leads.",
    ],
  },
  {
    org: "ChainPot",
    href: "https://chainpot.fun",
    role: "Founder & lead engineer",
    period: "2025 – now",
    points: ["Seven-contract savings-circle protocol on Base, funded by a $17K Compound grant and reviewed by Certora."],
  },
  {
    org: "Civitas",
    href: "https://meetcivitas.xyz",
    role: "Co-founder & engineer",
    period: "2025 – 2026",
    points: ["Private payroll on Solana with Groth16 proofs, Nillion and MagicBlock. Built for Colosseum Frontier."],
  },
  {
    org: "SNS · Oraichain · Push Protocol",
    role: "Freelance developer advocate",
    period: "2023 – 2025",
    points: ["Tutorials, workshops and onboarding as ambassador and developer advocate."],
  },
];

export const skills = [
  { group: "Smart contracts", items: ["Solidity", "Rust", "Anchor", "Foundry", "Hardhat", "Compound III", "ERC-4337", "ERC-6909", "EIP-712 / 2612"] },
  { group: "Chainlink & cross-chain", items: ["Chainlink CRE", "Chainlink VRF", "Circle CCTP"] },
  { group: "Security & testing", items: ["Foundry fuzz & invariant tests", "Certora review remediation", "Keeper & slashing design"] },
  { group: "ZK & privacy", items: ["Circom", "Groth16", "snarkjs", "Nillion MPC / TEE", "MagicBlock ephemeral rollups"] },
  { group: "Payments & agents", items: ["x402", "Paymasters", "Account abstraction", "Session keys", "Agent-to-agent payments"] },
  { group: "Full stack", items: ["TypeScript", "Next.js", "React", "Node.js", "Tailwind CSS", "Viem", "wagmi", "RainbowKit", "PostgreSQL", "MongoDB", "Docker", "Vercel"] },
  { group: "Creative web", items: ["Three.js", "React Three Fiber", "GLSL shaders", "Canvas & WebGL", "Motion design"] },
  { group: "Chains", items: ["Ethereum", "Base", "Arbitrum", "Solana", "Rootstock", "Starknet", "Initia", "Somnia"] },
  { group: "Developer relations", items: ["Docs as code", "Tutorials & guides", "Sample apps", "SDK onboarding", "Workshops & bootcamps", "Hackathon design & judging", "Podcasting"] },
];

export const education = {
  school: "Samrat Ashok Technological Institute (SATI), Vidisha",
  degree: "Computer Science Engineering",
  period: "",
  certs: "Solana Development (Rust, Anchor), Narra8ive · Blockchain Development, Alchemy University",
};

// Chapters of the scroll film at the top of the page. `window` is the slice of
// scroll progress (0 to 1) during which the chapter is on screen.
export type FilmChapter = {
  window: [number, number];
  lead?: string;
  word: string;
  body?: string;
  ctas?: Link[];
  note?: string;
};

export const film: FilmChapter[] = [
  {
    window: [0, 0.14],
    lead: "Protocol engineer · Developer relations",
    word: "Rythme Nagrani",
    body: "Open to DevRel and protocol engineering roles · Singapore or remote",
  },
  {
    window: [0.18, 0.36],
    lead: "If you're shipping onchain, I",
    word: "build.",
    body: "Protocols on Base, Solana, Rootstock and Somnia: Certora-reviewed DeFi, zero-knowledge payroll and execution engines.",
  },
  {
    window: [0.39, 0.55],
    lead: "If you're growing a developer ecosystem, I",
    word: "teach.",
    body: "75+ developer events and 5,000+ developers reached. Bootcamps, hackathons and docs, and I write the code behind them.",
  },
  {
    window: [0.58, 0.72],
    lead: "When it counts, I",
    word: "win.",
    body: "TOKEN2049 Origins Hackathon winner. $17K Compound grant. Author on the Rootstock Developer Portal.",
  },
  {
    window: [0.8, 1.01],
    word: "see what i've cast.",
    note: "Kamea of Jupiter · Agrippa, 1531 · the table for gain, favour and peace",
  },
];

export const booking = {
  url: "https://calendly.com/rythme/30min",
  length: "30 min",
};
