import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BusinessService } from '../business/business.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly transactionsService: TransactionsService,
    private readonly businessService: BusinessService,
  ) {}

  @Get(':businessId/summary')
  async getSummary(@Param('businessId') businessId: string) {
    await this.businessService.findById(businessId);
    const transactions = await this.transactionsService.findByBusiness(businessId);
    return this.analyticsService.getSummary(transactions);
  }

  @Get(':businessId/monthly')
  async getMonthly(@Param('businessId') businessId: string) {
    await this.businessService.findById(businessId);
    const transactions = await this.transactionsService.findByBusiness(businessId);
    return this.analyticsService.getMonthlyBreakdown(transactions);
  }

  @Get(':businessId/categories')
  async getCategories(@Param('businessId') businessId: string) {
    await this.businessService.findById(businessId);
    const transactions = await this.transactionsService.findByBusiness(businessId);
    return this.analyticsService.getCategoryBreakdown(transactions);
  }
}
