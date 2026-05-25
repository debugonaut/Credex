import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Set tracesSampleRate to 0.1 to trace 10% of user sessions for performance.
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    // Plus extremely helpful user exception capture
    replaysOnErrorSampleRate: 1.0,
    debug: false,
  })
}
