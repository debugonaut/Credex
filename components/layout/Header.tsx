import Link from 'next/link'

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-border"
      style={{ backgroundColor: 'rgba(10, 10, 11, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono font-medium text-white text-sm hover:text-accent transition-colors"
          aria-label="StackTally — home"
        >
          stacktally
        </Link>
        <nav aria-label="Primary navigation">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-white transition-colors"
          >
            New audit
          </Link>
        </nav>
      </div>
    </header>
  )
}
