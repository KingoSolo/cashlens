import { Controller, Get, Param } from '@nestjs/common';
import { LoanSimulatorService } from './loan-simulator.service.js';
import { HealthScoreService } from '../health-score/health-score.service.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { BusinessService } from '../business/business.service.js';

@Controller('loan-simulator')
export class LoanSimulatorController {
  constructor(
    private readonly loanSimulatorService: LoanSimulatorService,
    private readonly healthScoreService: HealthScoreService,
    private readonly analyticsService: AnalyticsService,
    private readonly transactionsService: TransactionsService,
    private readonly businessService: BusinessService,
  ) {}

  @Get(':businessId')
  async simulate(@Param('businessId') businessId: string) {
    await this.businessService.findById(businessId);
    const transactions = await this.transactionsService.findByBusiness(businessId);
    const summary = this.analyticsService.getSummary(transactions);
    const monthly = this.analyticsService.getMonthlyBreakdown(transactions);
    const healthScore = this.healthScoreService.calculate(summary, monthly);
    return this.loanSimulatorService.simulate(healthScore, summary);
  }
}
