'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '../../components/NavBar';
import { api } from '../../lib/api';
import { formatMonth } from '../../lib/format';
import type { MonthlyBreakdown, Transaction } from '../../lib/types';

const DANGER_BTN: React.CSSProperties = {
  padding: '9px 20px',
  background: 'white',
  color: '#DC2626',
  border: '1px solid #FECACA',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

export function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = searchParams.get('businessId') ?? '';
  const businessName = searchParams.get('name') ?? 'Your Business';

  const [monthly, setMonthly] = useState<MonthlyBreakdown[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!businessId) { router.push('/'); return; }
    Promise.all([api.getMonthly(businessId), api.getTransactions(businessId)])
      .then(([m, t]) => { setMonthly(m); setTransactions(t); })
      .catch(() => router.push('/'));
  }, [businessId, router]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.deleteBusiness(businessId);
      router.push('/');
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const dateRange =
    monthly.length > 0
      ? `${formatMonth(monthly[0].month)} – ${formatMonth(monthly[monthly.length - 1].month)}`
      : '—';

  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type !== 'income').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
      <NavBar businessId={businessId} businessName={businessName} />

      <main style={{ flex: 1, padding: '32px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 28 }}>Settings</h1>

        {/* Business profile */}
        <section style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Business profile</h2>
          </div>
          <div style={{ padding: '20px' }}>
            {[
              { label: 'Business name', value: businessName },
              { label: 'Data period', value: dateRange },
              { label: 'Income transactions', value: `${incomeCount}` },
              { label: 'Expense transactions', value: `${expenseCount}` },
              { label: 'Total transactions', value: `${transactions.length}` },
              { label: 'Business ID', value: businessId, mono: true },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #F9FAFB',
                }}
              >
                <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
                <span
                  style={{
                    fontSize: mono ? 11 : 13,
                    color: '#111827',
                    fontWeight: 500,
                    fontFamily: mono ? 'monospace' : undefined,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Upload new data */}
        <section style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Data</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.6 }}>
              Upload a new CSV to analyse a different business or a more recent period. Each upload creates a new business profile.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '9px 20px',
                background: '#0A5F4A',
                color: 'white',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Upload new CSV →
            </Link>
          </div>
        </section>

        {/* Session link */}
        <section style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Your session link</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 1.6 }}>
              Your data is tied to this URL. Bookmark it to come back later — anyone with this link can view your data.
            </p>
            <code style={{ display: 'block', fontSize: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: '10px 12px', wordBreak: 'break-all', color: '#374151' }}>
              {typeof window !== 'undefined' ? window.location.href.replace('/settings', '/dashboard') : ''}
            </code>
          </div>
        </section>

        {/* CSV format guide */}
        <section style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>CSV format guide</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
              Your CSV must have these four columns. Column names are case-sensitive.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Column', 'Format', 'Notes'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        border: '1px solid #E5E7EB',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { col: 'date', fmt: 'YYYY-MM-DD or DD/MM/YYYY', note: 'Required' },
                  { col: 'description', fmt: 'Text', note: 'Used for category matching' },
                  { col: 'amount', fmt: 'Positive number', note: 'No ₦ symbol, no commas' },
                  { col: 'type', fmt: 'income or expense', note: 'Case-insensitive' },
                ].map(({ col, fmt, note }) => (
                  <tr key={col}>
                    <td style={{ padding: '8px 12px', fontSize: 13, fontFamily: 'monospace', color: '#0A5F4A', border: '1px solid #E5E7EB' }}>
                      {col}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: 13, color: '#374151', border: '1px solid #E5E7EB' }}>{fmt}</td>
                    <td style={{ padding: '8px 12px', fontSize: 13, color: '#6B7280', border: '1px solid #E5E7EB' }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a
              href="/adaeze-fashion-house.csv"
              download
              style={{ fontSize: 13, color: '#0A5F4A', textDecoration: 'underline' }}
            >
              Download sample CSV to see the format →
            </a>
          </div>
        </section>
        {/* Danger zone */}
        <section style={{ background: 'white', border: '1px solid #FECACA', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #FEE2E2' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>Danger zone</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', marginBottom: 2 }}>Delete all data</p>
              <p style={{ fontSize: 13, color: '#6B7280' }}>Permanently removes all transactions and this business profile. Cannot be undone.</p>
            </div>
            {!confirmDelete ? (
              <button style={DANGER_BTN} onClick={() => setConfirmDelete(true)}>
                Delete data
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  style={{ ...DANGER_BTN, background: '#DC2626', color: 'white', border: 'none', opacity: deleting ? 0.6 : 1 }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button
                  style={{ padding: '9px 16px', background: 'white', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
