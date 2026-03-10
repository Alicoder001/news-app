import { getTranslations } from 'next-intl/server';

export async function AboutWidget() {
  const t = await getTranslations('home.about');
  
  return (
    <section className="glass-card p-6 rounded-2xl">
      <h3 className="text-base font-bold font-serif mb-2">{t('title')}</h3>
      <p className="text-[11px] text-foreground/70 mb-5 leading-relaxed">
        {t('description')}
      </p>
    </section>
  );
}
