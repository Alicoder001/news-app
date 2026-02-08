import prisma from '@/lib/prisma';
import { DataCard } from '@/components/admin/stats-card';
import { Bell, Database, RefreshCw } from 'lucide-react';

async function getSystemInfo() {
  const [articlesCount, sourcesCount, pipelineRuns] = await Promise.all([
    prisma.article.count(),
    prisma.newsSource.count(),
    prisma.pipelineRun.count(),
  ]);

  return {
    articlesCount,
    sourcesCount,
    pipelineRuns,
    nodeVersion: process.version,
    nextVersion: '15+',
  };
}

export default async function SettingsPage() {
  const systemInfo = await getSystemInfo();

  // Check which env vars are configured
  const envStatus = {
    database: !!process.env.DATABASE_URL,
    openai: !!process.env.OPENAI_API_KEY,
    telegram: !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID,
    newsApi: !!process.env.NEWS_API_KEY,
    cronSecret: !!process.env.CRON_SECRET,
    adminSecret: !!process.env.ADMIN_SECRET,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">Sozlamalar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tizim konfiguratsiyasi va ma'lumotlar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environment Variables Status */}
        <DataCard title="Environment Variables" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(envStatus).map(([key, isConfigured]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg bg-foreground/[0.02]"
              >
                <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xs text-muted-foreground">
                    {isConfigured ? 'Sozlangan' : 'Sozlanmagan'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* System Info */}
        <DataCard title="Tizim ma'lumotlari">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-foreground/5">
              <span className="text-sm text-muted-foreground">Node.js versiyasi</span>
              <span className="text-sm font-mono">{systemInfo.nodeVersion}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-foreground/5">
              <span className="text-sm text-muted-foreground">Next.js versiyasi</span>
              <span className="text-sm font-mono">{systemInfo.nextVersion}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-foreground/5">
              <span className="text-sm text-muted-foreground">Jami maqolalar</span>
              <span className="text-sm font-bold">{systemInfo.articlesCount}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-foreground/5">
              <span className="text-sm text-muted-foreground">Manbalar soni</span>
              <span className="text-sm font-bold">{systemInfo.sourcesCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Pipeline ishga tushishlar</span>
              <span className="text-sm font-bold">{systemInfo.pipelineRuns}</span>
            </div>
          </div>
        </DataCard>

        {/* Quick Actions */}
        <DataCard title="Tez amallar">
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Cache tozalash</p>
                <p className="text-xs text-muted-foreground">Barcha keshlangan ma'lumotlarni o'chirish</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                <Database className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">DB Migration</p>
                <p className="text-xs text-muted-foreground">Ma'lumotlar bazasini yangilash</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Test xabar yuborish</p>
                <p className="text-xs text-muted-foreground">Telegram kanalga test xabar</p>
              </div>
            </button>
          </div>
        </DataCard>

        {/* AI Configuration */}
        <DataCard title="AI Konfiguratsiyasi" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] text-sm"
                defaultValue="gpt-4o-mini"
                disabled
              >
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
              <p className="text-xs text-muted-foreground">prompts.ts da sozlangan</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Temperature</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] text-sm"
                defaultValue="0.1"
                disabled
              />
              <p className="text-xs text-muted-foreground">Strict mode uchun past qiymat</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Tokens</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] text-sm"
                defaultValue="2000"
                disabled
              />
              <p className="text-xs text-muted-foreground">Maqola uchun limit</p>
            </div>
          </div>
        </DataCard>

        {/* Danger Zone */}
        <DataCard title="Xavfli zona" className="lg:col-span-2 border-red-500/20">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-red-500">Barcha ma'lumotlarni o'chirish</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bu amal qaytarilmaydi. Barcha maqolalar, manbalar va statistika o'chiriladi.
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              disabled
            >
              O'chirish
            </button>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
