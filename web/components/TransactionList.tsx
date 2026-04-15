import type { Transaction } from '../lib/types';
import { formatNaira, formatDate } from '../lib/format';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const recent = [...transactions].reverse().slice(0, 15);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Recent Transactions</h2>
        <span style={{ fontSize: 13, color: '#0A5F4A', fontWeight: 500, cursor: 'default' }}>SEE ALL</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr 80px 90px',
            padding: '0 0 8px',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          {['DATE', 'DESCRIPTION', 'CATEGORY', 'AMOUNT'].map((h) => (
            <span key={h} style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.06em' }}>
              {h}
            </span>
          ))}
        </div>
        {recent.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr 80px 90px',
                padding: '10px 0',
                borderBottom: '1px solid #F9FAFB',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, color: '#6B7280' }}>{formatDate(tx.date)}</span>
              <span
                style={{
                  fontSize: 13,
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingRight: 8,
                }}
              >
                {tx.description}
              </span>
              <span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: isIncome ? '#E0F2EE' : '#FFFBEB',
                    color: isIncome ? '#0A5F4A' : '#92400E',
                    letterSpacing: '0.02em',
                  }}
                >
                  {isIncome ? 'REVENUE' : 'EXPENSES'}
                </span>
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: isIncome ? '#059669' : '#DC2626',
                  textAlign: 'right',
                }}
              >
                {isIncome ? '' : '-'}{formatNaira(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
