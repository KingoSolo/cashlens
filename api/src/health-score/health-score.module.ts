import { Module } from '@nestjs/common';
import { HealthScoreService } from './health-score.service.js';
import { HealthScoreController } from './health-score.controller.js';
import { AnalyticsModule } from '../analytics/analytics.module.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { BusinessModule } from '../business/business.module.js';

@Module({
  imports: [AnalyticsModule, TransactionsModule, BusinessModule],
  providers: [HealthScoreService],
  controllers: [HealthScoreController],
  exports: [HealthScoreService],
})
export class HealthScoreModule {}
