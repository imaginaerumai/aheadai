"use client";

import { useState } from "react";
import { PATHS, BUNDLE } from "@/lib/products";
import PricingCard from "./PricingCard";

const tabs = [
  { id: "beginner", label: "Essentials" },
  { id: "principal", label: "Frontier" },
  { id: "bundle", label: "Premium Pack" },
];

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState("beginner");

  const activePath = PATHS.find((p) => p.id === activeTab);

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Choose your path.
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            One-time purchase. No subscriptions. Yours forever.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-section-alt rounded-full p-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Path tiers */}
        {activePath && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {activePath.tiers.map((tier) => (
              <PricingCard
                key={tier.id}
                name={tier.name}
                price={tier.price}
                description={tier.description}
                features={tier.features}
                highlighted={tier.highlighted}
                productId={tier.id}
              />
            ))}
          </div>
        )}

        {/* Bundle */}
        {activeTab === "bundle" && (
          <div className="max-w-lg mx-auto">
            <PricingCard
              name={BUNDLE.name}
              price={BUNDLE.price}
              description={BUNDLE.description}
              features={BUNDLE.features}
              highlighted
              productId={BUNDLE.id}
            />
          </div>
        )}

        {/* Refund policy */}
        <p className="text-center text-muted text-sm mt-12">
          All sales are final. Due to the digital nature of this product, purchases are non-refundable.
        </p>
      </div>
    </section>
  );
}
