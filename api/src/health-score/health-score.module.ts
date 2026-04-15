import { Module } from '@nestjs/common';
import { HealthScoreService } from './health-score.service';
import { HealthScoreController } from './health-score.controller';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [AnalyticsModule, TransactionsModule, BusinessModule],
  providers: [HealthScoreService],
  controllers: [HealthScoreController],
  exports: [HealthScoreService],
})
export class HealthScoreModule {}
