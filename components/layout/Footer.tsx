export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-between">
        <p className="text-xs text-text-muted font-mono">
          © {new Date().getFullYear()} StackTally
        </p>
        <p className="text-xs text-text-muted">
          Built for{' '}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white transition-colors"
          >
            Credex
          </a>
        </p>
      </div>
    </footer>
  )
}
