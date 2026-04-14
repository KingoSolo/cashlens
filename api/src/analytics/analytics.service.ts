import { Injectable } from '@nestjs/common';
import { Transaction } from '../transactions/transaction.entity.js';

export interface MonthlyBreakdown {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  avgMonthlyRevenue: number;
  numMonths: number;
}

@Injectable()
export class AnalyticsService {
  getMonthlyBreakdown(transactions: Transaction[]): MonthlyBreakdown[] {
    const monthMap = new Map<string, { revenue: number; expenses: number }>();

    for (const tx of transactions) {
      const month = tx.date.substring(0, 7);
      if (!monthMap.has(month)) {
        monthMap.set(month, { revenue: 0, expenses: 0 });
      }
      const entry = monthMap.get(month)!;
      if (tx.type === 'income') {
        entry.revenue += tx.amount;
      } else {
        entry.expenses += tx.amount;
      }
    }

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { revenue, expenses }]) => ({
        month,
        revenue,
        expenses,
        net: revenue - expenses,
      }));
  }

  getSummary(transactions: Transaction[]): AnalyticsSummary {
    const monthly = this.getMonthlyBreakdown(transactions);
    const totalRevenue = monthly.reduce((sum, m) => sum + m.revenue, 0);
    const totalExpenses = monthly.reduce((sum, m) => sum + m.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const numMonths = monthly.length;
    const avgMonthlyRevenue = numMonths > 0 ? totalRevenue / numMonths : 0;

    return { totalRevenue, totalExpenses, netProfit, profitMargin, avgMonthlyRevenue, numMonths };
  }

  getCategoryBreakdown(transactions: Transaction[]): Record<string, number> {
    const result: Record<string, number> = {};
    for (const tx of transactions.filter((t) => t.type !== 'income')) {
      result[tx.category] = (result[tx.category] ?? 0) + tx.amount;
    }
    return result;
  }
}
