'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '../../components/NavBar';
import { api } from '../../lib/api';
import { formatNaira, formatMonth, formatTrend } from '../../lib/format';
import type { AnalyticsSummary, MonthlyBreakdown, Transaction } from '../../lib/types';
import { MetricCard } from '../../components/MetricCard';
import { CashFlowChart } from '../../components/CashFlowChart';
import { CategoryBreakdownChart } from '../../components/CategoryBreakdownChart';
import { TransactionList } from '../../components/TransactionList';

export function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = searchParams.get('businessId') ?? '';
  const businessName = searchParams.get('name') ?? 'Your Business';

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyBreakdown[]>([]);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!businessId) { router.push('/'); return; }

    Promise.all([
      api.getSummary(businessId),
      api.getMonthly(businessId),
      api.getCategories(businessId),
      api.getTransactions(businessId),
    ])
      .then(([s, m, c, t]) => {
        setSummary(s);
        setMonthly(m);
        setCategories(c);
        setTransactions(t);
      })
      .catch((err) => setError(err.message));
  }, [businessId, router]);

  const year = new Date().getFullYear();

  const dateRange =
    monthly.length > 0
      ? `${formatMonth(monthly[0].month)} – ${formatMonth(monthly[monthly.length - 1].month)}`
      : '';

  const revTrend =
    monthly.length >= 2
      ? formatTrend(monthly[monthly.length - 1].revenue, monthly[monthly.length - 2].revenue)
      : null;
  const expTrend =
    monthly.length >= 2
      ? formatTrend(monthly[monthly.length - 1].expenses, monthly[monthly.length - 2].expenses)
      : null;
  const netTrend =
    monthly.length >= 2
      ? formatTrend(monthly[monthly.length - 1].net, monthly[monthly.length - 2].net)
      : null;

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#DC2626', marginBottom: 16 }}>Something went wrong: {error}</p>
          <button
            onClick={() => router.push('/')}
            style={{ padding: '8px 16px', background: '#0A5F4A', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <NavBar businessId={businessId} businessName={businessName} />

      {/* Content */}
      <main style={{ flex: 1, padding: '32px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              {businessName}
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280' }}>{dateRange}</p>
          </div>
          <Link
            href={`/health-card/${businessId}?name=${encodeURIComponent(businessName)}`}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '10px 20px',
              background: '#0A5F4A',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              boxShadow: '0 1px 4px rgba(10,95,74,0.25)',
            }}
          >
            View Health Card →
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.85 }}>
              Loan readiness &amp; health score
            </span>
          </Link>
        </div>

        {/* Metric cards */}
        {summary && (
          <div className="metrics-grid">
            <MetricCard
              label="Total Revenue"
              value={formatNaira(summary.totalRevenue)}
              trend={revTrend?.text}
              trendDirection={revTrend?.direction}
            />
            <MetricCard
              label="Total Expenses"
              value={formatNaira(summary.totalExpenses)}
              trend={expTrend?.text}
              trendDirection={expTrend ? (expTrend.direction === 'up' ? 'down' : 'up') : undefined}
            />
            <MetricCard
              label="Net Profit"
              value={formatNaira(summary.netProfit)}
              trend={netTrend?.text}
              trendDirection={netTrend?.direction}
            />
            <MetricCard
              label="Profit Margin"
              value={`${summary.profitMargin.toFixed(1)}%`}
              progressBar={Math.min(100, summary.profitMargin)}
            />
          </div>
        )}

        {/* Cash flow chart */}
        {monthly.length > 0 && (
          <div
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              padding: '20px 24px',
              marginBottom: 32,
            }}
          >
            <CashFlowChart data={monthly} />
          </div>
        )}

        {/* Bottom row */}
        <div className="two-col-grid">
          {Object.keys(categories).length > 0 && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '20px 24px' }}>
              <CategoryBreakdownChart data={categories} />
            </div>
          )}
          {transactions.length > 0 && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '20px 24px' }}>
              <TransactionList transactions={transactions} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #E5E7EB',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white',
        }}
      >
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>
          © {year} CashLens Financial. All rights reserved.
        </p>
        <nav style={{ display: 'flex', gap: 20 }}>
          {['Terms of Service', 'Privacy Policy', 'Help Center'].map((link) => (
            <a key={link} href="#" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
              {link}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
