import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [TransactionsModule, BusinessModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
