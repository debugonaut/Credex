# StackTally — Test Suite Inventory & Results

This document lists all automated unit and end-to-end tests implemented for the **StackTally AI Spend Audit** application, including what they cover and instructions on how to execute them.

---

## 🧪 1. Unit Tests (Vitest)
All business logic, pricing logic, plan fits, vendor downgrades, tool overlap audits, and lead-gen threshold calculations are covered by high-precision mathematical tests in Vitest. 

All monetary values are asserted down to the exact **integer cent** to prevent floating-point rounding drifts.

* **Test File:** `engine/__tests__/auditEngine.test.ts` (Absolute path: [auditEngine.test.ts](file:///Users/aadeshkhande/Documents/Professional/Own/Credex/engine/__tests__/auditEngine.test.ts))
* **Calculations Covered:**
  1. **Plan Fit Recommendations:** Asserts that a mock team of 10 users paying for redundant or overpriced ChatGPT Enterprise seats receives a recommended downgrade to ChatGPT Team plans, saving precisely the expected integer cents difference.
  2. **Vendor Downgrade (Tool Redundancy) Matrix:** Validates that overlapping tooling configurations (such as paying for both Cursor Business and GitHub Copilot Business for the same developer) are flagged. Asserts that the engine recommends consolidating to the more powerful/rational editor, yielding maximum savings while cleanly deduplicating double-counted recommendations.
  3. **Already Optimal Stack Isolation:** Verifies that a perfectly optimized or low-spend setup (saving less than our $1.00 noise floor) is categorized as `isAlreadyOptimal: true` and yields zero recommendations.
  4. **Credex CTA Savings Boundary:** Asserts that the consultation threshold triggers exactly when monthly potential savings cross `$500.00` (`triggersCredexCTA: true`), while remaining `false` for smaller optimizations.
  5. **Annualized Savings Integrity:** Asserts that the total annual savings exactly equals $12 \times$ monthly savings across all complex nested configurations.

### 🏃 How to Run Unit Tests
To execute the unit tests, run the following command in the repository root:
```bash
pnpm test
```
*Expected Output:*
```
 RUN  v4.1.7 /Users/aadeshkhande/Documents/Professional/Own/Credex

 ✓ engine/__tests__/auditEngine.test.ts (5 tests) 3ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  19:52:11
   Duration  161ms
```

---

## 🌐 2. End-to-End Tests (Playwright)
We implemented integration and full user funnel flow verification tests using Playwright. These launch a headless Chromium browser instance, navigate pages, fill forms, trigger DOM events, and verify transitions.

* **Test File:** `e2e/funnel.spec.ts` (Absolute path: [funnel.spec.ts](file:///Users/aadeshkhande/Documents/Professional/Own/Credex/e2e/funnel.spec.ts))
* **Flows Covered:**
  1. **Full funnel submission:** Visits `/`, asserts SEO landmarks (`<h1>`), selects a tool (Cursor), modifies dropdown plans (downgrades), increments seats, asserts dynamic cost estimations, fills team parameters, selects workloads, and clicks submit.
  2. **Graceful Sandbox Redirection:** Asserts that the form redirects to the dynamic `/results/[slug]` page upon submission. Defensively handles sandbox environments by validating that if Supabase keys are not set, it displays a high-fidelity warning page with a `200 OK` code instead of crashing.
  3. **Client-side Zod validations:** Attempts to submit the form without selecting any tool chip. Asserts that the native validation message "Select at least one tool" correctly mounts with proper `role="alert"` for accessibility.

### 🏃 How to Run E2E Tests
To execute the Playwright E2E browser tests:
```bash
npx playwright test
```
*Expected Output:*
```
  ✓  1 [chromium] › e2e/funnel.spec.ts:4:7 › StackTally Conversion Funnel E2E › should load landing page and interact with the audit form (3.1s)
  ✓  2 [chromium] › e2e/funnel.spec.ts:69:7 › StackTally Conversion Funnel E2E › should trigger validation error if no tools selected (0.8s)

  2 passed (3.9s)
```

---

## 📈 3. Lighthouse CI (LHCI Audits)
We integrated automated Lighthouse auditing as a gating step in our branch merges. It assertions dynamic rules for performance, accessibility, best practices, and SEO.

* **Configuration File:** `lighthouserc.js` (Absolute path: [lighthouserc.js](file:///Users/aadeshkhande/Documents/Professional/Own/Credex/lighthouserc.js))
* **CI Workflow integration:** `.github/workflows/ci.yml` (Absolute path: [.github/workflows/ci.yml](file:///Users/aadeshkhande/Documents/Professional/Own/Credex/.github/workflows/ci.yml))
* **Routes Audited:**
  - **Landing Page (`/`):** Evaluates form performance, font loading, layout shift (CLS), and semantic HTML.
  - **Dynamic Results Report (`/results/test-slug`):** Audits per-tool report grid accessibility, radial gradient background performance, and zero-JS Server Components.

### 🏃 How to Run Lighthouse CI Audits
To trigger a local Lighthouse CI run:
```bash
pnpm run build
pnpm lhci autorun
```
*Expected Scores:*
* **Performance:** $\ge 85$
* **Accessibility:** $\ge 90$ (WCAG AA Compliant)
* **Best Practices:** $\ge 90$
* **SEO:** $\ge 80$
