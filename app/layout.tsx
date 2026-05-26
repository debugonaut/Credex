import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-display',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif-body',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

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
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
    >
      <body className="font-serif bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
