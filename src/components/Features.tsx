const features = [
  {
    icon: "🎯",
    title: "The Right Tools, Not All Tools",
    description:
      "We cut through the noise. Learn which AI tools actually deliver results and which ones waste your time and money.",
  },
  {
    icon: "⚡",
    title: "Multiply Your Output",
    description:
      "Real techniques to go from copy-pasting ChatGPT to building production-ready solutions 10x faster.",
  },
  {
    icon: "🧠",
    title: "Beyond Code Generation",
    description:
      "AI-driven analysis, reasoning, architecture decisions, and project management. Not just monkey-code.",
  },
  {
    icon: "💰",
    title: "Save Tokens, Save Money",
    description:
      "Advanced optimization techniques that reduce your AI costs while improving output quality.",
  },
  {
    icon: "🔧",
    title: "Real Worked Examples",
    description:
      "Step-by-step walkthroughs of actual projects, not toy demos. Every example is production-grade.",
  },
  {
    icon: "🚀",
    title: "From Zero to Confident",
    description:
      "Whether you're a beginner or senior engineer, you'll gain unshakeable confidence in AI-assisted development.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 px-6 bg-section-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
            What&apos;s Inside
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything you need to
            <br />
            <span className="gradient-text">get ahead with AI.</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            No fluff. No theory-only chapters. Every section is designed to
            give you immediately actionable skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card-bg border border-card-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
