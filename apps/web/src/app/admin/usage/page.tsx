import { DataCard } from '@/components/admin/stats-card';
import { Coins, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { getAdminUsageRecent, getAdminUsageSummary } from '@/lib/api/server-api';

async function getUsageData() {
  const [thisMonthResponse, lastMonthResponse, recentResponse] = await Promise.all([
    getAdminUsageSummary(30),
    getAdminUsageSummary(60),
    getAdminUsageRecent(20),
  ]);
  const thisMonthData = thisMonthResponse.data as {
    usage: {
      totalCost: number;
      totalTokens: number;
      byModel: Record<string, { tokens: number; cost: number }>;
      byOperation: Record<string, { tokens: number; cost: number; count: number }>;
    };
    daily: Array<{ date: string; tokens: number; cost: number; count: number }>;
  };
  const lastMonthData = lastMonthResponse.data as {
    usage: {
      totalCost: number;
      totalTokens: number;
    };
  };
  const recentData = recentResponse.data as {
    rows: Array<{
      id: string;
      createdAt: string;
      model: string;
      operation: string;
      promptTokens: number;
      completionTokens: number;
      cost: number;
    }>;
  };
  const thisMonth = thisMonthData.usage;
  const lastMonth = lastMonthData.usage;
  const dailyUsage = thisMonthData.daily.slice(-30);
  const recentUsages = recentData.rows;

  const costChange = lastMonth.totalCost > 0
    ? ((thisMonth.totalCost - lastMonth.totalCost) / lastMonth.totalCost) * 100
    : 0;

  return {
    thisMonth,
    lastMonth,
    costChange,
    dailyUsage,
    recentUsages,
  };
}

export default async function UsagePage() {
  const { thisMonth, lastMonth, costChange, dailyUsage, recentUsages } = await getUsageData();

  const maxCost = Math.max(...dailyUsage.map(d => d.cost), 0.001);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">AI Sarfi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          OpenAI API token ishlatilishi va xarajatlar
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Bu oy sarfi</p>
            <Coins className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold font-serif">${thisMonth.totalCost.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-2">
            {costChange >= 0 ? (
              <TrendingUp className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-green-500" />
            )}
            <span className={`text-xs font-medium ${costChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {costChange >= 0 ? '+' : ''}{costChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs o'tgan oy</span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Jami tokenlar</p>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold font-serif">{thisMonth.totalTokens.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Bu oyda ishlatilgan</p>
        </div>

        <div className="p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">O'tgan oy</p>
          </div>
          <p className="text-2xl font-bold font-serif">${lastMonth.totalCost.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">{lastMonth.totalTokens.toLocaleString()} token</p>
        </div>

        <div className="p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">O'rtacha/kun</p>
          </div>
          <p className="text-2xl font-bold font-serif">
            ${(thisMonth.totalCost / Math.max(new Date().getDate(), 1)).toFixed(3)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Kunlik o'rtacha</p>
        </div>
      </div>

      {/* Usage by Model */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DataCard title="Model bo'yicha sarfi">
          <div className="space-y-4">
            {Object.entries(thisMonth.byModel).map(([model, data]) => (
              <div key={model} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-xs font-mono">
                    {model.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{model}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.tokens.toLocaleString()} tokens
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold">${data.cost.toFixed(4)}</p>
              </div>
            ))}
            {Object.keys(thisMonth.byModel).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Hozircha ma'lumot yo'q
              </p>
            )}
          </div>
        </DataCard>

        <DataCard title="Operatsiya bo'yicha">
          <div className="space-y-4">
            {Object.entries(thisMonth.byOperation).map(([op, data]) => (
              <div key={op} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium capitalize">{op.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">
                    {data.count} ta so'rov
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${data.cost.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">
                    {data.tokens.toLocaleString()} tok
                  </p>
                </div>
              </div>
            ))}
            {Object.keys(thisMonth.byOperation).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Hozircha ma'lumot yo'q
              </p>
            )}
          </div>
        </DataCard>
      </div>

      {/* Daily Usage Chart */}
      <DataCard title="Kunlik sarfi (30 kun)" className="mb-8">
        <div className="h-48 flex items-end gap-1">
          {dailyUsage.map((day, i) => {
            const height = (day.cost / maxCost) * 100;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            
            return (
              <div 
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div 
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    isToday ? 'bg-foreground' : 'bg-foreground/20'
                  }`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: $${day.cost.toFixed(4)} (${day.tokens.toLocaleString()} tokens)`}
                />
                {i % 5 === 0 && (
                  <span className="text-[9px] text-muted-foreground">
                    {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </DataCard>

      {/* Recent Usage */}
      <DataCard title="So'ngi so'rovlar">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Vaqt</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Model</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Operatsiya</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Input</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Output</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Narx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {recentUsages.map((usage) => (
                <tr key={usage.id}>
                  <td className="py-3 text-xs text-muted-foreground">
                    {new Date(usage.createdAt).toLocaleString('uz-UZ', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 text-xs font-mono">{usage.model}</td>
                  <td className="py-3 text-xs capitalize">{usage.operation.replace(/_/g, ' ')}</td>
                  <td className="py-3 text-xs text-right">{usage.promptTokens.toLocaleString()}</td>
                  <td className="py-3 text-xs text-right">{usage.completionTokens.toLocaleString()}</td>
                  <td className="py-3 text-xs text-right font-medium">${usage.cost.toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentUsages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Hozircha AI so'rovlar yo'q
            </p>
          )}
        </div>
      </DataCard>
    </div>
  );
}
