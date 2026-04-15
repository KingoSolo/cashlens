'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavBar } from '../../components/NavBar';
import { CategoryBreakdownChart } from '../../components/CategoryBreakdownChart';
import { api } from '../../lib/api';
import { formatNaira, formatMonth } from '../../lib/format';
import type { MonthlyBreakdown, AnalyticsSummary } from '../../lib/types';

export function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = searchParams.get('businessId') ?? '';
  const businessName = searchParams.get('name') ?? 'Your Business';

  const [monthly, setMonthly] = useState<MonthlyBreakdown[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [categories, setCategories] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!businessId) { router.push('/'); return; }
    Promise.all([api.getMonthly(businessId), api.getSummary(businessId), api.getCategories(businessId)])
      .then(([m, s, c]) => { setMonthly(m); setSummary(s); setCategories(c); })
      .catch(() => router.push('/'));
  }, [businessId, router]);

  const totalExpenses = Object.values(categories).reduce((a, b) => a + b, 0);
  const bestMonth = monthly.reduce<MonthlyBreakdown | null>(
    (best, m) => (!best || m.revenue > best.revenue ? m : best), null
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <NavBar businessId={businessId} businessName={businessName} />

      <main style={{ flex: 1, padding: '32px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{businessName}</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 32 }}>Analytics overview</p>

        {/* Insight pills */}
        {summary && bestMonth && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
            {[
              { label: 'Best revenue month', value: `${formatMonth(bestMonth.month)} — ${formatNaira(bestMonth.revenue)}` },
              { label: 'Avg monthly revenue', value: formatNaira(summary.avgMonthlyRevenue) },
              { label: 'Avg monthly expenses', value: formatNaira(summary.totalExpenses / summary.numMonths) },
              { label: 'Months of data', value: `${summary.numMonths}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  flex: '1 1 180px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Monthly table */}
        {monthly.length > 0 && (
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 36, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Monthly Performance</h2>
            </div>
            <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Month', 'Revenue', 'Expenses', 'Net Profit', 'Margin'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 20px',
                        textAlign: h === 'Month' ? 'left' : 'right',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthly.map((row, i) => {
                  const margin = row.revenue > 0 ? (row.net / row.revenue) * 100 : 0;
                  const isLast = i === monthly.length - 1;
                  return (
                    <tr
                      key={row.month}
                      style={{ borderBottom: isLast ? 'none' : '1px solid #F3F4F6' }}
                    >
                      <td style={{ padding: '12px 20px', fontSize: 14, color: '#111827', fontWeight: 500 }}>
                        {formatMonth(row.month)}
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 14, color: '#059669', textAlign: 'right' }}>
                        {formatNaira(row.revenue)}
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 14, color: '#DC2626', textAlign: 'right' }}>
                        {formatNaira(row.expenses)}
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 14, color: row.net >= 0 ? '#111827' : '#DC2626', fontWeight: 500, textAlign: 'right' }}>
                        {formatNaira(row.net)}
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 14, color: margin >= 10 ? '#059669' : margin >= 0 ? '#F59E0B' : '#DC2626', textAlign: 'right' }}>
                        {margin.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {summary && (
                <tfoot>
                  <tr style={{ borderTop: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#111827' }}>Total</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#059669', textAlign: 'right' }}>{formatNaira(summary.totalRevenue)}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#DC2626', textAlign: 'right' }}>{formatNaira(summary.totalExpenses)}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#111827', textAlign: 'right' }}>{formatNaira(summary.netProfit)}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#111827', textAlign: 'right' }}>{summary.profitMargin.toFixed(1)}%</td>
                  </tr>
                </tfoot>
              )}
            </table>
            </div>
          </div>
        )}

        {/* Category breakdown */}
        {Object.keys(categories).length > 0 && (
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '20px 24px' }}>
            <div className="two-col-grid">
              <CategoryBreakdownChart data={categories} />
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
                  Category share
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(categories)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, value]) => {
                      const pct = totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
                      return (
                        <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: '#374151' }}>{name}</span>
                          <span style={{ fontSize: 13, color: '#6B7280' }}>
                            {formatNaira(value)} <span style={{ color: '#9CA3AF' }}>({pct.toFixed(1)}%)</span>
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
