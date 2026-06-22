"use client";

import { PRODUCTS } from "@/lib/products";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
            Start Here
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Pick your guide.
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            One-time purchase. No subscriptions. Yours forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRODUCTS.map((product) => (
            <PricingCard
              key={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              features={product.features}
              highlighted={product.highlighted}
              productId={product.id}
            />
          ))}
        </div>

        {/* Refund policy */}
        <p className="text-center text-muted text-sm mt-12">
          All sales are final. Due to the digital nature of this product, purchases are non-refundable.
        </p>
      </div>
    </section>
  );
}
