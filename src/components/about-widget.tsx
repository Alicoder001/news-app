import { getTranslations } from 'next-intl/server';

export async function AboutWidget() {
  const t = await getTranslations('home.about');
  const tCommon = await getTranslations('common');
  
  return (
    <div className="glass-card p-4 rounded-xl space-y-3">
      <h4 className="text-sm font-bold font-serif">{tCommon('siteName')}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {t('description')}
      </p>
    </div>
  );
}
