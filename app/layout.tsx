import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'StackTally — AI Spend Audit',
    template: '%s — StackTally',
  },
  description: 'Find out if your team is overpaying for AI tools. Free audit in 60 seconds.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'StackTally',
    title: 'StackTally — AI Spend Audit',
    description: 'Find out if your team is overpaying for AI tools. Free audit in 60 seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackTally — AI Spend Audit',
    description: 'Find out if your team is overpaying for AI tools. Free audit in 60 seconds.',
  },
  // Prevents search engines from indexing individual results pages
  // (they contain tool configurations that users may not want indexed)
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
