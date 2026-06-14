"use client";

import { useState } from "react";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  productId: string;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  highlighted,
  productId,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:shadow-xl ${
        highlighted
          ? "bg-card-bg border-2 border-primary shadow-lg shadow-primary/10 scale-[1.02]"
          : "bg-card-bg border border-card-border hover:border-primary/30"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-muted text-sm">{description}</p>
      </div>

      <div className="mb-8">
        <span className="text-5xl font-bold">${price}</span>
        <span className="text-muted ml-2">one-time</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <svg
              className="w-5 h-5 text-primary shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleBuy}
        disabled={loading}
        className={`w-full py-3.5 rounded-full font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          highlighted
            ? "bg-primary hover:bg-primary-hover text-white"
            : "bg-foreground/5 hover:bg-foreground/10 text-foreground border border-card-border"
        }`}
      >
        {loading ? "Processing..." : "Get Started"}
      </button>
    </div>
  );
}
