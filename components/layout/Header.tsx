import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif font-bold text-xl tracking-tight text-black hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-2"
          aria-label="StackTally — home"
        >
          stacktally.
        </Link>
        <nav aria-label="Primary navigation">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-black hover:underline transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-2"
          >
            New Audit
          </Link>
        </nav>
      </div>
    </header>
  )
}
