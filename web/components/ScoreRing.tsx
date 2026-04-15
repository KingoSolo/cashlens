'use client';

import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number | null;
  label: string;
}

export function ScoreRing({ score, label }: ScoreRingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(score ?? 0), 80);
    return () => clearTimeout(t);
  }, [score]);

  const s = score ?? 0;
  const color = s >= 70 ? '#0A5F4A' : s >= 50 ? '#F59E0B' : '#DC2626';
  const deg = (progress / 100) * 360;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        className="score-ring"
        style={
          {
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `conic-gradient(${color} 0deg ${deg}deg, #E5E7EB ${deg}deg 360deg)`,
            '--ring-progress': `${deg}deg`,
            '--ring-color': color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {score !== null ? (
            <>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>/100</span>
            </>
          ) : (
            <span style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '0 12px' }}>
              —
            </span>
          )}
        </div>
      </div>
      <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>{label}</p>
    </div>
  );
}
