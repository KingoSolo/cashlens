import { Suspense } from 'react';
import { DashboardContent } from './DashboardContent';

function DashboardSkeleton() {
  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {['w-48 h-6', 'w-full h-40 mt-6', 'w-full h-64 mt-6', 'w-full h-48 mt-6'].map((cls, i) => (
        <div
          key={i}
          style={{
            background: '#E5E7EB',
            borderRadius: 8,
            height: i === 0 ? 24 : i === 1 ? 80 : 240,
            marginTop: i === 0 ? 0 : 24,
            animation: 'pulse 1.5s infinite',
          }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
