import { Module } from '@nestjs/common';
import { LoanSimulatorService } from './loan-simulator.service.js';
import { LoanSimulatorController } from './loan-simulator.controller.js';
import { HealthScoreModule } from '../health-score/health-score.module.js';
import { AnalyticsModule } from '../analytics/analytics.module.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { BusinessModule } from '../business/business.module.js';

@Module({
  imports: [HealthScoreModule, AnalyticsModule, TransactionsModule, BusinessModule],
  providers: [LoanSimulatorService],
  controllers: [LoanSimulatorController],
})
export class LoanSimulatorModule {}
