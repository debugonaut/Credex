import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuditForm } from '@/components/form/AuditForm'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-white min-h-screen relative bg-monochrome-grid bg-monochrome-noise">
        {/* Hero section */}
        <section
          aria-labelledby="hero-headline"
          className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pt-24 pb-16 text-left relative"
        >
          {/* Eyebrow */}
          <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-8">
            {"// Free AI Spend Audit"}
          </p>

          {/* Heavy visual punctuation */}
          <div className="w-12 h-2 bg-black mb-8" />

          {/* Headline — stark, oversized, editorial serif */}
          <h1
            id="hero-headline"
            className="font-serif font-bold text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter text-black uppercase mb-8"
          >
            Stop Overpaying<br className="hidden md:inline" /> For AI.
          </h1>

          {/* Subheadline — editorial body serif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12">
            <p className="text-xl text-black leading-relaxed font-serif">
              Most startups waste up to 30% of their AI tool budget on unused seats, redundant subscriptions, and retail pricing models.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-mono uppercase tracking-wider">
              Enter your current stack configuration below to identify leaks, downgrade plans, consolidate features, and discover direct credit opportunities in less than 60 seconds.
            </p>
          </div>
        </section>

        {/* Massive structural separator line */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <hr className="border-t-4 border-black my-12" />
        </div>

        {/* Form section */}
        <section
          aria-label="AI spend audit form"
          className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pb-32"
        >
          <div className="bg-white border-2 border-black p-8 md:p-12">
            <AuditForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
