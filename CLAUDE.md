# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

There are no tests. TypeScript compilation (`tsc -b`) is the primary correctness check and runs as part of `build`.

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS v3** (not v4 — shadcn/ui CLI is incompatible with v4)
- **shadcn/ui** components created manually in `src/components/ui/` (no CLI — use `npx shadcn@latest add` only works if init succeeds; copy components from ui.shadcn.com instead)
- **Radix UI** primitives underlie all ui components
- Path alias `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)

## Architecture

All calculation logic is pure and stateless in `src/lib/`:

- **`tax-rates.ts`** — Single source of truth for all 2025 French tax rates: `TAX_RATES` (cotisations sociales, CFP, versement libératoire, abattements), `CA_THRESHOLDS`, `TVA_THRESHOLDS`, `IR_TRANCHES`. **Update this file when rates change.**
- **`tax-calculator.ts`** — Pure function `calculateTaxes(inputs: TaxInputs): TaxResults`. Internally composed of `calculateCotisationsSociales`, `calculateImpotRevenu`, `calculateTvaStatus`. No side effects.
- **`utils.ts`** — `cn()` (Tailwind class merge), `formatCurrency()` (fr-FR locale), `formatPercent()`

State is managed entirely in **`src/hooks/useTaxCalculator.ts`** via `useState` + `useMemo`. `results` is derived from `inputs` — never set directly. Default revenue is €40,000 (BIC services).

**`src/types/index.ts`** defines all shared types. `ActivityType` is the discriminant used throughout (`bic_commerce | bic_services | bnc_liberal | cipav_liberal`).

## French Tax Domain Notes (2025)

**Cotisations sociales rates (% of CA):**
- BIC commerce: 12.3% | BIC services: 21.2% | BNC libéral: 25.6% | CIPAV: 24.1%
- ACRE: 50% reduction for first 12 months

**TVA franchise en base thresholds:**
- Commerce: €85,000 base / €93,500 tolerance
- Services/BNC: €37,500 base / €41,250 tolerance
- Four warning states: `none | approaching (≥80%) | exceeded_base | exceeded_tolerance`

**IR estimation** uses the progressive barème with abattement forfaitaire (71%/50%/34% by type, minimum €305). This is indicative only — assumes single taxpayer, no other income.

**Versement libératoire** (optional, requires RFR N-2 ≤ €28,797/part): IR paid with URSSAF at flat rate (1%/1.7%/2.2%). When enabled, IR is included in `totalUrssaf` and excluded from `revenueNet` deduction to avoid double-counting.

**Important:** Auto-entrepreneurs cannot deduct actual business expenses. Purchases in the app only affect TVA calculation (deductible if assujetti to TVA, not deductible under franchise).
