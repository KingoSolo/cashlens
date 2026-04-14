import { Injectable } from '@nestjs/common';
import { MonthlyBreakdown, AnalyticsSummary } from '../analytics/analytics.service.js';

export interface ComponentScore {
  name: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface HealthScoreResult {
  score: number | null;
  label: string;
  breakdown: ComponentScore[];
  explanation?: string;
}

@Injectable()
export class HealthScoreService {
  calculate(summary: AnalyticsSummary, monthly: MonthlyBreakdown[]): HealthScoreResult {
    if (monthly.length < 2) {
      return {
        score: null,
        label: 'Insufficient data',
        breakdown: [],
        explanation: 'Upload at least 2 months of transactions to generate a health score',
      };
    }

    const breakdown: ComponentScore[] = [
      this.scoreProfitMargin(summary),
      this.scoreRevenueConsistency(monthly),
      this.scoreCashRunway(summary, monthly),
      this.scoreRevenueTrend(monthly),
      this.scoreExpenseControl(monthly),
    ];

    const score = Math.round(breakdown.reduce((sum, c) => sum + c.score, 0));
    const label = this.getLabel(score);

    return { score, label, breakdown };
  }

  private scoreProfitMargin(summary: AnalyticsSummary): ComponentScore {
    const margin = summary.profitMargin;
    let score: number;
    if (margin >= 30) score = 20;
    else if (margin >= 20) score = 16;
    else if (margin >= 10) score = 12;
    else if (margin >= 0) score = 6;
    else score = 0;

    return {
      name: 'Profit Margin',
      score,
      maxScore: 20,
      explanation: `${margin.toFixed(1)}% net profit margin`,
    };
  }

  private scoreRevenueConsistency(monthly: MonthlyBreakdown[]): ComponentScore {
    const revenues = monthly.map((m) => m.revenue);
    const mean = revenues.reduce((a, b) => a + b, 0) / revenues.length;

    if (mean === 0) {
      return { name: 'Revenue Consistency', score: 0, maxScore: 20, explanation: 'No revenue recorded' };
    }

    const variance = revenues.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / revenues.length;
    const cv = Math.sqrt(variance) / mean;

    let score: number;
    if (cv <= 0.1) score = 20;
    else if (cv <= 0.2) score = 16;
    else if (cv <= 0.35) score = 12;
    else if (cv <= 0.5) score = 6;
    else score = 2;

    return {
      name: 'Revenue Consistency',
      score,
      maxScore: 20,
      explanation: `${(cv * 100).toFixed(0)}% revenue variability across months`,
    };
  }

  private scoreCashRunway(summary: AnalyticsSummary, monthly: MonthlyBreakdown[]): ComponentScore {
    const avgMonthlyExpenses = summary.totalExpenses / monthly.length;

    if (avgMonthlyExpenses === 0) {
      return { name: 'Cash Runway', score: 20, maxScore: 20, explanation: '0.0 months of expenses covered by net profit' };
    }

    const runway = summary.netProfit / avgMonthlyExpenses;
    let score: number;
    if (runway >= 6) score = 20;
    else if (runway >= 3) score = 15;
    else if (runway >= 1) score = 8;
    else if (runway >= 0) score = 3;
    else score = 0;

    return {
      name: 'Cash Runway',
      score,
      maxScore: 20,
      explanation: `${Math.max(0, runway).toFixed(1)} months of expenses covered by net profit`,
    };
  }

  private scoreRevenueTrend(monthly: MonthlyBreakdown[]): ComponentScore {
    if (monthly.length < 3) {
      return {
        name: 'Revenue Trend',
        score: 10,
        maxScore: 20,
        explanation: 'Insufficient months to compute trend (need 3+)',
      };
    }

    const last3 = monthly.slice(-3);
    let totalGrowth = 0;
    let validMonths = 0;

    for (let i = 1; i < last3.length; i++) {
      const prev = last3[i - 1].revenue;
      const curr = last3[i].revenue;
      if (prev > 0) {
        totalGrowth += (curr - prev) / prev;
        validMonths++;
      }
    }

    const avgGrowth = validMonths > 0 ? totalGrowth / validMonths : 0;

    let score: number;
    if (avgGrowth >= 0.1) score = 20;
    else if (avgGrowth >= 0.05) score = 15;
    else if (avgGrowth >= 0) score = 10;
    else if (avgGrowth >= -0.05) score = 5;
    else score = 0;

    return {
      name: 'Revenue Trend',
      score,
      maxScore: 20,
      explanation: `${(avgGrowth * 100).toFixed(1)}% avg monthly revenue growth (last 3 months)`,
    };
  }

  private scoreExpenseControl(monthly: MonthlyBreakdown[]): ComponentScore {
    if (monthly.length < 2) {
      return {
        name: 'Expense Control',
        score: 10,
        maxScore: 20,
        explanation: 'Insufficient data to compute expense control',
      };
    }

    const revenueGrowth = this.avgGrowthRate(monthly.map((m) => m.revenue));
    const expenseGrowth = this.avgGrowthRate(monthly.map((m) => m.expenses));
    const diff = revenueGrowth - expenseGrowth;

    let score: number;
    if (diff >= 0.1) score = 20;
    else if (diff >= 0.05) score = 15;
    else if (diff >= 0) score = 10;
    else if (diff >= -0.05) score = 5;
    else score = 0;

    return {
      name: 'Expense Control',
      score,
      maxScore: 20,
      explanation: `Revenue growing ${(revenueGrowth * 100).toFixed(1)}% vs expenses ${(expenseGrowth * 100).toFixed(1)}% per month`,
    };
  }

  private avgGrowthRate(values: number[]): number {
    let total = 0;
    let count = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        total += (values[i] - values[i - 1]) / values[i - 1];
        count++;
      }
    }
    return count > 0 ? total / count : 0;
  }

  private getLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 60) return 'Building momentum';
    if (score >= 50) return 'Developing';
    if (score >= 40) return 'At risk';
    return 'Critical';
  }
}
