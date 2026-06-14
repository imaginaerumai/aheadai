export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 px-6 overflow-hidden">
      {/* Subtle gradient orb background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-gradient-start/5 to-gradient-end/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <p className="text-primary font-medium text-sm tracking-wide uppercase mb-6 animate-fade-in-up">
          Stop guessing. Start building.
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 animate-fade-in-up delay-100">
          AI development
          <br />
          that{" "}
          <span className="gradient-text">actually works.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
          You&apos;re not getting 10% of what AI can do. This guide shows you the
          tools, patterns, and techniques to multiply your effectiveness
          5x, 10x, or 100x — with results you can trust.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <a
            href="#pricing"
            className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-4 rounded-full text-lg transition-colors w-full sm:w-auto"
          >
            Choose Your Path
          </a>
          <a
            href="#features"
            className="text-primary hover:text-primary-hover font-medium px-8 py-4 rounded-full text-lg transition-colors border border-primary/20 hover:border-primary/40 w-full sm:w-auto"
          >
            See What&apos;s Inside
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center justify-center gap-8 text-muted text-sm animate-fade-in-up delay-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Trusted by developers worldwide</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-card-border" />
          <span className="hidden sm:inline">Practical, battle-tested content</span>
        </div>
      </div>
    </section>
  );
}
