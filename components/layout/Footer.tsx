export function Footer() {
  return (
    <footer className="border-t border-black bg-white mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-secondary font-mono tracking-widest uppercase">
          © {new Date().getFullYear()} StackTally. All rights reserved.
        </p>
        <p className="text-xs text-text-secondary font-mono tracking-widest uppercase">
          Built for{' '}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline font-medium hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-2"
          >
            Credex
          </a>
        </p>
      </div>
    </footer>
  )
}
