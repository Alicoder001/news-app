import { PrismaClient, Difficulty, Importance } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    slug: 'ai',
    name: "Sun'iy Intellekt",
    nameEn: 'Artificial Intelligence',
    description: 'AI, Machine Learning, Neural Networks va Deep Learning yangiliklari',
    icon: '🤖',
    color: '#8B5CF6',
  },
  {
    slug: 'cloud',
    name: 'Cloud Computing',
    nameEn: 'Cloud Computing',
    description: 'AWS, Azure, Google Cloud va boshqa cloud xizmatlari',
    icon: '☁️',
    color: '#3B82F6',
  },
  {
    slug: 'security',
    name: 'Xavfsizlik',
    nameEn: 'Cybersecurity',
    description: 'Kiberxavfsizlik, ma\'lumotlar himoyasi va encryption',
    icon: '🔒',
    color: '#EF4444',
  },
  {
    slug: 'web',
    name: 'Web Development',
    nameEn: 'Web Development',
    description: 'Frontend, Backend, Full-stack development',
    icon: '🌐',
    color: '#10B981',
  },
  {
    slug: 'mobile',
    name: 'Mobile Development',
    nameEn: 'Mobile Development',
    description: 'iOS, Android, React Native, Flutter',
    icon: '📱',
    color: '#F59E0B',
  },
  {
    slug: 'blockchain',
    name: 'Blockchain',
    nameEn: 'Blockchain',
    description: 'Cryptocurrency, Web3, DeFi va NFT',
    icon: '⛓️',
    color: '#6366F1',
  },
  {
    slug: 'devops',
    name: 'DevOps',
    nameEn: 'DevOps',
    description: 'CI/CD, Docker, Kubernetes, Infrastructure',
    icon: '⚙️',
    color: '#EC4899',
  },
  {
    slug: 'data',
    name: 'Data Science',
    nameEn: 'Data Science',
    description: 'Big Data, Analytics, Data Engineering',
    icon: '📊',
    color: '#14B8A6',
  },
];

const tags = [
  { name: 'GPT', slug: 'gpt' },
  { name: 'OpenAI', slug: 'openai' },
  { name: 'Google', slug: 'google' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Meta', slug: 'meta' },
  { name: 'Tesla', slug: 'tesla' },
  { name: 'AWS', slug: 'aws' },
  { name: 'Azure', slug: 'azure' },
  { name: 'Kubernetes', slug: 'kubernetes' },
  { name: 'Docker', slug: 'docker' },
  { name: 'React', slug: 'react' },
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Python', slug: 'python' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Startup', slug: 'startup' },
  { name: 'Innovation', slug: 'innovation' },
];

async function main() {
  console.log('🌱 Seeding categories and tags...');

  // Seed categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Seed tags
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }
  console.log(`✅ Created ${tags.length} tags`);

  // Create NewsSource
  const newsSource = await prisma.newsSource.upsert({
    where: { url: 'https://techcrunch.com' },
    update: {},
    create: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      type: 'NEWS_API',
      isActive: true,
    },
  });
  console.log('✅ Created news source');

  // Sample articles data
  const sampleArticles = [
    {
      slug: 'openai-gpt-5-yangi-model',
      title: "OpenAI GPT-5 ni taqdim etdi - Sun'iy intellekt rivojlanishida yangi bosqich",
      summary: "OpenAI kompaniyasi o'zining eng kuchli til modeli GPT-5 ni e'lon qildi. Yangi model mantiqiy fikrlash, matematik muammolarni yechish va ijodiy vazifalarni bajarishda oldingi modellardan ancha ustun.",
      content: `<h3>GPT-5 ning yangi imkoniyatlari</h3>
<p>OpenAI kompaniyasi bugun GPT-5 modelini rasmiy ravishda taqdim etdi. Yangi model sun'iy intellekt sohasida inqilobiy o'zgarishlarni va'da qilmoqda.</p>
<p>GPT-5 o'zining oldingi versiyasiga nisbatan 10 barobar ko'proq kontekst oynasiga ega bo'lib, bu uzoq muloqotlarni saqlash va murakkab vazifalarni bajarishda katta afzallik beradi.</p>
<h3>Asosiy yangiliklar</h3>
<p>Model multimodal qobiliyatlarga ega - u matn, rasm, audio va video bilan ishlash imkoniyatiga ega. Bundan tashqari, real vaqt rejimida internetdan ma'lumot olish funksiyasi ham qo'shilgan.</p>`,
      categorySlug: 'ai',
      tagSlugs: ['openai', 'gpt'],
      difficulty: Difficulty.INTERMEDIATE,
      importance: Importance.CRITICAL,
      readingTime: 7,
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'kubernetes-2-0-yangi-versiya',
      title: 'Kubernetes 2.0 chiqdi - Konteyner orkestatsiyasida yangi davr',
      summary: "Kubernetes jamiyati uzoq kutilgan 2.0 versiyasini e'lon qildi. Yangi versiya avtomatik masshtablash, xavfsizlik va resurslarni boshqarish bo'yicha katta yaxshilanishlar olib keldi.",
      content: `<h3>Kubernetes 2.0 nima yangiliklar olib keldi?</h3>
<p>Kubernetes 2.0 konteyner orkestatsiyasida yangi standartlarni belgilaydi. Yangi versiya cloud-native ilovalarni boshqarishni yanada osonlashtiradi.</p>
<p>Asosiy o'zgarishlardan biri - bu yangi "Smart Scheduler" funksiyasi bo'lib, u mashinali o'rganish algoritmlaridan foydalanib, resurslarni optimal taqsimlaydi.</p>`,
      categorySlug: 'devops',
      tagSlugs: ['kubernetes', 'docker'],
      difficulty: Difficulty.ADVANCED,
      importance: Importance.HIGH,
      readingTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-c81c0c60cf32?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'react-19-yangi-xususiyatlar',
      title: 'React 19 rasmiy ravishda chiqdi - Server Components va yangi Hooks',
      summary: "Meta kompaniyasi React 19 ni rasmiy ravishda e'lon qildi. Yangi versiya Server Components, yangi use() hook va ishlash tezligini sezilarli darajada oshiradi.",
      content: `<h3>React 19 ning asosiy yangiliklari</h3>
<p>React 19 frontend rivojlantirishda katta qadam bo'lib, u Server Components ni to'liq qo'llab-quvvatlaydi.</p>
<p>Yangi use() hook Promise va Context bilan ishlashni soddalashtirib, kod yozishni osonlashtiradi.</p>`,
      categorySlug: 'web',
      tagSlugs: ['react', 'javascript'],
      difficulty: Difficulty.INTERMEDIATE,
      importance: Importance.HIGH,
      readingTime: 6,
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'aws-lambda-yangi-runtime',
      title: "AWS Lambda Node.js 22 runtime ni qo'llab-quvvatlaydi",
      summary: "Amazon Web Services Lambda funksiyalari uchun Node.js 22 runtime ni qo'shdi. Bu yangilik serverless arxitekturalar uchun yangi imkoniyatlar ochadi.",
      content: `<h3>Node.js 22 Lambda da</h3>
<p>AWS Lambda endi Node.js 22 ni to'liq qo'llab-quvvatlaydi, bu esa eng yangi JavaScript xususiyatlaridan foydalanish imkonini beradi.</p>
<p>Yangi runtime 40% gacha tezroq cold start vaqtini ta'minlaydi.</p>`,
      categorySlug: 'cloud',
      tagSlugs: ['aws', 'javascript'],
      difficulty: Difficulty.INTERMEDIATE,
      importance: Importance.MEDIUM,
      readingTime: 4,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'flutter-4-mobile-development',
      title: "Flutter 4.0 e'lon qilindi - Cross-platform rivojlantirishda yangi imkoniyatlar",
      summary: "Google Flutter 4.0 ni taqdim etdi. Yangi versiya Impeller rendering engine, yangi Material 3 komponentlari va desktop ilovalar uchun yaxshilanishlar olib keldi.",
      content: `<h3>Flutter 4.0 yangiliklari</h3>
<p>Flutter 4.0 cross-platform mobil rivojlantirishda yangi standartlarni belgilaydi. Impeller rendering engine barcha platformalarda 120fps animatsiyalarni ta'minlaydi.</p>
<p>Dart 3.2 integratsiyasi pattern matching va sealed class larni qo'llab-quvvatlaydi.</p>`,
      categorySlug: 'mobile',
      tagSlugs: ['google', 'innovation'],
      difficulty: Difficulty.INTERMEDIATE,
      importance: Importance.MEDIUM,
      readingTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'python-3-13-yangi-versiya',
      title: 'Python 3.13 chiqdi - GIL ni optional qilish va yangi xususiyatlar',
      summary: "Python 3.13 Global Interpreter Lock (GIL) ni ixtiyoriy qilish imkoniyatini taqdim etdi. Bu multi-threaded ilovalar uchun katta yutuq hisoblanadi.",
      content: `<h3>Python 3.13 inqilobi</h3>
<p>Python 3.13 eng muhim o'zgarish - bu GIL ni o'chirish imkoniyati. Bu multi-core protsessorlardan to'liq foydalanish imkonini beradi.</p>
<p>Yangi JIT compiler eksperimental rejimda mavjud bo'lib, ba'zi holatlarda 5x tezlikni oshiradi.</p>`,
      categorySlug: 'data',
      tagSlugs: ['python', 'innovation'],
      difficulty: Difficulty.ADVANCED,
      importance: Importance.HIGH,
      readingTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'ethereum-layer2-scaling',
      title: 'Ethereum Layer 2 yechimlari - Polygon va Arbitrum tahlili',
      summary: "Ethereum tarmoqidagi layer 2 yechimlar kriptovalyuta ekotizimida muhim rol o'ynaydi. Polygon va Arbitrum eng mashhur yechimlar sifatida tahlil qilinadi.",
      content: `<h3>Layer 2 nima?</h3>
<p>Layer 2 yechimlar Ethereum asosiy tarmog'idan tashqarida tranzaksiyalarni qayta ishlaydi, keyin ularni asosiy tarmoqqa birlashtiradi.</p>
<p>Bu yondashuv gaz narxlarini 100 barobar kamaytirishi mumkin.</p>`,
      categorySlug: 'blockchain',
      tagSlugs: ['startup', 'innovation'],
      difficulty: Difficulty.ADVANCED,
      importance: Importance.MEDIUM,
      readingTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'zero-trust-security-model',
      title: "Zero Trust xavfsizlik modeli - Zamonaviy kiberxavfsizlik yondashuvi",
      summary: "Zero Trust modeli 'hech kimga ishonma, hammasini tekshir' prinsipi asosida qurilgan. Bu yondashuv zamonaviy tashkilotlar uchun eng samarali himoya usuli hisoblanadi.",
      content: `<h3>Zero Trust nima?</h3>
<p>Zero Trust xavfsizlik modeli an'anaviy perimetr asosidagi xavfsizlikdan tubdan farq qiladi. Bu modelda har bir so'rov, foydalanuvchi va qurilma doimiy tekshiriladi.</p>
<p>Asosiy tamoyillar: minimal imtiyozlar, mikrosegmentatsiya va doimiy tekshirish.</p>`,
      categorySlug: 'security',
      tagSlugs: ['microsoft', 'google'],
      difficulty: Difficulty.EXPERT,
      importance: Importance.HIGH,
      readingTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  console.log('📝 Creating sample articles...');

  for (const articleData of sampleArticles) {
    const category = await prisma.category.findUnique({
      where: { slug: articleData.categorySlug },
    });

    const tags = await prisma.tag.findMany({
      where: { slug: { in: articleData.tagSlugs } },
    });

    // Create RawArticle first
    const rawArticle = await prisma.rawArticle.upsert({
      where: { url: `https://example.com/${articleData.slug}` },
      update: {},
      create: {
        title: articleData.title,
        description: articleData.summary,
        content: articleData.content,
        url: `https://example.com/${articleData.slug}`,
        publishedAt: new Date(),
        sourceId: newsSource.id,
        isProcessed: true,
        processedAt: new Date(),
      },
    });

    // Create Article
    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        title: articleData.title,
        summary: articleData.summary,
        content: articleData.content,
        categoryId: category?.id,
        tags: { set: tags.map(t => ({ id: t.id })) },
        readingTime: articleData.readingTime,
        wordCount: articleData.content.length / 5,
        difficulty: articleData.difficulty,
        importance: articleData.importance,
        imageUrl: articleData.imageUrl,
      },
      create: {
        slug: articleData.slug,
        title: articleData.title,
        summary: articleData.summary,
        content: articleData.content,
        originalUrl: `https://example.com/${articleData.slug}`,
        rawArticleId: rawArticle.id,
        categoryId: category?.id,
        tags: { connect: tags.map(t => ({ id: t.id })) },
        readingTime: articleData.readingTime,
        wordCount: Math.round(articleData.content.length / 5),
        difficulty: articleData.difficulty,
        importance: articleData.importance,
        imageUrl: articleData.imageUrl,
      },
    });
  }

  console.log(`✅ Created ${sampleArticles.length} sample articles`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
