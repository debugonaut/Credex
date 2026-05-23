'use client'

import { useState } from 'react'

interface ShareButtonProps {
  slug: string
}

export function ShareButton({ slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  // Use browser window location origin if available, falling back to env variable
  const origin = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  const shareUrl = `${origin}/results/${slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API support
      try {
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        // Hide elements out of viewport
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        console.error('Failed to copy to clipboard:', fallbackError)
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      <code 
        className="flex-1 text-xs font-mono text-gray-400 bg-white/[0.03] px-4 py-3 rounded-xl border border-white/[0.08] truncate select-all"
        title={shareUrl}
      >
        {shareUrl}
      </code>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Link copied to clipboard' : 'Copy shareable link'}
        className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
        style={{
          backgroundColor: copied ? '#00E5A0' : 'rgba(255, 255, 255, 0.08)',
          color: copied ? '#0A0A0B' : 'white',
          border: copied ? '1px solid #00E5A0' : '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
