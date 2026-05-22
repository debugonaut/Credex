import React from 'react'
import { AuditForm } from '@/components/form/AuditForm'

export const metadata = {
  title: 'StackTally — AI Spend Audit for Startups',
  description: 'Audit your startup\'s AI stack in 60 seconds. Find unused seats, overlapping capabilities, and cheaper alternatives.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070708] text-[#F2F2F3] relative overflow-hidden font-sans selection:bg-[#00E5A0]/30 selection:text-[#00E5A0]">
      {/* Decorative dynamic ambient glow spots */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00E5A0]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-20%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#1A1A1E]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-[#00E5A0] bg-clip-text text-transparent">
            Stack<span className="text-[#00E5A0]">Tally</span>
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
            Beta
          </span>
        </div>
        <a
          href="https://credex.money"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-gray-400 hover:text-[#00E5A0] transition-colors"
        >
          Built by Credex
        </a>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto text-white">
          Stop overpaying for AI. <br />
          <span className="bg-gradient-to-r from-[#00E5A0] via-[#00FFB2] to-cyan-400 bg-clip-text text-transparent">
            Audit your stack in 60 seconds.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Most startups waste 30% of their AI tool budget on unused seats, overlapping features, and retail pricing. Enter your stack below to find your leaks.
        </p>
      </section>

      {/* Form Container */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-[#0F0F11]/60 border border-[#1C1C1E] backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#00E5A0]/40 to-transparent" />
          <AuditForm />
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-[#1C1C1E] text-center">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative max-w-xl mx-auto">
          <p className="text-sm italic text-gray-300 leading-relaxed">
            &ldquo;StackTally found out we were paying for 8 ChatGPT Enterprise seats no one was using while our devs expensed Cursor separately. It saved us $600 a month in two clicks.&rdquo;
          </p>
          <div className="mt-4 text-xs font-medium text-gray-400">
            — Sarah J., VP of Engineering at <span className="text-[#00E5A0]">Series A Fintech</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#1C1C1E]">
        <h2 className="text-2xl font-bold tracking-tight text-white text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Q1 */}
          <div className="bg-[#0F0F11] border border-[#1C1C1E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Do I need to connect my credit card or AWS account?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No. The audit is 100% self-reported. You just tell us what tools you use and how many seats you pay for, and our engine calculates the rest based on real-time pricing data.
            </p>
          </div>
          {/* Q2 */}
          <div className="bg-[#0F0F11] border border-[#1C1C1E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              How does StackTally make money if this is free?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              StackTally is built by Credex. If your audit reveals that you are paying retail prices for tools like GitHub Copilot or Claude, we may offer to sell you those exact same credits at a discount from our inventory.
            </p>
          </div>
          {/* Q3 */}
          <div className="bg-[#0F0F11] border border-[#1C1C1E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Does the audit account for API usage?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Yes. If you provide your average monthly API spend for Anthropic or OpenAI, the engine will check if you are on the most cost-effective tier or if a newer, cheaper model (like GPT-4o mini or Claude 3.5 Haiku) fits your primary use case better.
            </p>
          </div>
          {/* Q4 */}
          <div className="bg-[#0F0F11] border border-[#1C1C1E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Is my stack data saved or shared?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We don&apos;t require an email to run the audit, so your inputs are anonymous by default. If you choose to save your results or book a consultation, we store your email and stack configuration securely. We never sell your data.
            </p>
          </div>
          {/* Q5 */}
          <div className="bg-gradient-to-br from-[#0F0F11] to-[#121215] border border-[#00E5A0]/20 rounded-xl p-5 space-y-2 md:col-span-2 shadow-[0_0_15px_rgba(0,229,160,0.03)]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A0]" />
              How often are the prices updated?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our pricing engine is updated weekly to reflect the latest tier changes, seat minimums, and token costs across all major AI providers. Verified sources are cited with real pricing URLs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050506] border-t border-[#121214] py-8 text-center text-xs text-gray-500">
        <p>&copy; 2026 StackTally. Sourced & discounted credits by Credex. All rights reserved.</p>
      </footer>
    </main>
  )
}
