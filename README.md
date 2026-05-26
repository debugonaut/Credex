# StackTally

**The first automated spend audit for your startup's AI infrastructure.**

StackTally analyzes your team's AI tool subscriptions — Cursor, GitHub Copilot, Claude, ChatGPT, and more — and identifies wasted seats, overlapping capabilities, and cheaper alternatives. Built as a lead-generation tool for [Credex](https://credex.money).

## Live Demo

> **URL:** [https://stacktally-audit.vercel.app](https://stacktally-audit.vercel.app)

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14.2 (App Router) | RSC for results page, built-in OG image generation, metadata API |
| Language | TypeScript (strict mode) | `noUncheckedIndexedAccess` catches financial math bugs |
| Styling | Tailwind CSS v3 | Full control, no template dependency |
| Forms | React Hook Form + Zod | Uncontrolled inputs for performance, schema as single source of truth |
| Database | Supabase (Postgres) | Free tier, RLS for lead data separation |
| AI Summary | Anthropic Claude Haiku | ~$0.001/audit, fast enough for non-blocking UX |
| Email | Resend | Clean API, React Email templates |
| Rate Limiting | Upstash Redis | Serverless-compatible, free tier |
| Testing | Vitest | Native TS, fast, ESM-compatible |
| Deployment | Vercel | Zero-config with Next.js, preview deploys |

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Project Structure

```
app/            → Next.js App Router pages and API routes
components/     → React components (form, results, layout)
engine/         → Pure-function audit engine and pricing rules
lib/            → Shared utilities (Supabase, Resend, rate limiting)
hooks/          → Custom React hooks
types/          → Shared TypeScript interfaces
constants/      → Tool definitions and threshold values
prompts/        → LLM prompt templates
db/             → SQL schema definitions
```

## Required Documentation

All documentation files are at the repository root per the assignment specification:

- `ARCHITECTURE.md` — System design and data flow diagram
- `DEVLOG.md` — Daily development log
- `REFLECTION.md` — Post-mortem answers
- `TESTS.md` — Test inventory and results
- `PRICING_DATA.md` — Verified pricing data with sources
- `PROMPTS.md` — LLM prompt iterations
- `GTM.md` — Go-to-market strategy
- `ECONOMICS.md` — Unit economics and conversion funnel
- `USER_INTERVIEWS.md` — Three user interview notes
- `LANDING_COPY.md` — Landing page copy and FAQ
- `METRICS.md` — Key performance metrics

## Key Architectural Decisions

We documented five critical technical trade-offs made during the engineering of the StackTally platform:

1. **Integer Cents Math (Precision):**
   We calculate and store all financial values in integer cents rather than standard JavaScript floats. Floating-point arithmetic on dynamic currencies causes rounding issues (e.g. `0.1 + 0.2 === 0.30000000000000004`) which destroys billing and financial credibility. Integer math remains 100% exact across all aggregations.
2. **React Server Components (RSC) for dynamic reports:**
   The results page routes (`/results/[slug]`) are rendered entirely on the server-side as dynamic Server Components, stripping out all `'use client'` segments from display widgets. This completely eliminated unnecessary browser bundle sizes and enabled dynamic Open Graph images to render instantly at the edge on first request, driving viral loops.
3. **Zero-JS Event Telemetry (Redirect Proxy):**
   Instead of using browser-side click handlers that dispatch dynamic async fetch requests to log analytics, we converted consultation CTAs to pure server components and routed button links directly to a backend telemetry redirect proxy: `/api/cta-redirect`. This endpoint registers the database analytical event server-side and redirects the browser seamlessly, eliminating 12KB of JavaScript payload.
4. **Serverless-compatible Rate Limiting:**
   Next.js App Router routes execute on stateless serverless functions, which means standard in-memory caching resets on cold starts. We implemented distributed, sliding-window rate limiting using `@upstash/ratelimit` backed by Redis to preserve state across multiple container runs.
5. **Rigid TypeScript Compiler Safeguards:**
   We fully activated `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` inside `tsconfig.json`. This forces compile-time handling of potentially `undefined` nested properties (such as pricing lookups), eliminating standard dynamic runtime crashes in production.

## License

Private — built for the Credex WebDev 2026 Assignment.
