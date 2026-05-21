# User Interviews

These notes are from three 15-minute conversations conducted this week via DM reach-outs on X and in a founder Slack community (Y Combinator Startup School Slack).

## 1. "M.L." — CTO, 14-person B2B SaaS startup (Seed stage)
*Context: Reached out via Founder Slack. They use a mix of Claude and GitHub Copilot.*

**Direct Quotes:**
- "Honestly? I know we're overpaying, but figuring out by how much takes an hour I don't have. So I just approve the Ramp expense every month."
- "We have GitHub Copilot Business for all 8 devs, but two of our senior guys secretly expense Cursor Pro because they hate Copilot. I found out last week."
- "The Claude Team plan is a ripoff for us because three people in marketing use it maybe twice a week, but we have to pay for the 5-seat minimum."

**Most surprising thing they said:**
They actually encourage "shadow AI spend" (devs buying their own tools and expensing them as 'software') because they're afraid of standardizing on one tool and upsetting the team. They didn't want a dashboard to *stop* the spend, they wanted one just to know what the hell the spend actually is.

**What it changed about my design:**
I initially planned to just recommend downgrading if usage is low. But I added a specific "Consolidation" check — if a team has Copilot *and* Cursor on the same audit, I need to flag that they're paying for overlapping capabilities and should pick one.

---

## 2. "Alex" — Indie Hacker, Bootstrapped portfolio of 3 micro-SaaS apps
*Context: DM'd on X (Twitter) after seeing a tweet about Vercel bills.*

**Direct Quotes:**
- "I'm a solo dev, but my AI bill is like $150 a month right now. ChatGPT Plus, Cursor Pro, Claude Pro, and v0 Premium. I just collect them like Pokémon."
- "The Anthropic API is actually way cheaper for what I do. I built a tiny CLI wrapper for Claude 3.5 Sonnet, and I barely hit $4 a month on the API, but I still pay the $20 for the web UI out of habit."
- "If your tool just says 'cancel Claude and use the API,' I'd probably do it. But I'm too lazy to do the math myself."

**Most surprising thing they said:**
Alex was paying for ChatGPT Plus purely for the voice mode on his phone while walking his dog, but using Cursor and Claude for 100% of his actual work. He didn't consider ChatGPT a "dev tool" anymore, but a "lifestyle app."

**What it changed about my design:**
I added a "Primary Use Case" dropdown to the input form. If someone is paying for ChatGPT Plus but their primary use case is "Coding", the engine needs to recommend switching to Cursor or using the API directly, because they are likely underutilizing ChatGPT.

---

## 3. "S.R." — Engineering Manager, 45-person Fintech startup (Series A)
*Context: Introduced through a mutual connection from university who works there.*

**Direct Quotes:**
- "Finance has been on our neck this quarter. We just cut our OpenAI API bill in half by switching to GPT-4o-mini for our background classification tasks."
- "We bought ChatGPT Enterprise for 30 people. Honestly, it was a mistake. Half the team doesn't log in, and the ones who do just use it for writing emails."
- "I would use this audit tool in a heartbeat, but only if I could export it as a clean PDF to send to our VP of Finance to prove I'm doing something about our AWS/AI costs."

**Most surprising thing they said:**
The enterprise tier was actually a *source* of wasted money for them, not a volume discount. They assumed Enterprise meant cheaper per-seat, but the minimum commitments and unused seats meant their effective cost per active user was almost double the Pro plan.

**What it changed about my design:**
It validated the need for the "Team Size" vs "Seats" check. If team size is large but primary use case is "Mixed/Non-technical", the engine must aggressively check if they are on an Enterprise plan with dead seats, and recommend downgrading to individual Pro plans or API-based internal tools. It also validated the PDF export bonus feature (which I will attempt if time permits).
