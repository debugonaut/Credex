module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm run start',
      startServerReadyPattern: 'ready|started|localhost',
      startServerReadyTimeout: 60000,
      chromeFlags: '--no-sandbox --ignore-certificate-errors --disable-features=SafeBrowsing --disable-gpu',
      url: [
        (process.env.LHCI_BASE_URL || 'http://localhost:3000') + '/',
        // Results page URL needs a real slug — hardcode one from your test data
        // Update this when your Vercel URL changes
        (process.env.LHCI_BASE_URL || 'http://localhost:3000') + '/results/' + (process.env.LHCI_TEST_SLUG || 'test-slug'),
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance':    ['warn', { minScore: 0.85 }],
        'categories:accessibility':  ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo':            ['warn', { minScore: 0.80 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // free, no account needed
    },
  },
}
