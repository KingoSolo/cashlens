import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { BusinessModule } from '../business/business.module.js';

@Module({
  imports: [TransactionsModule, BusinessModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
