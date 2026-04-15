'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyBreakdown } from '../lib/types';
import { formatNaira, formatMonthShort } from '../lib/format';

interface CashFlowChartProps {
  data: MonthlyBreakdown[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonthShort(d.month),
    Revenue: d.revenue,
    Expenses: d.expenses,
  }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Cash Flow Overview</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0A5F4A', display: 'inline-block' }} />
            Revenue
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`}
            width={52}
          />
          <Tooltip
            formatter={(value, name) => [formatNaira(Number(value)), String(name)]}
            contentStyle={{
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 13,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          />
          <Line
            type="monotone"
            dataKey="Revenue"
            stroke="#0A5F4A"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#0A5F4A' }}
          />
          <Line
            type="monotone"
            dataKey="Expenses"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#F59E0B' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
