# FLG — Founder Led Growth

Your 0→1 accountability partner. Add a project (localhost, TestFlight, GitHub Pages — anything), answer a quick check-up, and get exactly **one next action** at a time until the project is shipped, discoverable, secured, launched, and earning coffees. No list dumps.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. All data lives in your browser's localStorage — no backend, no account.

## How it works

- `lib/journey.ts` — the 0→1 journey: 9 stages, ~35 steps, each with *why it matters*, a 2-4 step *how*, effort estimate, and resources. Steps are conditional on project type (web app / mobile / open source / API).
- `lib/engine.ts` — picks the single next applicable step, computes progress, momentum ("On fire / Moving / Stalled"), and commitment deadlines.
- `lib/store.tsx` — localStorage-backed state.
- Onboarding assessment asks yes/no questions one at a time to fast-forward past what you've already done. Every action card also has "Already did this" and "Not relevant".
- Stuck? The partner shrinks the step and asks you to commit to a deadline — then holds you to it on the dashboard.

## Journey stages

Ship it → Own your name → Front door (landing) → Trust & security → Get found (SEO) → First users → Launch → Support yourself (Buy Me a Coffee) → Momentum.

## Monetization

Free. A "Buy me a coffee" button in the header/footer (`app/layout.tsx` — swap in your real BMC URL). The journey itself also teaches founders to add support buttons to *their* projects.
