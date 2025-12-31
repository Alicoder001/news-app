import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config/social';

export const metadata: Metadata = {
  title: `Maxfiylik siyosati | ${SITE_CONFIG.name}`,
  description: "Antigravity platformasining maxfiylik siyosati va shaxsiy ma'lumotlarni himoya qilish qoidalari.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
        Maxfiylik siyosati
      </h1>
      
      <div className="prose prose-lg prose-headings:font-serif max-w-none space-y-8 text-foreground/80">
        <p className="lead">
          Oxirgi yangilanish: {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2>1. Kirish</h2>
          <p>
            {SITE_CONFIG.name} (&quot;biz&quot;, &quot;bizning&quot;) foydalanuvchilarning maxfiyligini hurmat qiladi. 
            Ushbu sahifa bizning veb-saytimizdan foydalanganingizda to&apos;plagan ma&apos;lumotlarimiz va ulardan 
            qanday foydalanishimiz haqida ma&apos;lumot beradi.
          </p>
        </section>

        <section>
          <h2>2. To&apos;planadigan ma&apos;lumotlar</h2>
          <p>Biz quyidagi turdagi ma&apos;lumotlarni to&apos;plashimiz mumkin:</p>
          <ul>
            <li><strong>Foydalanish statistikasi:</strong> Saytga tashriflar, ko&apos;rilgan sahifalar</li>
            <li><strong>Qurilma ma&apos;lumotlari:</strong> Brauzer turi, til sozlamalari</li>
            <li><strong>Ixtiyoriy ma&apos;lumotlar:</strong> Obuna bo&apos;lganingizda email manzil</li>
          </ul>
        </section>

        <section>
          <h2>3. Cookie fayllar</h2>
          <p>
            Biz cookie fayllaridan foydalanuvchi tajribasini yaxshilash uchun foydalanamiz. 
            Siz brauzer sozlamalarida cookie&apos;larni o&apos;chirib qo&apos;yishingiz mumkin.
          </p>
        </section>

        <section>
          <h2>4. Uchinchi tomon xizmatlari</h2>
          <p>Biz quyidagi uchinchi tomon xizmatlaridan foydalanamiz:</p>
          <ul>
            <li>Google Analytics — sayt statistikasi uchun</li>
            <li>Telegram — yangiliklar tarqatish uchun</li>
          </ul>
        </section>

        <section>
          <h2>5. Ma&apos;lumotlarni saqlash</h2>
          <p>
            Biz shaxsiy ma&apos;lumotlaringizni xavfsiz serverlarida saqlaymiz va uchinchi tomonlarga 
            roziligingizsiz bermayiz.
          </p>
        </section>

        <section>
          <h2>6. Foydalanuvchi huquqlari</h2>
          <p>Siz quyidagi huquqlarga egasiz:</p>
          <ul>
            <li>Ma&apos;lumotlaringizga kirish huquqi</li>
            <li>Ma&apos;lumotlaringizni o&apos;zgartirish huquqi</li>
            <li>Ma&apos;lumotlaringizni o&apos;chirish huquqi</li>
            <li>Obunadan chiqish huquqi</li>
          </ul>
        </section>

        <section>
          <h2>7. Bog&apos;lanish</h2>
          <p>
            Savollar yoki shikoyatlar uchun biz bilan bog&apos;laning:{' '}
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-blue-500 hover:underline">
              {SITE_CONFIG.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
