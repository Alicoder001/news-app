import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config/social';

export const metadata: Metadata = {
  title: `Foydalanish shartlari | ${SITE_CONFIG.name}`,
  description: "Antigravity platformasidan foydalanish shartlari va qoidalari.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
        Foydalanish shartlari
      </h1>
      
      <div className="prose prose-lg prose-headings:font-serif max-w-none space-y-8 text-foreground/80">
        <p className="lead">
          Oxirgi yangilanish: {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2>1. Umumiy qoidalar</h2>
          <p>
            {SITE_CONFIG.name} veb-saytidan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz. 
            Agar rozilik bildirmasangiz, iltimos saytdan foydalanmang.
          </p>
        </section>

        <section>
          <h2>2. Xizmatlar tavsifi</h2>
          <p>
            {SITE_CONFIG.name} — bu sun&apos;iy intellekt yordamida tayyorlangan IT va texnologiya 
            yangiliklari platformasi. Biz turli manbalardan yangiliklar to&apos;plab, O&apos;zbek tiliga 
            adaptatsiya qilamiz.
          </p>
        </section>

        <section>
          <h2>3. Mualliflik huquqlari</h2>
          <p>
            Saytdagi barcha kontent {SITE_CONFIG.name} mulki hisoblanadi. Kontent boshqa manbalardan 
            olingan bo&apos;lsa, asl manba ko&apos;rsatiladi.
          </p>
          <p>
            Biz yangiliklarni asl manbalardan olib, AI yordamida qayta ishlagan holda taqdim etamiz. 
            Original manbalar har bir maqolada ko&apos;rsatiladi.
          </p>
        </section>

        <section>
          <h2>4. Foydalanuvchilar majburiyatlari</h2>
          <p>Foydalanuvchilar quyidagilarni bajarmasliklari kerak:</p>
          <ul>
            <li>Sayt xavfsizligini buzish</li>
            <li>Spam yoki zararli kontent tarqatish</li>
            <li>Boshqa foydalanuvchilarni bezovta qilish</li>
            <li>Kontentni rozilikisiz kommersiya maqsadlarida foydalanish</li>
          </ul>
        </section>

        <section>
          <h2>5. Javobgarlik cheklovlari</h2>
          <p>
            Biz taqdim etgan ma&apos;lumotlarning to&apos;g&apos;riligi uchun kafolat bermaymiz. 
            Ma&apos;lumotlar faqat axborot maqsadlari uchun taqdim etiladi.
          </p>
        </section>

        <section>
          <h2>6. Shartlarning o&apos;zgarishi</h2>
          <p>
            Biz istalgan vaqtda ushbu shartlarni o&apos;zgartirish huquqini saqlab qolamiz. 
            O&apos;zgarishlar saytda e&apos;lon qilinadi.
          </p>
        </section>

        <section>
          <h2>7. Bog&apos;lanish</h2>
          <p>
            Savollar uchun biz bilan bog&apos;laning:{' '}
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-blue-500 hover:underline">
              {SITE_CONFIG.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
