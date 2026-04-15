'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatNaira } from '../lib/format';

interface CategoryBreakdownChartProps {
  data: Record<string, number>;
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const sorted = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const max = sorted[0]?.value ?? 1;

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
        Spending by Category
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(({ name, value }) => (
          <div key={name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#374151' }}>{name}</span>
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                {formatNaira(value)}
              </span>
            </div>
            <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(value / max) * 100}%`,
                  background: '#F59E0B',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
