import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Send, 
  Bell, 
  Rss, 
  Sparkles,
  Bot,
  Globe,
  Shield,
  Zap,
  BookOpen,
  Languages,
  Clock,
  TrendingUp,
  Search,
  Bookmark,
  Share2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config/social';

export const metadata: Metadata = {
  title: `Imkoniyatlar | ${SITE_CONFIG.name}`,
  description: "Antigravity platformasining barcha imkoniyatlari: Telegram kanal, Mini App, AI tahlil, bildirishnomalar va boshqalar.",
  keywords: ['antigravity', 'imkoniyatlar', 'telegram', 'mini app', 'AI', 'yangiliklar'],
};

const mainFeatures = [
  {
    icon: Send,
    title: 'Telegram Kanal',
    description: "Kunlik IT yangiliklari va tahlillarni Telegram kanalimizda kuzating. Muhim yangiliklardan birinchi bo'lib xabardor bo'ling.",
    href: SITE_CONFIG.social.telegram.channel,
    external: true,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Bot,
    title: 'Telegram Mini App',
    description: "Telegram ichida to'liq funksional ilova. Maqolalarni saqlang, o'qing va do'stlaringiz bilan ulashing.",
    href: SITE_CONFIG.social.telegram.bot,
    external: true,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Sparkles,
    title: "Sun'iy Intellekt Tahlil",
    description: "Har bir maqola AI yordamida tahlil qilinadi: murakkablik darajasi, muhimlik, o'qish vaqti avtomatik aniqlanadi.",
    href: '#ai',
    external: false,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Languages,
    title: "O'zbek Tiliga Adaptatsiya",
    description: "Ingliz tilidan tarjima emas — mazmuniy adaptatsiya. Texnik atamalar mahalliy auditoriyaga mos tushuntiriladi.",
    href: '#localization',
    external: false,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

const additionalFeatures = [
  { icon: Globe, title: 'Keng Qamrov', description: "Dunyo bo'ylab yetakchi IT manbalaridan yangiliklar" },
  { icon: Shield, title: 'Ishonchli Manbalar', description: "Faqat tekshirilgan va sifatli manbalardan ma'lumot" },
  { icon: Zap, title: 'Tezkor Yetkazish', description: "Yangiliklar real vaqtda tahlil qilinadi va yetkaziladi" },
  { icon: BookOpen, title: "O'qish Qulayligi", description: "Minimalist dizayn, qulay navigatsiya" },
  { icon: Clock, title: "O'qish Vaqti", description: "Har bir maqolaning o'qish vaqti ko'rsatiladi" },
  { icon: TrendingUp, title: 'Murakkablik Darajasi', description: "Boshlang'ich dan ekspert darajasigacha" },
  { icon: Search, title: 'Kategoriya Filtrlash', description: "AI, dasturlash, xavfsizlik bo'yicha filtrlash" },
  { icon: Bookmark, title: 'Saqlash', description: "Keyinroq o'qish uchun maqolalarni saqlang" },
  { icon: Share2, title: 'Ulashish', description: "Barcha ijtimoiy tarmoqlarga tez ulashish" },
  { icon: Bell, title: 'Bildirishnomalar', description: "Muhim yangiliklar haqida xabarnoma oling" },
  { icon: Rss, title: 'RSS Feed', description: "RSS orqali yangiliklar oqimiga ulanish" },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Platformamiz Imkoniyatlari
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {SITE_CONFIG.name} — texnologiya yangiliklarini yangicha tajriba qilish. 
          Sun&apos;iy intellekt, Telegram integratsiya va mahalliylashtirish.
        </p>
      </div>

      {/* Main Features */}
      <section className="mb-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/70 mb-6">
          Asosiy Imkoniyatlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <a
                key={feature.title}
                href={feature.href}
                target={feature.external ? '_blank' : undefined}
                rel={feature.external ? 'noopener noreferrer' : undefined}
                className={`group p-6 rounded-2xl border border-foreground/5 ${feature.bgColor} hover:border-foreground/10 transition-all`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} bg-white dark:bg-black/20`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {feature.title}
                  {feature.external && <ExternalLink className="w-4 h-4 opacity-50" />}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${feature.color}`}>
                  {feature.external ? "Ochish" : "Batafsil"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="mb-16" id="all-features">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/70 mb-6">
          Barcha Imkoniyatlar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {additionalFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-4 rounded-xl border border-foreground/5 hover:border-foreground/10 hover:bg-foreground/[0.02] transition-all"
              >
                <Icon className="w-5 h-5 text-muted-foreground mb-2" />
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Section */}
      <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-foreground/5" id="ai">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Sun&apos;iy Intellekt Qanday Ishlaydi?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Har bir maqola platformaga kelganida, AI uni bir necha bosqichda qayta ishlaydi:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Mazmun tahlili:</strong> Maqolaning asosiy g&apos;oyasi va muhimligi aniqlanadi</li>
                <li><strong>Adaptatsiya:</strong> Ingliz tilidan O&apos;zbek tiliga mazmuniy adaptatsiya</li>
                <li><strong>Metadata:</strong> O&apos;qish vaqti, murakkablik va kategoriya avtomatik aniqlanadi</li>
                <li><strong>SEO:</strong> Kalit so&apos;zlar va meta teglar generatsiya qilinadi</li>
              </ol>
              <p>
                Natijada siz sifatli, tushunarli va foydali kontent olasiz — tarjima mashinalari bermagan yangicha tajriba.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <h2 className="text-2xl font-bold mb-3">Hoziroq Boshlang</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Telegram kanalimizga obuna bo&apos;ling va IT yangiliklaridan birinchi bo&apos;lib xabardor bo&apos;ling.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={SITE_CONFIG.social.telegram.channel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
            Kanalga obuna bo&apos;lish
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 rounded-xl font-medium hover:bg-foreground/5 transition-colors"
          >
            Yangiliklarni ko&apos;rish
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
