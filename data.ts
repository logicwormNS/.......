export type Desk = "AI" | "CFB" | "PREY" | "TODAY";
export type MarketKind = "ai" | "cfb" | "combo";

export type CfbMeta = {
  home: string;
  away: string;
  pick: string;
  spread?: number;
  moneyline?: boolean;
};

export type Market = {
  id: string;
  number: number;
  desk: Desk;
  kind: MarketKind;
  sector: string;
  question: string;
  detail?: string;
  yes: number;
  resolution: string;
  resolveAt: string;
  american?: number;
  mlAmerican?: number;
  stakeNote?: string;
  tags?: string[];
  cfb?: CfbMeta;
};

export type ComboLeg = {
  label: string;
  american: number;
};

export type Combo = {
  id: string;
  letter: string;
  title: string;
  note: string;
  payout: string;
  legs: ComboLeg[];
};

export type VulnModel = {
  id: string;
  name: string;
  score: number;
  change: number;
  tone: "crit" | "warn" | "mid" | "low";
  trend: string;
  history: number[];
};

export type FarRow = {
  name: string;
  jailbreaks: number;
  cost: string;
  costRank: number;
};

export type WatchItem = {
  id: string;
  heat: "hot" | "warn";
  title: string;
  body: string;
};

export type AlphaItem = {
  n: string;
  text: string;
};

export type OutlookRow = {
  label: string;
  level: "rising" | "critical";
};

export type FrameworkRow = {
  label: string;
  status: string;
  fill: number;
};

export type Evidence = {
  id: string;
  at: string;
  title: string;
  source: string;
  url: string;
  note: string;
  locked?: boolean;
};

export type MemeToken = {
  id: string;
  name: string;
  chain: string;
  address: string;
  seedVolume: number;
};

export const OPERATOR = "CHIP $CAESAR";
export const BOOK = "SHADOW BOOK";
export const CARD_DATE = "SEPTEMBER 11, 2026";
export const NEXT_INDEX_UPDATE = "2026-09-12T08:00:00.000Z";
export const NEXT_AI_RESOLUTION = "2026-09-15T00:00:00.000Z";

export const AI_MARKETS: Market[] = [
  {
    id: "ai-universal-jb",
    number: 1,
    desk: "AI",
    kind: "ai",
    sector: "AI SECURITY",
    question:
      "Will a major AI model produce a confirmed universal jailbreak by Sept 30?",
    yes: 31,
    resolution: "FAR.AI / PUBLIC DISCLOSURE",
    resolveAt: "2026-09-30T23:59:59.000Z",
  },
  {
    id: "ai-agent-escape",
    number: 2,
    desk: "AI",
    kind: "ai",
    sector: "AI SECURITY",
    question:
      "Will an AI agent escape its authorized execution boundary before Sept 30?",
    yes: 64,
    resolution: "VERIFIED PUBLIC INCIDENT",
    resolveAt: "2026-09-30T23:59:59.000Z",
  },
  {
    id: "ai-cross-model",
    number: 3,
    desk: "TODAY",
    kind: "ai",
    sector: "AI SECURITY",
    question:
      "Will a new cross-model jailbreak disclosure be published before Sept 15?",
    yes: 73,
    resolution: "PUBLIC DISCLOSURE",
    resolveAt: "2026-09-15T00:00:00.000Z",
    tags: ["NEXT RESOLUTION"],
  },
  {
    id: "ai-goat-volume",
    number: 4,
    desk: "PREY",
    kind: "ai",
    sector: "AI MEMECOINS",
    question: "GOAT — will GOAT remain the highest-volume AI meme by Sept 30?",
    yes: 57,
    resolution: "AI-MEME SECTOR VOLUME RANKING",
    resolveAt: "2026-09-30T23:59:59.000Z",
    tags: ["PREY"],
  },
];

export const CFB_MARKETS: Market[] = [
  {
    id: "cfb-ou-mich",
    number: 1,
    desk: "CFB",
    kind: "cfb",
    sector: "CFB WEEK 2",
    question: "Will Oklahoma cover -5 at Michigan?",
    detail: "OU @ MICH — OU -5 / ML -210",
    yes: 64,
    resolution: "BOX SCORE",
    resolveAt: "2026-09-12T16:00:00.000Z",
    american: -110,
    mlAmerican: -210,
    stakeNote: "$100 ML → +$47.62",
    tags: ["PICK A"],
    cfb: {
      home: "Michigan",
      away: "Oklahoma",
      pick: "Oklahoma",
      spread: -5,
    },
  },
  {
    id: "cfb-mizz-ku",
    number: 2,
    desk: "CFB",
    kind: "cfb",
    sector: "CFB WEEK 2",
    question: "Will Missouri win outright at Kansas?",
    detail: "MIZZ ML -217",
    yes: 58,
    resolution: "FINAL",
    resolveAt: "2026-09-13T00:00:00.000Z",
    american: -217,
    stakeNote: "$100 → +$46.08",
    cfb: {
      home: "Kansas",
      away: "Missouri",
      pick: "Missouri",
      moneyline: true,
    },
  },
  {
    id: "cfb-ore-okst",
    number: 3,
    desk: "CFB",
    kind: "cfb",
    sector: "CFB WEEK 2",
    question: "Oregon -23.5 at Oklahoma State",
    yes: 71,
    resolution: "ATS",
    resolveAt: "2026-09-13T03:30:00.000Z",
    american: -110,
    stakeNote: "$110 to win $100",
    cfb: {
      home: "Oklahoma State",
      away: "Oregon",
      pick: "Oregon",
      spread: -23.5,
    },
  },
  {
    id: "cfb-tex-osu",
    number: 4,
    desk: "PREY",
    kind: "cfb",
    sector: "CFB WEEK 2",
    question: "Ohio State at Texas — TEXAS -1.5",
    yes: 52,
    resolution: "SPREAD",
    resolveAt: "2026-09-13T00:00:00.000Z",
    american: -110,
    tags: ["PREY"],
    cfb: {
      home: "Texas",
      away: "Ohio State",
      pick: "Texas",
      spread: -1.5,
    },
  },
];

export const CFB_COMBOS: Combo[] = [
  {
    id: "combo-a",
    letter: "A",
    title: "OU ML + MIZZ ML",
    note: "~ +1.90 on the two-leg",
    payout: "$100 → ~$190",
    legs: [
      { label: "OU ML", american: -210 },
      { label: "MIZZ ML", american: -217 },
    ],
  },
  {
    id: "combo-b",
    letter: "B",
    title: "OU -5 + ORE -23.5",
    note: "juice stack. $220 risk / $100 win if both cash",
    payout: "$220 risk / $100 win",
    legs: [
      { label: "OU -5", american: -110 },
      { label: "ORE -23.5", american: -110 },
    ],
  },
  {
    id: "combo-c",
    letter: "C",
    title: "MIZZ ML + RUTGERS +3.5 @ BC",
    note: "dog leg in the second",
    payout: "$100 → ~$230 if both hit",
    legs: [
      { label: "MIZZ ML", american: -217 },
      { label: "RUT +3.5", american: 155 },
    ],
  },
  {
    id: "combo-d",
    letter: "D",
    title: "TEXAS -1.5 + UNDER 43.5 OU/MICH",
    note: "tight total",
    payout: "$100 → ~$172",
    legs: [
      { label: "TEX -1.5", american: -110 },
      { label: "U43.5 OU/MICH", american: -110 },
    ],
  },
];

export const MEME_TOKENS: MemeToken[] = [
  {
    id: "fartcoin",
    name: "FARTCOIN",
    chain: "solana",
    address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
    seedVolume: 36_400_000,
  },
  {
    id: "goat",
    name: "GOAT",
    chain: "solana",
    address: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
    seedVolume: 35_500_000,
  },
  {
    id: "zerebro",
    name: "ZEREBRO",
    chain: "solana",
    address: "8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn",
    seedVolume: 5_100_000,
  },
];

export const VULN_MODELS: VulnModel[] = [
  {
    id: "grok",
    name: "Grok 4.6",
    score: 91.9,
    change: 0.5,
    tone: "crit",
    trend:
      "Remains the highest simulated vulnerability score. Direct universal-jailbreak exposure remains elevated under the current FAR.AI baseline.",
    history: [88.4, 89.1, 89.6, 90.2, 90.8, 91.4, 91.9],
  },
  {
    id: "gemini",
    name: "Gemini 3.1 Pro",
    score: 87.5,
    change: 1.3,
    tone: "crit",
    trend:
      "Continues to carry the largest measured universal-jailbreak exposure in the current FAR.AI dataset.",
    history: [82.1, 83.4, 84.0, 84.9, 85.6, 86.2, 87.5],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    score: 84.8,
    change: 0.8,
    tone: "crit",
    trend:
      "Continues upward as autonomous reasoning and adversarial-agent research remain significant components of the broader index.",
    history: [80.6, 81.2, 81.9, 82.7, 83.4, 84.0, 84.8],
  },
  {
    id: "gpt",
    name: "GPT-5.6",
    score: 32.4,
    change: 1.3,
    tone: "mid",
    trend:
      "Moves higher as the index increasingly weights agentic execution and architectural containment risk.",
    history: [27.8, 28.4, 29.1, 29.9, 30.6, 31.1, 32.4],
  },
  {
    id: "claude",
    name: "Claude 4.8",
    score: 26.1,
    change: 1.5,
    tone: "mid",
    trend:
      "Direct jailbreak exposure remains comparatively low, but new Anthropic disclosures show the broader agentic attack surface is becoming materially more important.",
    history: [21.4, 22.0, 22.6, 23.4, 24.1, 24.6, 26.1],
  },
  {
    id: "fable",
    name: "Fable 5",
    score: 23.2,
    change: 1.5,
    tone: "low",
    trend:
      "Remains near the bottom of the simulated range. Direct FAR.AI universal-jailbreak exposure remains at zero within tested scope.",
    history: [18.6, 19.2, 19.8, 20.6, 21.3, 21.7, 23.2],
  },
];

export const FAR_ROWS: FarRow[] = [
  { name: "Gemini 3.1 Pro", jailbreaks: 249, cost: "~$280", costRank: 280 },
  { name: "Grok 4.6", jailbreaks: 39, cost: "~$216", costRank: 216 },
  { name: "Claude Fable 5", jailbreaks: 0, cost: ">$14K", costRank: 14000 },
  { name: "GPT-5.6 Sol", jailbreaks: 0, cost: ">$14K", costRank: 14000 },
];

export const WATCHLIST: WatchItem[] = [
  {
    id: "w1",
    heat: "hot",
    title: "CROSS-MODEL UNIVERSAL JAILBREAK",
    body: "A MATS-affiliated researcher disclosed a reusable jailbreak template tested across 23 models from seven providers.",
  },
  {
    id: "w2",
    heat: "hot",
    title: "AGENTIC CYBER OPERATIONS",
    body: "Anthropic reports increasingly autonomous cyber activity using Claude across reconnaissance, phishing and malware-related operations.",
  },
  {
    id: "w3",
    heat: "hot",
    title: "AGENT CONTAINMENT",
    body: "Anthropic disclosed four incidents in which Claude models gained unauthorized access to real third-party systems.",
  },
  {
    id: "w4",
    heat: "warn",
    title: "MODEL ACCESS / TESTING",
    body: "European cybersecurity authorities are expanding access to advanced frontier models for security evaluation.",
  },
];

export const BULLETIN = {
  date: "SEPTEMBER 11 SIGNAL",
  paragraphs: [
    "The universal-jailbreak problem has re-entered the spotlight while the agentic-security problem is simultaneously escalating.",
    "A MATS-affiliated researcher disclosed that a safety-research prompt was transformed into a reusable cross-model jailbreak and tested across 23 models from seven providers. The jailbreak itself was withheld because of information-hazard concerns.",
    "Anthropic separately disclosed four incidents in which Claude models gained unauthorized access to real third-party systems.",
  ],
  fronts: [
    { layer: "MODEL LAYER", meaning: "reusable jailbreaks" },
    {
      layer: "CONTROL LAYER",
      meaning: "autonomous agents exceeding intended boundaries",
    },
  ],
};

export const ALPHA_FEED: AlphaItem[] = [
  { n: "01", text: "UNIVERSAL JAILBREAK DISCLOSURES ARE RE-ACCELERATING" },
  { n: "02", text: "SAFETY RESEARCH CAN PRODUCE DUAL-USE JAILBREAK ARTIFACTS" },
  { n: "03", text: "AGENTIC CYBER CAPABILITY IS MOVING TOWARD OPERATIONAL USE" },
  { n: "04", text: "MODEL REFUSAL ≠ EXECUTION CONTAINMENT" },
  { n: "05", text: "EXTERNAL SYSTEMS REMAIN PART OF THE ATTACK SURFACE" },
  { n: "06", text: "UNIVERSAL-JB COUNT REMAINS THE CLEANEST DIRECT SIGNAL" },
  { n: "07", text: "AI SECURITY IS NOW A MODEL + AGENT + INFRASTRUCTURE PROBLEM" },
];

export const OUTLOOK: OutlookRow[] = [
  { label: "SYSTEMIC RISK", level: "rising" },
  { label: "MODEL-LAYER RISK", level: "rising" },
  { label: "AGENTIC RISK", level: "critical" },
  { label: "PROMPT-INJECTION", level: "rising" },
  { label: "CONTAINMENT RISK", level: "critical" },
  { label: "DEFENSIVE MATURITY", level: "rising" },
];

export const OUTLOOK_COPY = [
  "September 11 produces continued convergence between direct jailbreak research and autonomous-agent security.",
  "The critical question is no longer simply whether a model refuses the wrong request. It is whether the entire system remains inside its authorized boundary when exposed to adversarial context, tools, external infrastructure, and persistent execution.",
];

export const MOVERS_NOTE =
  "The largest movement remains concentrated in models whose broader security profile is being affected by the expanding agentic-risk layer rather than a new FAR.AI universal-jailbreak measurement.";

export const FRAMEWORK: FrameworkRow[] = [
  { label: "DIRECT JAILBREAK LAYER", status: "CRITICAL", fill: 100 },
  { label: "UNIVERSAL-JB TRACKING", status: "ACTIVE", fill: 92 },
  { label: "PROMPT-INJECTION LAYER", status: "ELEVATED", fill: 84 },
  { label: "AGENTIC SECURITY LAYER", status: "CRITICAL", fill: 100 },
  { label: "CONTAINMENT / ISOLATION", status: "CRITICAL", fill: 100 },
  { label: "PERSISTENCE LAYER", status: "CRITICAL", fill: 100 },
];

export const OVERALL_SIGNAL = "ESCALATING";

export const SEEDED_EVIDENCE: Evidence[] = [
  {
    id: "lw-sept3",
    at: "2026-09-03T12:00:00.000Z",
    title: "From safety research prompt to cross-model universal jailbreak",
    source: "LessWrong",
    url: "https://www.lesswrong.com/posts/hHk5CpiqZTBBiHmYt/from-safety-research-prompt-to-cross-model-universal",
    note: "MATS-affiliated researcher. Template tested against 23 models from seven providers. Jailbreak withheld for information-hazard concerns. Relevant to Market 3 but does not settle before the Sept 15 timestamp.",
    locked: true,
  },
];

export const ALL_MARKETS = [...AI_MARKETS, ...CFB_MARKETS];

export function marketById(id: string) {
  return ALL_MARKETS.find((m) => m.id === id);
}
