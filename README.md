# StackTally

**The first automated spend audit for your startup's AI infrastructure.**

StackTally analyzes your team's AI tool subscriptions — Cursor, GitHub Copilot, Claude, ChatGPT, and more — and identifies wasted seats, overlapping capabilities, and cheaper alternatives. Built as a lead-generation tool for [Credex](https://credex.money).

## Live Demo

> **URL:** [Coming soon — deployed on Vercel]

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

## License

Private — built for the Credex WebDev 2026 Assignment.
