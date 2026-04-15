'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { formatNaira } from '../../../lib/format';
import type { HealthScoreResult, LoanSimulatorResult, AnalyticsSummary, MonthlyBreakdown } from '../../../lib/types';
import { ScoreRing } from '../../../components/ScoreRing';

interface Props {
  id: string;
  businessName: string;
}

export function HealthCardContent({ id, businessName }: Props) {
  const router = useRouter();
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyBreakdown[]>([]);
  const [loan, setLoan] = useState<LoanSimulatorResult | null>(null);
  const [loanLoading, setLoanLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getHealthScore(id),
      api.getSummary(id),
      api.getMonthly(id),
    ])
      .then(([h, s, m]) => {
        setHealthScore(h);
        setSummary(s);
        setMonthly(m);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function runLoanSimulator() {
    setLoanLoading(true);
    try {
      const result = await api.getLoanDecision(id);
      setLoan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulator');
    } finally {
      setLoanLoading(false);
    }
  }

  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const cashRunway =
    summary && monthly.length > 0
      ? summary.netProfit / (summary.totalExpenses / monthly.length)
      : 0;

  const decisionStyles: Record<string, { bg: string; text: string; border: string }> = {
    Approved:    { bg: '#E0F2EE', text: '#0A5F4A', border: '#0A5F4A' },
    Conditional: { bg: '#FFFBEB', text: '#92400E', border: '#F59E0B' },
    Declined:    { bg: '#FEF2F2', text: '#991B1B', border: '#DC2626' },
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
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
    <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Back button */}
      <div style={{ width: '100%', maxWidth: 640, marginBottom: 12 }} className="no-print">
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#6B7280',
            fontSize: 14,
            cursor: 'pointer',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Card header */}
        <div style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#0A5F4A' }}>CashLens</span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Generated {generatedDate}</span>
        </div>

        <div style={{ padding: '28px 28px 0' }}>
          {/* Business name */}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{businessName}</h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>Financial Health Report</p>

          {/* Score ring */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            {healthScore ? (
              <ScoreRing score={healthScore.score} label={healthScore.label} />
            ) : (
              <div style={{ width: 160, height: 160, borderRadius: '50%', background: '#F3F4F6' }} />
            )}
          </div>

          {/* 3 stats */}
          {summary && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderTop: '1px solid #F3F4F6',
                borderBottom: '1px solid #F3F4F6',
                padding: '20px 0',
                marginBottom: 28,
              }}
            >
              {[
                { label: 'Total Revenue', value: formatNaira(summary.totalRevenue) },
                { label: 'Net Profit', value: formatNaira(summary.netProfit) },
                { label: 'Cash Runway', value: `${Math.max(0, cashRunway).toFixed(1)} months` },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left', padding: '0 8px' }}>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                  <p style={{ fontSize: 17, fontWeight: 600, color: '#111827' }}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Score breakdown */}
          {healthScore?.breakdown && healthScore.breakdown.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Score Breakdown</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {healthScore.breakdown.map((component) => (
                  <div key={component.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#374151' }}>{component.name}</span>
                      <span style={{ fontSize: 13, color: '#6B7280' }}>
                        {component.score} / {component.maxScore}
                      </span>
                    </div>
                    <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(component.score / component.maxScore) * 100}%`,
                          background: '#0A5F4A',
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loan simulator */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 24, marginBottom: 28 }}>
            {!loan && !loanLoading && (
              <button
                onClick={runLoanSimulator}
                style={{
                  width: '100%',
                  height: 48,
                  background: '#0A5F4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Would a bank approve this?
              </button>
            )}

            {loanLoading && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B7280', fontSize: 14 }}>
                Analysing your financial profile...
              </div>
            )}

            {loan && (() => {
              const ds = decisionStyles[loan.decision];
              return (
                <div style={{ border: `1px solid ${ds.border}`, borderRadius: 8, padding: '20px 20px 16px', background: ds.bg }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <span style={{
                      padding: '5px 20px',
                      border: `1px solid ${ds.border}`,
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 700,
                      color: ds.text,
                      background: 'white',
                      letterSpacing: '0.04em',
                    }}>
                      {loan.decision.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 14, color: '#374151', marginBottom: 4 }}>
                    Risk level: <strong>{loan.riskLevel}</strong>
                  </p>
                  {loan.estimatedLoanAmount > 0 && (
                    <p style={{ textAlign: 'center', fontSize: 14, color: '#374151', marginBottom: 16 }}>
                      Estimated loan: <strong>{formatNaira(loan.estimatedLoanAmount)}</strong>
                    </p>
                  )}
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Why this decision:</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {loan.reasoning.map((r, i) => {
                      const isPositive = r.startsWith('✓');
                      return (
                        <li key={i} style={{ fontSize: 13, color: isPositive ? '#0A5F4A' : '#92400E', display: 'flex', gap: 6 }}>
                          {r}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Card footer */}
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '14px 28px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Generated by CashLens · Financial summary for lender review
          </p>
        </div>
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="no-print"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '10px 20px',
          background: '#0A5F4A',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        Print Report
      </button>
    </div>
  );
}
