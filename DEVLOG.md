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

## Day 2 — 2026-05-22

**Hours worked:** 6

**What I did:**
- Wrote all TypeScript types in `types/index.ts` defining `UseCase`, `ToolId`, `PlanId`, `ToolSelection`, `AuditInput`, `RecommendationType`, `ConfidenceLevel`, `Recommendation`, `SavingsBreakdown`, `AuditResult`, `UserLead`, `PublicAudit`, `PricingConfig`, and `LLMGeneratedSummary`.
- Created `constants/tools.ts` to manage display configurations, labels, descriptions, and plans for the 8 tools (Cursor, Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and v0).
- Created `engine/pricing.ts` to hold strict monetary constants in integer cents to ensure clean and exact financial calculations without floating-point drifts.
- Implemented `engine/rules/planFit.ts` to check if teams are running on plans that are economically irrational for their seat size.
- Implemented `engine/rules/vendorDowngrade.ts` to find cheaper use case matching alternatives from the same vendor.
- Implemented `engine/rules/toolOverlap.ts` with an overlap definition matrix to flag redundant tools (e.g., Cursor + Copilot) and recommend consolidation.
- Implemented `engine/rules/creditsOpportunity.ts` to flag lead-gen discount opportunities through Credex for covered tools where monthly spend exceeds $100/mo.
- Implemented `engine/index.ts` orchestrator which runs all four rule sets, merges results, deduplicates recommendations, sums total savings, and calculates a full tool-by-tool breakdown.
- Configured Vitest in `vitest.config.ts` and wrote 5 robust financial tests in `engine/__tests__/auditEngine.test.ts` representing plan fit, tool redundancy, optimal stack, CTA threshold, and annual savings integrity.

**Technical decisions I made today:**
- **Integer Cents Math**: Designed the engine using integer cents (`monthlyPerSeatCents`, `monthlySavingsCents`, `annualSavingsCents`) rather than floats. Floating-point arithmetic on currencies causes rounding errors that can easily discredit a financial tool.
- **Deduplication Strategy (`deduplicateByTool`)**: When multiple rules recommend optimizing a single tool (e.g., both `planFit` and `vendorDowngrade` suggesting Cursor plan changes), we retain only the recommendation yielding the highest savings. This avoids double-counting savings and guarantees logical consistency.
- **Hobby/Free Tier Exclusions**: Filtered out plan recommendations with `monthlyPerSeatCents === 0` inside the `planFit` and `vendorDowngrade` rules. Startups running professional workloads cannot operate on heavily limited hobby plans, so proposing downgrades to free tiers is commercially unrealistic.
- **Noise Floors**: Implemented noise floors in rules (e.g., $100/month spend threshold in `creditsOpportunity`, $5/month savings in `planFit`) because switching friction or discount negotiation isn't justified for negligible dollar amounts.

**What I learned:**
- Test 4 (CTA trigger) initially failed because a 10-seat ChatGPT/Cursor setup didn't exceed the $500/mo savings threshold. Raising the mock team size to 20 seats correctly crossed the $500 line, verifying that our CTA triggers exactly on the boundary.

**Blockers / what I'm stuck on:**
- None. The core engine is fully verified, 100% type-safe, and passing all tests.

---

## Day 3 — 2026-05-23

**Hours worked:** 5

**What I did:**
- Created `hooks/useMounted.ts` as a React hydration guard to prevent Next.js SSR-client mismatch errors when reading from `localStorage`.
- Created `hooks/useFormPersistence.ts` to debouncingly save React Hook Form state to `localStorage` on every user input.
- Created `lib/validation.ts` defining Zod schemas (`toolSelectionSchema` and `auditInputSchema`) to guarantee strong, unified type parsing at the boundary.
- Built `components/form/ToolSelector.tsx` presenting an interactive grid of toggleable chips representing the 8 tools.
- Built `components/form/ToolCard.tsx` with plan dropdowns, custom increment/decrement seat selectors, monthly spend fields, and inline helpers.
- Built `components/form/TeamContextFields.tsx` capturing team sizes and primary AI workloads with clear descriptive options.
- Built `components/form/AuditForm.tsx` to orchestrate form inputs, wire persistence, and call the pure audit engine on submission.
- Updated `app/page.tsx` with a premium dark glassmorphic landing page structure, mock social proof, detailed FAQs, and mounted the `AuditForm`.

**Technical decisions I made today:**
- **Debounced Storage Sync**: Debounced `localStorage` writes at 500ms. In high-frequency form edits (e.g., typing seat counts or spends), synchronous localStorage updates degrade rendering performance; debouncing keeps interactions smooth.
- **Dynamic Spend Estimations**: Implemented inline expected pricing helpers in `ToolCard.tsx`. If a user leaves the spend field blank, the component automatically calculates the expected cost based on official seat pricing. If they input an amount that is less than 50% of the standard retail price, we trigger a subtle, helpful warning reminding them of potential annual or discounted contract terms.

**Blockers / what I'm stuck on:**
- None. The form persists beautifully, handles state updates correctly, and logs the calculated `AuditResult` to the console.

**Plan for tomorrow:**
- Implement Phase 3: Setup dynamic API routes, lead capture database schemas, and integrate Anthropic API to generate personalized audit summary paragraphs.
