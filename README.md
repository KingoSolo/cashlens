# CashLens

**Financial intelligence for African SMEs.**

CashLens helps small business owners who operate informally — no accountant, no bookkeeper — understand their financial position and prepare for lender conversations. Upload a CSV of your transactions, and get a complete financial health report, cash flow analysis, and a loan readiness assessment in under 30 seconds.

---

## The problem

African SMEs generate billions in economic activity but are locked out of formal credit because they have no structured financial records. When a bank asks for financials, most small business owners have nothing to show — not because they're not profitable, but because they've never had a tool to capture and present their financial story.

CashLens bridges that gap.

---

## Demo

**Live demo:** Upload `sample-data/adaeze-fashion-house.csv` (included in repo)

This file contains 6 months of transactions for a fictional Lagos fashion business. Expected output:
- Health score: ~68/100 ("Building momentum")
- Loan decision: Conditional approval
- Estimated loan amount: ~₦480,000

---

## Features

- **CSV upload** — accepts standard transaction exports. Handles multiple date formats.
- **Auto-categorization** — classifies transactions into Revenue, Rent, Labour, Inventory, Logistics, Utilities, Marketing, Equipment using keyword matching.
- **Cash flow dashboard** — monthly revenue vs expenses chart, spending breakdown, recent transactions with category badges.
- **Financial health score** — 0–100 score across 5 components: profit margin, revenue consistency, cash runway, revenue trend, and expense control.
- **Loan decision simulator** — answers "would a bank approve this?" with a decision (Approved / Conditional / Declined), risk level, estimated loan amount, and 4 human-readable reasoning points.

---

## Architecture

```
cashlens/
├── api/          NestJS backend (port 3001)
│   └── src/
│       ├── business/         Business entity + service
│       ├── transactions/     CSV upload, parsing, categorization
│       ├── analytics/        Monthly summaries, category totals
│       ├── health-score/     5-component scoring algorithm
│       └── loan-simulator/   Decision engine
└── web/          Next.js 14 frontend (port 3000)
    └── app/
        ├── page.tsx              Upload page
        ├── dashboard/            Cash flow dashboard
        └── health-card/[id]/     Health card + loan simulator
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Charts | Recharts |
| Backend | NestJS, TypeScript |
| Database | SQLite via TypeORM (zero config, single file) |
| CSV parsing | csv-parse |
| Validation | class-validator, class-transformer |

---

## Running locally

**Requirements:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/cashlens.git
cd cashlens

# 2. Start the API
cd api
npm install
npm run start:dev
# API runs on http://localhost:3001

# 3. Start the web app (new terminal)
cd web
npm install
npm run dev
# App runs on http://localhost:3000

# 4. Open http://localhost:3000 and upload the sample CSV
```

**Sample data** is at `sample-data/adaeze-fashion-house.csv` and also downloadable from the app's upload page.

---

## CSV format

```csv
date,description,amount,type
2024-10-03,Customer payment - Ankara dress,45000,income
2024-10-05,Fabric supplier - Balogun market,18000,expense
```

| Column | Format | Notes |
|---|---|---|
| date | YYYY-MM-DD or DD/MM/YYYY | Required |
| description | string | Used for auto-categorization |
| amount | positive number | No currency symbol |
| type | income or expense | Case-insensitive |

---

## Health score algorithm

Five components, 20 points each (total: 100):

1. **Profit margin** — net profit as a percentage of revenue
2. **Revenue consistency** — coefficient of variation across months
3. **Cash runway** — months of expenses covered by net profit
4. **Revenue trend** — average month-over-month growth, last 3 months
5. **Expense control** — expense growth rate vs revenue growth rate

---

## Loan decision thresholds

| Decision | Criteria |
|---|---|
| Approved | Score ≥ 70, profit margin > 15%, cash runway > 3 months |
| Conditional | Score ≥ 50, profit margin > 0%, cash runway > 1 month |
| Declined | Does not meet conditional criteria |

Estimated loan amount: 4× avg monthly revenue (Approved) or 2× (Conditional).

---

## Built for

Tech Builders Program 2026 — Financial Technology category.

**Team:** [Your name] — full-stack development, product design, domain research.