export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0B] text-[#F2F2F0] px-6 py-24">
      <div className="max-w-2xl w-full flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl font-[family-name:var(--font-geist-sans)]">
          Stack
          <span className="text-[#00E5A0]">Tally</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
          The first automated spend audit for your startup&apos;s AI
          infrastructure. Identify wasted seats, overlapping tools, and cheaper
          alternatives in 60 seconds.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <div className="rounded-lg bg-[#00E5A0]/10 px-6 py-3 text-sm font-medium text-[#00E5A0] ring-1 ring-inset ring-[#00E5A0]/20 font-[family-name:var(--font-geist-mono)]">
            Coming Soon
          </div>
        </div>
      </div>
    </main>
  );
}
