import { Rss, Plus, ExternalLink } from 'lucide-react';
import { SourceActions } from './source-actions';
import { getAdminSources } from '@/lib/api/server-api';

async function getSources() {
  const response = await getAdminSources();
  return (response.data.sources as Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    isActive: boolean;
    lastFetched: string | null;
    rawArticleCount: number;
  }>) ?? [];
}

export default async function SourcesPage() {
  const sources = await getSources();

  const activeSources = sources.filter(s => s.isActive);
  const inactiveSources = sources.filter(s => !s.isActive);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold">Manbalar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeSources.length} ta faol, {inactiveSources.length} ta nofaol
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus className="w-4 h-4" />
          Yangi manba
        </button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <div
            key={source.id}
            className="p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02] hover:border-foreground/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                  <Rss className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{source.name}</h3>
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    source.isActive ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      source.isActive ? 'bg-green-500' : 'bg-muted-foreground'
                    }`} />
                    {source.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground">
                {source.type}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Maqolalar</span>
                <span className="font-medium">{source.rawArticleCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">So'ngi yangilangan</span>
                <span className="text-xs">
                  {source.lastFetched 
                    ? new Date(source.lastFetched).toLocaleDateString('uz-UZ')
                    : 'Hali yangilanmagan'
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-foreground/5">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-foreground/5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ochish
              </a>
              <SourceActions 
                sourceId={source.id} 
                sourceName={source.name} 
                isActive={source.isActive} 
              />
            </div>
          </div>
        ))}

        {/* Add New Source Card */}
        <button className="p-6 rounded-xl border border-dashed border-foreground/10 bg-foreground/[0.01] hover:border-foreground/20 hover:bg-foreground/[0.02] transition-colors group">
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-3 group-hover:bg-foreground/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Yangi manba qo'shish</p>
          </div>
        </button>
      </div>
    </div>
  );
}
