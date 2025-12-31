import prisma from '@/lib/prisma';
import { DataCard, StatusBadge } from '@/components/admin/stats-card';
import { Activity, Play, RefreshCw, Clock } from 'lucide-react';
import Link from 'next/link';

async function getPipelineRuns() {
  const runs = await prisma.pipelineRun.findMany({
    take: 50,
    orderBy: { startedAt: 'desc' },
  });

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRuns = runs.filter(r => r.startedAt >= today);
  const successRate = runs.length > 0
    ? Math.round((runs.filter(r => r.status === 'COMPLETED').length / runs.length) * 100)
    : 0;

  const totalArticles = runs.reduce((sum, r) => sum + r.articlesProcessed, 0);
  const avgDuration = runs.length > 0
    ? Math.round(runs.reduce((sum, r) => sum + (r.durationMs || 0), 0) / runs.length / 1000)
    : 0;

  return { runs, todayRuns: todayRuns.length, successRate, totalArticles, avgDuration };
}

function formatDuration(ms: number | null): string {
  if (!ms) return '—';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export default async function PipelinePage() {
  const { runs, todayRuns, successRate, totalArticles, avgDuration } = await getPipelineRuns();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Avtomatik yangiliklar to'plash
          </p>
        </div>
        <Link
          href="/api/cron/news"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Play className="w-4 h-4" />
          Manual ishga tushirish
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <p className="text-xs text-muted-foreground mb-1">Bugungi ishga tushishlar</p>
          <p className="text-2xl font-bold font-serif">{todayRuns}</p>
        </div>
        <div className="p-4 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <p className="text-xs text-muted-foreground mb-1">Muvaffaqiyat darajasi</p>
          <p className="text-2xl font-bold font-serif">{successRate}%</p>
        </div>
        <div className="p-4 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <p className="text-xs text-muted-foreground mb-1">Jami maqolalar</p>
          <p className="text-2xl font-bold font-serif">{totalArticles}</p>
        </div>
        <div className="p-4 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <p className="text-xs text-muted-foreground mb-1">O'rtacha davomiylik</p>
          <p className="text-2xl font-bold font-serif">{avgDuration}s</p>
        </div>
      </div>

      {/* Runs Table */}
      <div className="rounded-xl border border-foreground/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-foreground/[0.02]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Holat
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Boshlangan
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Davomiylik
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Topilgan
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ishlangan
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Xatolar
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                AI Sarfi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <StatusBadge status={run.status.toLowerCase() as 'running' | 'completed' | 'failed' | 'cancelled'} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {run.startedAt.toLocaleDateString('uz-UZ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {run.startedAt.toLocaleTimeString('uz-UZ', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {formatDuration(run.durationMs)}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {run.articlesFound}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {run.articlesProcessed}
                </td>
                <td className="px-6 py-4">
                  {run.errors > 0 ? (
                    <span className="text-sm text-red-500 font-medium">{run.errors}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">0</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-muted-foreground">${run.aiCost.toFixed(4)}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({run.tokensUsed.toLocaleString()} tok)
                  </span>
                </td>
              </tr>
            ))}

            {runs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pipeline hali ishlamagan
                    </p>
                    <Link
                      href="/api/cron/news"
                      className="text-sm text-foreground font-medium hover:underline"
                    >
                      Birinchi marta ishga tushirish →
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
