export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatMonthShort(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
    month: 'short',
  });
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatTrend(current: number, previous: number): { text: string; direction: 'up' | 'down' | 'neutral' } {
  if (previous === 0) return { text: '', direction: 'neutral' };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const sign = pct >= 0 ? '+' : '';
  return {
    text: `${sign}${pct.toFixed(1)}% from last period`,
    direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
  };
}
