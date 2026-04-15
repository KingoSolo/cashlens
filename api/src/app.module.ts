import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from './business/business.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthScoreModule } from './health-score/health-score.module';
import { LoanSimulatorModule } from './loan-simulator/loan-simulator.module';

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
