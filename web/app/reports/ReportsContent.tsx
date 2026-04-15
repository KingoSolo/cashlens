'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavBar } from '../../components/NavBar';
import { api } from '../../lib/api';
import { formatNaira, formatMonth } from '../../lib/format';
import type { MonthlyBreakdown, AnalyticsSummary } from '../../lib/types';

export function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = searchParams.get('businessId') ?? '';
  const businessName = searchParams.get('name') ?? 'Your Business';

  const [monthly, setMonthly] = useState<MonthlyBreakdown[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    if (!businessId) { router.push('/'); return; }
    Promise.all([api.getMonthly(businessId), api.getSummary(businessId)])
      .then(([m, s]) => { setMonthly(m); setSummary(s); })
      .catch(() => router.push('/'));
  }, [businessId, router]);

  const dateRange =
    monthly.length > 0
      ? `${formatMonth(monthly[0].month)} – ${formatMonth(monthly[monthly.length - 1].month)}`
      : '';

  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
      <div className="no-print">
        <NavBar businessId={businessId} businessName={businessName} />
      </div>

      <main style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Print action */}
        <div
          className="no-print"
          style={{ width: '100%', maxWidth: 700, display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}
        >
          <button
            onClick={() => window.print()}
            style={{
              padding: '9px 20px',
              background: '#0A5F4A',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Print / Save as PDF
          </button>
        </div>

        {/* Report card */}
        <div
          style={{
            width: '100%',
            maxWidth: 700,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Report header */}
          <div style={{ padding: '24px 32px', borderBottom: '2px solid #0A5F4A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 11, color: '#0A5F4A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Financial Report
                </p>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{businessName}</h1>
                <p style={{ fontSize: 13, color: '#6B7280' }}>Period: {dateRange}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#0A5F4A' }}>CashLens</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Generated {generatedDate}</p>
              </div>
            </div>
          </div>

          {/* Summary metrics */}
          {summary && (
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                Summary
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {[
                  { label: 'Total Revenue', value: formatNaira(summary.totalRevenue), color: '#059669' },
                  { label: 'Total Expenses', value: formatNaira(summary.totalExpenses), color: '#DC2626' },
                  { label: 'Net Profit', value: formatNaira(summary.netProfit), color: summary.netProfit >= 0 ? '#111827' : '#DC2626' },
                  { label: 'Profit Margin', value: `${summary.profitMargin.toFixed(1)}%`, color: '#111827' },
                  { label: 'Avg Monthly Revenue', value: formatNaira(summary.avgMonthlyRevenue), color: '#111827' },
                  { label: 'Months Covered', value: `${summary.numMonths}`, color: '#111827' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: '10px 0', borderBottom: '1px solid #F9FAFB' }}>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 16, fontWeight: 600, color }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly table */}
          {monthly.length > 0 && (
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                Month-by-Month Performance
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Month', 'Revenue', 'Expenses', 'Net', 'Margin'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '8px 0',
                          textAlign: h === 'Month' ? 'left' : 'right',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#9CA3AF',
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
                  {monthly.map((row) => {
                    const margin = row.revenue > 0 ? (row.net / row.revenue) * 100 : 0;
                    return (
                      <tr key={row.month} style={{ borderBottom: '1px solid #F9FAFB' }}>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                          {formatMonth(row.month)}
                        </td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#059669', textAlign: 'right' }}>
                          {formatNaira(row.revenue)}
                        </td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#DC2626', textAlign: 'right' }}>
                          {formatNaira(row.expenses)}
                        </td>
                        <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: row.net >= 0 ? '#111827' : '#DC2626', textAlign: 'right' }}>
                          {formatNaira(row.net)}
                        </td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#6B7280', textAlign: 'right' }}>
                          {margin.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {summary && (
                  <tfoot>
                    <tr style={{ borderTop: '2px solid #E5E7EB' }}>
                      <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#111827' }}>Total</td>
                      <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#059669', textAlign: 'right' }}>{formatNaira(summary.totalRevenue)}</td>
                      <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#DC2626', textAlign: 'right' }}>{formatNaira(summary.totalExpenses)}</td>
                      <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#111827', textAlign: 'right' }}>{formatNaira(summary.netProfit)}</td>
                      <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#111827', textAlign: 'right' }}>{summary.profitMargin.toFixed(1)}%</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: '16px 32px', background: '#F9FAFB' }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Generated by CashLens · Financial summary for internal use
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
