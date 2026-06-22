export default function PathsOverview() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
            Two Guides, One Goal
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Pick where you are.
            <br />
            <span className="gradient-text">We&apos;ll take you further.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Essentials */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-10 hover:border-primary/30 transition-all duration-300 group">
            <div className="text-5xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold mb-3">Essentials</h3>
            <p className="text-muted leading-relaxed mb-6">
              Everything you need to build with AI, nothing you don&apos;t.
              The right tools, the right techniques, real results
              - from first prompt to confident builder.
            </p>
            <div className="text-sm text-muted mb-6">
              <span className="text-foreground font-semibold">$19</span> one-time
            </div>
            <a
              href="#pricing"
              className="text-primary font-medium text-sm group-hover:underline"
            >
              Get started →
            </a>
          </div>

          {/* Frontier */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-10 hover:border-primary/30 transition-all duration-300 group">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold mb-3">Frontier</h3>
            <p className="text-muted leading-relaxed mb-6">
              You already build with AI. Now go further: reasoning,
              architecture, context management, and agentic workflows
              that put you ahead of everyone else.
            </p>
            <div className="text-sm text-muted mb-6">
              <span className="text-foreground font-semibold">$29</span> one-time
            </div>
            <a
              href="#pricing"
              className="text-primary font-medium text-sm group-hover:underline"
            >
              Get started →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
