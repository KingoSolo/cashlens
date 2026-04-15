import { Module } from '@nestjs/common';
import { LoanSimulatorService } from './loan-simulator.service';
import { LoanSimulatorController } from './loan-simulator.controller';
import { HealthScoreModule } from '../health-score/health-score.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [HealthScoreModule, AnalyticsModule, TransactionsModule, BusinessModule],
  providers: [LoanSimulatorService],
  controllers: [LoanSimulatorController],
})
export class LoanSimulatorModule {}
