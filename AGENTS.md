# CashLens — Agent Instructions

This file tells Claude Code how to work in this codebase autonomously.
Read this before taking any action. Read CLAUDE.md for project context.

## Before you write any code

1. Read `CLAUDE.md` (root) — domain rules, design system, API contract
2. Read `api/CLAUDE.md` if working on the backend
3. Read `web/CLAUDE.md` if working on the frontend
4. Check if the file you're about to create already exists

## How to interpret tasks

When given a task like "build the analytics module":
- Build the complete module: entity (if needed), service, controller, module file, DTOs
- Wire it into AppModule
- Do not leave TODO comments — implement or omit, never half-implement
- Do not add packages not listed in CLAUDE.md without asking first

## File creation rules

- Entity files: `*.entity.ts`
- DTO files: `*.dto.ts`
- Service files: `*.service.ts`
- Controller files: `*.controller.ts`
- Module files: `*.module.ts`
- One class per file (NestJS convention)
- Always export the class

## Never do these things

- Never use `any` type — define interfaces for unknown shapes
- Never store uploaded files to disk — use `memoryStorage()` for multer
- Never call `console.log` in production code paths — use NestJS `Logger` if needed
- Never hardcode `localhost:3001` in frontend files — use the `api` client in `lib/api.ts`
- Never use `synchronize: false` — keep `synchronize: true` for the hackathon
- Never add authentication/auth guards — this app has no login for the hackathon
- Never change the color palette — it is locked in CLAUDE.md and web/CLAUDE.md
- Never change the health score algorithm — it is the core business logic
- Never change the loan decision thresholds — they are calibrated to the demo data

## Running checks

After completing any backend task:
```bash
cd api && npm run build
```
Fix all TypeScript errors before considering a task done.

After completing any frontend task:
```bash
cd web && npm run build
```
Fix all TypeScript errors before considering a task done.

## Task completion checklist

Before reporting a task as done, verify:
- [ ] TypeScript builds without errors
- [ ] All currency values use `formatNaira()` (frontend) or return raw numbers (backend)
- [ ] All date values are stored as `YYYY-MM-DD` strings
- [ ] New NestJS modules are registered in AppModule
- [ ] New API endpoints match the contract in root CLAUDE.md
- [ ] No hardcoded test data left in production code paths
- [ ] Component props are typed (no implicit `any`)

## Build order (follow this sequence)

Phase 1 — API foundation:
1. `app.module.ts` with TypeORM SQLite config
2. `main.ts` with CORS, global prefix, pipes, interceptors
3. `common/` — ResponseInterceptor + HttpExceptionFilter
4. `business/` — entity + service
5. `transactions/` — entity + CSV parser + categorization + service + controller
6. `analytics/` — service + controller (pure functions, no DB calls)
7. `health-score/` — service + controller
8. `loan-simulator/` — service + controller

Phase 2 — Web:
1. `lib/api.ts` + `lib/format.ts`
2. `tailwind.config.ts` with custom colors
3. `app/layout.tsx` root layout
4. `components/MetricCard.tsx`
5. `components/ScoreRing.tsx`
6. `components/CashFlowChart.tsx`
7. `components/CategoryBreakdownChart.tsx`
8. `components/TransactionList.tsx`
9. `app/page.tsx` — upload page
10. `app/dashboard/page.tsx`
11. `app/health-card/[id]/page.tsx` — includes loan simulator

Phase 3 — Polish:
1. Skeleton loaders for all data-fetching pages
2. Empty state for zero transactions
3. Error boundary for API failures
4. README.md

## Sample data reference

The demo CSV is at `sample-data/adaeze-fashion-house.csv`.
Copy it to `web/public/adaeze-fashion-house.csv` so it can be downloaded from the frontend.
It contains 6 months (Oct 2024 – Mar 2025) of realistic Lagos SME transactions.
Expected health score: ~68 ("Building momentum").
Expected loan decision: CONDITIONAL, risk: Medium, estimated amount: ~₦480,000.

## Design review checklist (run before demo)

- [ ] Business name appears in every page heading
- [ ] All numbers show ₦ symbol
- [ ] No blue color visible anywhere
- [ ] Loan simulator shows ✓ and ⚠ bullets (not just text)
- [ ] Health card looks printable (no sidebar, no nav, max-width 640px)
- [ ] Score ring animates on page load
- [ ] Upload page shows sample data download link

## Hackathon submission notes

Deadline: April 16, 2026 at 5:00pm EDT (Lagos time: 10:00pm WAT)
GitHub repo must be PUBLIC before submission.
Devpost URL: https://techbuilders.devpost.com
Video: Loom, 4 minutes max, unlisted is fine.