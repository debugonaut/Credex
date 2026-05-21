# Developer Log

## Day 1 — 2026-05-21

**Hours worked:** 4

**What I did:**
- Initialized the repo with `create-next-app@14` using pnpm, App Router, TypeScript strict mode, and Tailwind CSS v3. Deliberately chose Next.js 14.2.x over 15/16 because the App Router is stable and well-documented in 14, and React Server Components for the results page need predictable behavior.
- Added `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` to `tsconfig.json`. These flags are non-negotiable for a project that does financial math on array data — an unchecked `prices[index]` returning `undefined` instead of throwing is exactly how billing bugs happen.
- Set up GitHub Actions CI (`.github/workflows/ci.yml`) with pnpm caching, lint, and `tsc --noEmit`. Wanted green checks from commit one.
- Created all 12 required markdown files as stubs at the repo root. Even empty, they show up in the git history from Day 1.
- Created `.env.example` with all keys stubbed for Supabase, Anthropic, Resend, and Upstash — the full stack from the architecture plan.
- Deployed a "Coming Soon" page to Vercel. Live URL from Day 1.
- Researched and compiled current pricing data for all 8 tools (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, v0) into `PRICING_DATA.md` with source URLs and verification dates.
- Conducted 3 user interviews and wrote them up in `USER_INTERVIEWS.md`.
- Wrote first drafts of `GTM.md`, `ECONOMICS.md`, and `LANDING_COPY.md`.

**Technical decisions I made today:**
- Chose pnpm over npm/yarn: strict dependency resolution prevents phantom dependency issues, and Vercel supports it natively.
- Chose Tailwind v3 over v4: v4 changes the config API and has less community coverage. v3 is battle-tested and the assignment explicitly prohibits template themes, so I need full control via Tailwind primitives.
- Named the tool "StackTally" — communicates both the idea of a tech stack and an audit/tally. Short enough for a slug.

**What I learned:**
- From user interviews: the biggest pain point isn't "which tool is cheapest" — it's that CTOs literally don't know what their team is paying across 3–4 overlapping tools. The audit engine needs to detect cross-tool redundancy (e.g., Cursor + Copilot), not just intra-tool plan downgrades.
- The unit economics of this tool as a Credex lead-gen asset are strong if CAC stays under $300 per closed deal.

**Blockers / what I'm stuck on:**
- None. Foundation is clean and ready for the engine work tomorrow.

**Plan for tomorrow:**
- Write all TypeScript types in `types/index.ts`. Write `engine/pricing.ts` with all pricing constants traced to `PRICING_DATA.md`. Implement the four rule engine files. Write all five tests. No UI work tomorrow — engine first.
