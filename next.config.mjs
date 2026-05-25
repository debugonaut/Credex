import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during bundling
    silent: true,
    org: 'credex',
    project: 'stacktally',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Uploads a larger set of source maps for clearer stack traces
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with older browsers
    transpileClientSDK: true,

    // Route browser requests through Vercel to bypass ad-blockers
    tunnelRoute: '/monitoring',

    // Hides source maps from visitors
    hideSourceMaps: true,

    // Automatically tree-shakes Sentry logging in production builds
    disableLogger: true,
  }
)
