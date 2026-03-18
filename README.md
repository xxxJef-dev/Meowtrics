# 🐱📊 Meowtrics — Sticker Pricing Calculator
> Your numbers, purrfected.

Free sticker pricing calculator for small businesses in the Philippines.
Calculate material cost, labor, COGS, selling price, discount, tax,
and profit — instantly. No spreadsheet needed.

## Local Setup
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel
```bash
npm i -g vercel && vercel
# No environment variables required
```

## Customization
| What | Where |
|---|---|
| Currency symbol | `lib/calculations.ts` → `formatCurrency()` |
| Default values | `components/Calculator.tsx` → `defaultState` |
| Brand colors | `app/globals.css` → CSS variables |
| Default tax rate | `defaultState.pricing.taxPercent` |

## Architecture
- `lib/calculations.ts`    All math — pure functions
- `lib/formulaSteps.ts`    Human-readable formula trail
- `types/calculator.ts`    All TypeScript types
- `hooks/`                 Reusable React hooks
- `components/ui/`         Generic reusable primitives
- `components/sections/`   Calculator input sections
- `components/ResultCard`  Final price output

## Roadmap
- Module 1: Sticker Pricing Calculator ← you are here
- Module 2: T-Shirt Pricing Calculator (coming soon)
- Module 3: Resin / Custom Product Calculator (coming soon)
- Full SaaS: Meowtrics Business Metrics Suite
