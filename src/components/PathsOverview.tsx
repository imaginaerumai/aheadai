export default function PathsOverview() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-4">
            Two Paths, One Goal
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Pick where you are.
            <br />
            <span className="gradient-text">We&apos;ll take you further.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {/* Beginner Path */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-10 hover:border-primary/30 transition-all duration-300 group">
            <div className="text-5xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold mb-3">Beginner Path</h3>
            <p className="text-muted leading-relaxed mb-6">
              You&apos;ve used ChatGPT but you&apos;re still copy-pasting responses.
              This path takes you from zero to confidently building with AI
              — the right tools, the right techniques, real results.
            </p>
            <div className="text-sm text-muted mb-6">
              Starting at <span className="text-foreground font-semibold">$19</span>
            </div>
            <a
              href="#pricing"
              className="text-primary font-medium text-sm group-hover:underline"
            >
              See tiers →
            </a>
          </div>

          {/* Principal Engineer Path */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-10 hover:border-primary/30 transition-all duration-300 group">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold mb-3">Principal Engineer Path</h3>
            <p className="text-muted leading-relaxed mb-6">
              You already code. You want AI-driven development with proper
              reasoning, analysis, context management, and Jira integration
              — not just autocomplete on steroids.
            </p>
            <div className="text-sm text-muted mb-6">
              Starting at <span className="text-foreground font-semibold">$29</span>
            </div>
            <a
              href="#pricing"
              className="text-primary font-medium text-sm group-hover:underline"
            >
              See tiers →
            </a>
          </div>
        </div>

        {/* Bundle teaser */}
        <div className="text-center">
          <p className="text-muted text-sm">
            Want everything?{" "}
            <a href="#pricing" className="text-primary font-medium hover:underline">
              Get the Complete Bundle for $129
            </a>{" "}
            and save $69.
          </p>
        </div>
      </div>
    </section>
  );
}
