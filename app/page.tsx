import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuditForm } from '@/components/form/AuditForm'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero section */}
        <section
          aria-labelledby="hero-headline"
          className="max-w-2xl mx-auto px-4 pt-24 pb-16 text-center"
        >
          {/* Eyebrow — establishes context immediately */}
          <p className="text-xs font-mono uppercase tracking-widest text-accent mb-6">
            Free AI spend audit
          </p>

          {/* Headline — from LANDING_COPY.md, ≤10 words */}
          <h1
            id="hero-headline"
            className="text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4"
          >
            Stop overpaying for AI. Audit your stack in 60 seconds.
          </h1>

          {/* Subheadline — from LANDING_COPY.md, ≤25 words */}
          <p className="text-base text-text-secondary leading-relaxed max-w-lg mx-auto mb-10">
            Most startups waste 30% of their AI tool budget on unused seats, overlapping features, and retail pricing. Enter your stack below to find your leaks.
          </p>
        </section>

        {/* Form section */}
        <section
          aria-label="AI spend audit form"
          className="max-w-2xl mx-auto px-4 pb-24"
        >
          <div className="bg-bg-elevated border border-border rounded-lg p-6 sm:p-8 shadow-xl">
            <AuditForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
