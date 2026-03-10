import { Metadata } from 'next';
import { SocialLinks } from '@/components/social-links';
import { SITE_CONFIG } from '@/lib/config/social';

export const metadata: Metadata = {
  title: `Biz haqimizda | ${SITE_CONFIG.name}`,
  description: "Antigravity - O'zbekiston IT hamjamiyati uchun sun'iy intellekt yordamida tayyorlangan texnologiya yangiliklari portali.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
        Biz haqimizda
      </h1>
      
      <div className="prose prose-lg prose-headings:font-serif max-w-none space-y-8 text-foreground/80">
        <p className="lead text-xl leading-relaxed">
          <strong>{SITE_CONFIG.name}</strong> — O&apos;zbekiston IT hamjamiyati uchun yaratilgan 
          sun&apos;iy intellekt asosidagi texnologiya yangiliklari platformasi.
        </p>

        <section>
          <h2>Bizning missiyamiz</h2>
          <p>
            Biz dunyo bo&apos;ylab eng so&apos;nggi IT va texnologiya yangiliklarini O&apos;zbek tiliga 
            professional tarzda adaptatsiya qilib, mahalliy auditoriyaga tushunarli va foydali 
            ko&apos;rinishda yetkazamiz.
          </p>
        </section>

        <section>
          <h2>Qanday ishlaymiz</h2>
          <p>Bizning platforma quyidagi jarayondan iborat:</p>
          <ol>
            <li>
              <strong>Ma&apos;lumot yig&apos;ish:</strong> Dunyo bo&apos;ylab yetakchi IT manbalaridan 
              (Google News, TechCrunch va boshqalar) yangiliklarni to&apos;playmiz.
            </li>
            <li>
              <strong>AI qayta ishlash:</strong> Sun&apos;iy intellekt yordamida yangiliklarni O&apos;zbek 
              tiliga adaptatsiya qilamiz — tarjima emas, interpretatsiya!
            </li>
            <li>
              <strong>Sifat nazorati:</strong> Har bir maqola sifat standartlarimizga mos kelishini 
              ta&apos;minlaymiz.
            </li>
            <li>
              <strong>Tarqatish:</strong> Veb-sayt va Telegram orqali auditoriyaga yetkazamiz.
            </li>
          </ol>
        </section>

        <section>
          <h2>Bizning qadriyatlarimiz</h2>
          <ul>
            <li><strong>Ishonchlilik:</strong> Faqat tekshirilgan manbalardan ma&apos;lumot olamiz</li>
            <li><strong>Tushunarlilik:</strong> Texnik mavzularni oddiy tilda tushuntiramiz</li>
            <li><strong>Tezkorlik:</strong> Eng so&apos;nggi yangiliklarni tez yetkazamiz</li>
            <li><strong>Mahalliylik:</strong> O&apos;zbekiston IT hamjamiyati uchun moslashtirilgan</li>
          </ul>
        </section>

        <section>
          <h2>Biz bilan bog&apos;laning</h2>
          <p className="mb-4">
            Savollar, takliflar yoki hamkorlik uchun biz bilan bog&apos;laning:
          </p>
          <p>
            📧 Email:{' '}
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-blue-500 hover:underline">
              {SITE_CONFIG.email}
            </a>
          </p>
          <p>
            📱 Telegram:{' '}
            <a 
              href={SITE_CONFIG.social.telegram.channel} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {SITE_CONFIG.social.telegram.username}
            </a>
          </p>
          
          <div className="mt-6">
            <p className="font-semibold mb-3">Ijtimoiy tarmoqlarda kuzating:</p>
            <SocialLinks />
          </div>
        </section>
      </div>
    </div>
  );
}
