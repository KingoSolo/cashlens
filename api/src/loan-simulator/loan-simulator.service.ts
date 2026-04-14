import { Injectable } from '@nestjs/common';
import { HealthScoreResult } from '../health-score/health-score.service.js';
import { AnalyticsSummary } from '../analytics/analytics.service.js';

export interface LoanSimulatorResult {
  decision: 'Approved' | 'Conditional' | 'Declined';
  riskLevel: 'Low' | 'Medium' | 'High';
  estimatedLoanAmount: number;
  reasoning: string[];
  generatedAt: string;
}

@Injectable()
export class LoanSimulatorService {
  simulate(healthScore: HealthScoreResult, summary: AnalyticsSummary): LoanSimulatorResult {
    const score = healthScore.score ?? 0;
    const profitMargin = summary.profitMargin;
    const avgMonthlyRevenue = summary.avgMonthlyRevenue;

    const avgMonthlyExpenses = summary.numMonths > 0 ? summary.totalExpenses / summary.numMonths : 0;
    const cashRunway = avgMonthlyExpenses > 0 ? summary.netProfit / avgMonthlyExpenses : 0;

    let decision: 'Approved' | 'Conditional' | 'Declined';
    let riskLevel: 'Low' | 'Medium' | 'High';
    let estimatedLoanAmount: number;
    const reasoning: string[] = [];

    if (score >= 70 && profitMargin > 15 && cashRunway > 3) {
      decision = 'Approved';
      riskLevel = 'Low';
      estimatedLoanAmount = avgMonthlyRevenue * 4;
      reasoning.push(`✓ Health score of ${score}/100 meets the minimum threshold for approval`);
      reasoning.push(`✓ Profit margin of ${profitMargin.toFixed(1)}% demonstrates strong financial discipline`);
      reasoning.push(`✓ Cash runway of ${cashRunway.toFixed(1)} months indicates low default risk`);
      reasoning.push(`✓ Estimated loan of ₦${this.formatAmount(estimatedLoanAmount)} based on 4× average monthly revenue`);
    } else if (score >= 50 && profitMargin > 0 && cashRunway > 1) {
      decision = 'Conditional';
      riskLevel = 'Medium';
      estimatedLoanAmount = avgMonthlyRevenue * 2;
      reasoning.push(`✓ Health score of ${score}/100 meets the conditional approval threshold`);
      reasoning.push(`✓ Positive profit margin of ${profitMargin.toFixed(1)}% confirms the business is viable`);
      reasoning.push(`⚠ Cash runway of ${cashRunway.toFixed(1)} months suggests moderate repayment risk`);
      reasoning.push(`⚠ Estimated loan of ₦${this.formatAmount(estimatedLoanAmount)} (2× avg monthly revenue) subject to lender conditions`);
    } else {
      decision = 'Declined';
      riskLevel = 'High';
      estimatedLoanAmount = 0;
      if (score < 50) {
        reasoning.push(`⚠ Health score of ${score}/100 falls below the minimum threshold of 50`);
      }
      if (profitMargin <= 0) {
        reasoning.push(`⚠ Negative or zero profit margin (${profitMargin.toFixed(1)}%) indicates current losses`);
      }
      if (cashRunway <= 1) {
        reasoning.push(`⚠ Cash runway of ${Math.max(0, cashRunway).toFixed(1)} months is insufficient to service debt`);
      }
      if (reasoning.length < 4) {
        reasoning.push(`⚠ We recommend improving financial performance over 3–6 months before reapplying`);
      }
    }

    return { decision, riskLevel, estimatedLoanAmount, reasoning, generatedAt: new Date().toISOString() };
  }

  private formatAmount(amount: number): string {
    return amount.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  }
}
