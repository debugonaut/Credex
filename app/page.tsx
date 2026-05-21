export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          StackTally
        </h1>
        <p className="text-xl text-gray-400 text-center max-w-2xl">
          The first automated spend audit for your startup&apos;s AI infrastructure.
          Identify wasted seats, underutilized tiers, and better alternatives in seconds.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <div className="rounded-full bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            Coming Soon 🚀
          </div>
        </div>
      </div>
    </main>
  );
}
