# CashLens API — NestJS Backend

## Context

This is the NestJS backend for CashLens. It handles CSV uploads, transaction storage,
financial analytics computation, health score calculation, and loan decision simulation.
See the root CLAUDE.md for full project context, domain rules, and API contract.

## Module responsibilities

### business/
- `Business` entity: id (uuid), name, createdAt
- `BusinessService`: findById, create
- No controller needed — business is created implicitly on first upload

### transactions/
- `Transaction` entity: id, businessId (FK), date, description, amount, type, category, createdAt
- `CsvParserService`: parse multipart CSV upload using `csv-parse`, normalize dates
- `CategorizationService`: keyword matching → category string (see root CLAUDE.md for rules)
- `TransactionsService`: saveMany, findByBusiness
- `TransactionsController`: POST /api/transactions/upload, GET /api/transactions/:businessId

### analytics/
- `AnalyticsService`: derives MonthlyBreakdown[] and AnalyticsSummary from Transaction[]
  - MonthlyBreakdown: { month: string, revenue: number, expenses: number, net: number }
  - AnalyticsSummary: { totalRevenue, totalExpenses, netProfit, profitMargin, avgMonthlyRevenue }
- `AnalyticsController`: GET /api/analytics/:businessId/summary, /monthly

### health-score/
- `HealthScoreService`: implements the 5-component algorithm (see root CLAUDE.md)
  - Takes AnalyticsSummary + MonthlyBreakdown[] as input
  - Returns: { score, label, breakdown: ComponentScore[] }
  - ComponentScore: { name, score, maxScore, explanation }
- `HealthScoreController`: GET /api/health-score/:businessId

### loan-simulator/
- `LoanSimulatorService`: decision engine (see root CLAUDE.md)
  - Takes HealthScoreResult + AnalyticsSummary as input
  - Returns: { decision, riskLevel, estimatedLoanAmount, reasoning: string[], generatedAt }
- `LoanSimulatorController`: GET /api/loan-simulator/:businessId

### common/
- `ResponseInterceptor`: wraps all responses as `{ success: true, data: T, timestamp: string }`
- `HttpExceptionFilter`: uniform error shape `{ success: false, message: string, statusCode: number }`
- Use `@UseInterceptors(ResponseInterceptor)` globally in main.ts

## TypeORM setup (app.module.ts)

```typescript
TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: 'cashlens.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,   // OK for hackathon — no migrations needed
  logging: false,
})
```

Use `better-sqlite3` not `sqlite3` — it's synchronous and more stable. Install: `npm i better-sqlite3 @types/better-sqlite3`

## main.ts requirements

```typescript
app.setGlobalPrefix('api');
app.enableCors({ origin: 'http://localhost:3000' });
app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
app.useGlobalInterceptors(new ResponseInterceptor());
app.useGlobalFilters(new HttpExceptionFilter());
await app.listen(3001);
```

## CSV upload handling

Use `FileInterceptor` from `@nestjs/platform-express` with `multer` storage as `memoryStorage()`.
Do NOT save uploads to disk — parse from `file.buffer` directly via csv-parse.

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
async upload(@UploadedFile() file: Express.Multer.File, @Body() body: UploadDto) {
  // file.buffer contains the CSV bytes
}
```

## Date normalization

Input dates can be: `2024-10-03`, `03/10/2024`, `3 Oct 2024`, `Oct 3, 2024`.
Normalize all to ISO `YYYY-MM-DD` strings before saving. Use dayjs for parsing:
`npm i dayjs` — try formats in order: `YYYY-MM-DD`, `DD/MM/YYYY`, `D MMM YYYY`, `MMM D, YYYY`.

## Error handling rules

- If CSV has 0 rows after parsing → throw `BadRequestException('CSV file appears to be empty')`
- If a row is missing date or amount → skip it, do not throw
- If businessId not found → throw `NotFoundException('Business not found')`
- If business has fewer than 2 months of data → health score returns `{ score: null, label: 'Insufficient data', explanation: 'Upload at least 2 months of transactions to generate a health score' }`

## Code style

- All services use constructor injection (no property injection)
- Entity IDs are UUIDs: `@PrimaryGeneratedColumn('uuid')`
- No `any` types — define interfaces/DTOs for everything
- DTO files use `class-validator` decorators
- Services never import controllers; controllers never contain business logic
- Keep AnalyticsService pure: it takes Transaction[] as input, not a businessId — that makes it easily testable