import { requireAuth } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'Admin Panel | Antigravity',
  description: 'News management dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  await requireAuth();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="pl-64">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
