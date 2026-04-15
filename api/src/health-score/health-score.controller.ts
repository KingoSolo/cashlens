import { Controller, Get, Param } from '@nestjs/common';
import { HealthScoreService } from './health-score.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BusinessService } from '../business/business.service';

@Controller('health-score')
export class HealthScoreController {
  constructor(
    private readonly healthScoreService: HealthScoreService,
    private readonly analyticsService: AnalyticsService,
    private readonly transactionsService: TransactionsService,
    private readonly businessService: BusinessService,
  ) {}

  @Get(':businessId')
  async getHealthScore(@Param('businessId') businessId: string) {
    await this.businessService.findById(businessId);
    const transactions = await this.transactionsService.findByBusiness(businessId);
    const summary = this.analyticsService.getSummary(transactions);
    const monthly = this.analyticsService.getMonthlyBreakdown(transactions);
    return this.healthScoreService.calculate(summary, monthly);
  }
}
