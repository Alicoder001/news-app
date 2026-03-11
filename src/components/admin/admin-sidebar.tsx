'use client';

import Link from 'next/link';
import { Activity, AlertTriangle, FileText, Rss, Settings, ShieldCheck } from 'lucide-react';
import { useAdminUiStore } from '@/stores/admin-ui.store';

const items = [
  { href: '/admin', label: 'Overview', icon: Activity },
  { href: '/admin/sources', label: 'Sources', icon: Rss },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/verification', label: 'Verification', icon: ShieldCheck },
  { href: '/admin/failures', label: 'Failures', icon: AlertTriangle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const sidebarOpen = useAdminUiStore((state) => state.sidebarOpen);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside
      style={{
        width: 240,
        borderRight: '1px solid #e5e7eb',
        background: '#ffffff',
        padding: 16,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>ai_shunos admin</div>
      <nav style={{ display: 'grid', gap: 8 }}>
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              background: '#f9fafb',
            }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
