export interface ProductTier {
  id: string;
  name: string;
  price: number;
  stripePriceId: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface ProductPath {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  tiers: ProductTier[];
}

export interface BundleProduct {
  id: string;
  name: string;
  tagline: string;
  price: number;
  stripePriceId: string;
  description: string;
  features: string[];
}

export const PATHS: ProductPath[] = [
  {
    id: "beginner",
    name: "Beginner Path",
    tagline: "From ChatGPT copy-paste to confident AI builder",
    icon: "🚀",
    tiers: [
      {
        id: "beginner-starter",
        name: "Starter",
        price: 19,
        stripePriceId: "price_1TiTAK4ZC8mn9BJsYDhgIqfV",
        description: "The essentials to get started with real AI development",
        features: [
          "Core guide: From zero to AI-powered workflow",
          "2 worked examples with step-by-step walkthrough",
          "Tool setup checklist (what to install, what to skip)",
          "Prompt templates for common tasks",
          "PDF format — yours forever",
        ],
      },
      {
        id: "beginner-growth",
        name: "Growth",
        price: 39,
        stripePriceId: "price_1TiTAL4ZC8mn9BJsbttOPGDh",
        highlighted: true,
        description: "Triple the examples, triple the confidence",
        features: [
          "Everything in Starter",
          "6 worked examples across different use cases",
          "Extended tool comparison guide",
          "Common mistakes & how to avoid them",
          "Prompt refinement techniques",
          "Real project templates you can reuse",
        ],
      },
      {
        id: "beginner-complete",
        name: "Complete",
        price: 99,
        stripePriceId: "price_1TiTAL4ZC8mn9BJsk5YSMlrl",
        description: "The full beginner arsenal — nothing held back",
        features: [
          "Everything in Growth",
          "12+ worked examples with full source code",
          "Token optimization guide — save money on every prompt",
          "Advanced prompt patterns for complex tasks",
          "Troubleshooting playbook",
          "Private community access (coming soon)",
        ],
      },
    ],
  },
  {
    id: "principal",
    name: "Principal Engineer Path",
    tagline: "AI-driven development for experienced builders",
    icon: "⚡",
    tiers: [
      {
        id: "principal-starter",
        name: "Starter",
        price: 29,
        stripePriceId: "price_1TiTAM4ZC8mn9BJsJGuZSF70",
        description: "Level up from code generation to AI-driven architecture",
        features: [
          "AI-driven development methodology guide",
          "2 production-grade worked examples",
          "Tool stack for professional AI development",
          "Reasoning model comparison & when to use each",
          "PDF format — yours forever",
        ],
      },
      {
        id: "principal-growth",
        name: "Growth",
        price: 49,
        stripePriceId: "price_1TiTAN4ZC8mn9BJsKoZ4FUqc",
        highlighted: true,
        description: "Deep patterns for AI-augmented engineering",
        features: [
          "Everything in Starter",
          "6 production examples with architectural decisions",
          "MCP servers & agentic workflow setup",
          "Context management strategies",
          "Jira / project management AI integration",
          "CI/CD with AI quality gates",
        ],
      },
      {
        id: "principal-complete",
        name: "Complete",
        price: 99,
        stripePriceId: "price_1TiTAO4ZC8mn9BJsTnRTRXgK",
        description: "The complete principal engineer's AI toolkit",
        features: [
          "Everything in Growth",
          "12+ advanced examples with full repos",
          "Token cost optimization at scale",
          "Custom agent development patterns",
          "AI code review automation",
          "Team adoption playbook",
          "Architecture decision records with AI",
        ],
      },
    ],
  },
];

export const BUNDLE: BundleProduct = {
  id: "complete-bundle",
  name: "Complete Bundle",
  tagline: "Both paths. All tiers. Plus exclusive bonus content.",
  price: 129,
  stripePriceId: "price_1TiTAP4ZC8mn9BJsqVAgRNHL",
  description: "The ultimate AI development package",
  features: [
    "Full Beginner Path (all 3 tiers)",
    "Full Principal Engineer Path (all 3 tiers)",
    "24+ worked examples with source code",
    "Exclusive: Advanced token optimization playbook",
    "Exclusive: Cost-saving strategies that pay for themselves",
    "Exclusive: Prompt library with 50+ battle-tested templates",
    "Exclusive: Monthly tips & tricks newsletter",
    "Best value — save $69 vs buying separately",
  ],
};

export function getProductById(id: string): ProductTier | BundleProduct | undefined {
  if (id === BUNDLE.id) return BUNDLE;
  for (const path of PATHS) {
    const tier = path.tiers.find((t) => t.id === id);
    if (tier) return tier;
  }
  return undefined;
}

export function getStripePriceId(productId: string): string | undefined {
  const product = getProductById(productId);
  return product?.stripePriceId;
}
