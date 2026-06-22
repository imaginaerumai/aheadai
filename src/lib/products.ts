export interface Product {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  price: number;
  stripePriceId: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "beginner-starter",
    name: "Essentials",
    tagline: "Everything you need to build with AI, nothing you don't",
    icon: "🚀",
    price: 19,
    stripePriceId: "price_1TiTAK4ZC8mn9BJsYDhgIqfV",
    description: "Your starting point for real AI development",
    features: [
      "Core guide: from zero to AI-powered workflow",
      "2 worked examples with step-by-step walkthrough",
      "Tool setup checklist (what to install, what to skip)",
      "Prompt templates for common tasks",
      "PDF format - yours forever",
    ],
  },
  {
    id: "principal-starter",
    name: "Frontier",
    tagline: "Advanced patterns that change how you build. No going back.",
    icon: "⚡",
    price: 29,
    stripePriceId: "price_1TiTAM4ZC8mn9BJsJGuZSF70",
    highlighted: true,
    description: "AI-driven development for builders who ship",
    features: [
      "AI-driven development methodology guide",
      "2 production-grade worked examples",
      "Tool stack for professional AI development",
      "Reasoning model comparison and when to use each",
      "Context management strategies",
      "PDF format - yours forever",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getStripePriceId(productId: string): string | undefined {
  const product = getProductById(productId);
  return product?.stripePriceId;
}
