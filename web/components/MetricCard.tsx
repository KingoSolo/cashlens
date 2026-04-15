interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  progressBar?: number; // 0–100, shows thin bar below value
}

export function MetricCard({ label, value, trend, trendDirection, progressBar }: MetricCardProps) {
  const trendColor =
    trendDirection === 'up'
      ? '#059669'
      : trendDirection === 'down'
        ? '#DC2626'
        : '#6B7280';

  return (
    <div
      style={{
        background: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: 16,
        flex: 1,
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: '#6B7280',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{value}</p>
      {trend && (
        <p style={{ fontSize: 12, color: trendColor, marginBottom: progressBar != null ? 8 : 0 }}>
          {trend}
        </p>
      )}
      {progressBar != null && (
        <div style={{ height: 3, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progressBar))}%`,
              background: '#0A5F4A',
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}
