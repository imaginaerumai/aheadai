"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Who is this guide for?",
    answer:
      "We have two guides: Essentials is for anyone who has used ChatGPT but wants to go beyond copy-pasting. You'll learn the tools, techniques, and mindset to multiply your productivity. Frontier is for experienced developers who want to integrate AI into their professional workflow with proper reasoning, analysis, and tooling.",
  },
  {
    question: "What format is the content delivered in?",
    answer:
      "You'll receive a professionally formatted PDF guide that's yours to keep forever. After purchase, you'll get an immediate download link and a backup copy sent to your email.",
  },
  {
    question: "Is this just another prompt engineering course?",
    answer:
      "No. This is a hands-on, practical guide with real worked examples. Every technique is battle-tested in production environments. We cover tools, workflows, architecture, cost optimization. Not just how to write prompts.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "All sales are final. Due to the digital nature of this product, purchases are non-refundable. We encourage you to review the product details carefully before purchasing to ensure it's the right fit for you. If you experience any issues, reach out to us at contact@synairo.com.",
  },
  {
    question: "Will the content be updated?",
    answer:
      "AI tools evolve rapidly. We periodically release updated editions. As a buyer, you'll be notified of major updates and may receive discounted access to future editions.",
  },
  {
    question: "What's the difference between Essentials and Frontier?",
    answer:
      "Essentials is your starting point: the core guide with worked examples, tool setup, and prompt templates. Frontier goes deeper into AI-driven architecture, reasoning models, context management, and agentic workflows. Pick the one that matches where you are right now.",
  },
  {
    question: "I have a problem with my purchase. How can I get help?",
    answer:
      "Contact us at contact@synairo.com and we'll get back to you as soon as possible. Please include your purchase email and a description of the issue.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 px-6 bg-section-alt">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Questions? Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card-bg border border-card-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium pr-8">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <div
                className={`px-6 text-muted text-sm leading-relaxed transition-all duration-200 ${
                  openIndex === index
                    ? "pb-6 max-h-96 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
