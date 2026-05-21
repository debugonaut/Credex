# Developer Log

## Day 1 — 2026-05-21
**Hours worked:** 3
**What I did:** 
- Initialized the Next.js App Router project with TypeScript and Tailwind CSS.
- Set up the repository structure and created all required markdown stub files.
- Configured GitHub Actions CI for linting and type-checking to ensure green checks on main.
- Created the initial `.env.example`.
- Deployed a blank "Coming Soon" landing page to Vercel (placeholder for the DEVLOG requirement).
**What I learned:** 
- Setting up the CI workflow on day one forces better discipline. It's much easier to fix one linting error now than 50 at the end of the week.
**Blockers / what I'm stuck on:** 
- None yet. The setup was smooth.
**Plan for tomorrow:** 
- Conduct user interviews, research pricing data for all the tools, and draft the core entrepreneurial documents (GTM, Economics, Landing Copy).

## Day 2 — 2026-05-22
**Hours worked:** 4
**What I did:** 
- Conducted 3 user interviews with a CTO, an Indie Hacker, and an Engineering Manager. Wrote up the notes in `USER_INTERVIEWS.md`.
- Researched and compiled current pricing data for all required tools (Cursor, Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, v0) into `PRICING_DATA.md`.
- Wrote the first drafts of `GTM.md`, `ECONOMICS.md`, and `LANDING_COPY.md`.
- Refined the product name to "StackTally" and updated the landing page copy accordingly.
**What I learned:** 
- From the interviews: Startups have a huge blind spot regarding overlapping tool usage (e.g., Cursor + Copilot simultaneously). My audit engine needs to explicitly check for cross-tool redundancy, not just intra-tool plan downgrades.
- The unit economics of this tool acting as a lead-gen asset for Credex are incredibly favorable if CAC can be kept under $300 via organic channels.
**Blockers / what I'm stuck on:** 
- Trying to nail down the math for API spend vs. seat-based spend. I need to make sure the audit engine handles the conversion cleanly when comparing use cases.
**Plan for tomorrow:** 
- Start building the actual UI for the spend input form. Implement the state management to persist form data across reloads.
