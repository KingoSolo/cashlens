'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavBarProps {
  businessId: string;
  businessName: string;
}

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];

export function NavBar({ businessId, businessName }: NavBarProps) {
  const pathname = usePathname();
  const query = businessId
    ? `?businessId=${businessId}&name=${encodeURIComponent(businessName)}`
    : '';

  return (
    <header
      style={{
        borderBottom: '1px solid #E5E7EB',
        padding: '0 32px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        height: 56,
        background: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 700, color: '#0A5F4A', letterSpacing: '-0.3px' }}>
        CashLens
      </span>

      <div className="nav-items">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.path || pathname.startsWith(item.path + '?');
        return (
          <Link
            key={item.label}
            href={`${item.path}${query}`}
            style={{
              fontSize: 14,
              color: active ? '#111827' : '#6B7280',
              fontWeight: active ? 600 : 400,
              borderBottom: active ? '2px solid #0A5F4A' : '2px solid transparent',
              paddingBottom: 2,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </Link>
        );
      })}
      </div>

      <div />
    </header>
  );
}
