import { listPublishedArticles } from '@/lib/content/article.service';
import { MiniAppShell } from '@/components/tg/mini-app-shell';

export default async function TelegramMiniAppFeedPage() {
  const articles = await listPublishedArticles(20);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Mini App Feed</h1>
      <MiniAppShell articles={articles} />
    </main>
  );
}
