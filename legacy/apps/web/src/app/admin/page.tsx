import { StatsCard, DataCard, StatusBadge } from '@/components/admin/stats-card';
import { FileText, Rss, Coins, Activity, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { getAdminOverview } from '@/lib/api/server-api';

/**
 * Admin Dashboard
 * 
 * Shows key metrics and recent activity
 */

async function getDashboardStats() {
  const response = await getAdminOverview();
  return response.data as {
    totalArticles: number;
    todayArticles: number;
    totalSources: number;
    activeSources: number;
    lastPipelineRun: {
      status: string;
      articlesProcessed: number;
    } | null;
    recentPipelineRuns: Array<{
      id: string;
      status: string;
      startedAt: string;
      articlesProcessed: number;
    }>;
    aiUsage: {
      totalCost: number;
      totalTokens: number;
    };
    dailyUsage: Array<{ date: string; tokens: number }>;
    recentArticles: Array<{
      id: string;
      slug: string;
      title: string;
      createdAt: string;
      category?: { name?: string } | null;
    }>;
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentArticles = stats.recentArticles;
  const dailyUsage = stats.dailyUsage;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Loyiha holati va asosiy ko'rsatkichlar
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Jami Maqolalar"
          value={stats.totalArticles}
          description={`Bugun: +${stats.todayArticles}`}
          icon={FileText}
        />
        <StatsCard
          title="Faol Manbalar"
          value={`${stats.activeSources}/${stats.totalSources}`}
          description="News API va RSS"
          icon={Rss}
        />
        <StatsCard
          title="AI Sarfi (Bu oy)"
          value={`$${stats.aiUsage.totalCost.toFixed(2)}`}
          description={`${stats.aiUsage.totalTokens.toLocaleString()} token`}
          icon={Coins}
        />
        <StatsCard
          title="Pipeline"
          value={stats.lastPipelineRun ? 
            (stats.lastPipelineRun.status === 'RUNNING' ? 'Ishlayapti' : 
             stats.lastPipelineRun.status === 'COMPLETED' ? 'OK' : 'Xato') 
            : 'Ishlamagan'}
          description={stats.lastPipelineRun ? 
            `${stats.lastPipelineRun.articlesProcessed} maqola` : 
            'Hali ishlamagan'}
          icon={Activity}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <DataCard 
          title="So'ngi Maqolalar" 
          className="lg:col-span-2"
          action={
            <Link 
              href="/admin/articles" 
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Barchasini ko'rish →
            </Link>
          }
        >
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div 
                key={article.id}
                className="flex items-start justify-between gap-4 pb-4 border-b border-foreground/5 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{article.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {article.category && (
                      <span className="text-xs px-2 py-0.5 rounded bg-foreground/5">
                        {article.category.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Tahrirlash
                </Link>
              </div>
            ))}
            
            {recentArticles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Hozircha maqola yo'q
              </p>
            )}
          </div>
        </DataCard>

        {/* Pipeline History */}
        <DataCard 
          title="Pipeline Tarixi"
          action={
            <Link 
              href="/admin/pipeline" 
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Batafsil →
            </Link>
          }
        >
          <div className="space-y-3">
            {stats.recentPipelineRuns.map((run) => (
              <div 
                key={run.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={run.status.toLowerCase() as 'running' | 'completed' | 'failed'} />
                  <span className="text-xs text-muted-foreground">
                    {run.articlesProcessed} ta
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(run.startedAt).toLocaleTimeString('uz-UZ', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
            
            {stats.recentPipelineRuns.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Pipeline hali ishlamagan
              </p>
            )}
          </div>
        </DataCard>
      </div>

      {/* AI Usage Chart */}
      <DataCard title="AI Token Sarfi (14 kun)" className="mt-6">
        <div className="h-40 flex items-end gap-1">
          {dailyUsage.map((day, i) => {
            const maxTokens = Math.max(...dailyUsage.map(d => d.tokens), 1);
            const height = (day.tokens / maxTokens) * 100;
            
            return (
              <div 
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div 
                  className="w-full bg-foreground/20 rounded-t transition-all hover:bg-foreground/30"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: ${day.tokens.toLocaleString()} tokens`}
                />
                {i % 2 === 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(day.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </DataCard>
    </div>
  );
}
