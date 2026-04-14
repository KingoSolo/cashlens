import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from './business/business.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { HealthScoreModule } from './health-score/health-score.module.js';
import { LoanSimulatorModule } from './loan-simulator/loan-simulator.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'cashlens.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    BusinessModule,
    TransactionsModule,
    AnalyticsModule,
    HealthScoreModule,
    LoanSimulatorModule,
  ],
})
export class AppModule {}
