import { ReactNode } from 'react';
import { QueryProvider } from '@/shared/providers/query-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </QueryProvider>
  );
}
