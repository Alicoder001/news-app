import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create News Sources
  const newsApiSource = await prisma.newsSource.upsert({
    where: { url: 'https://newsapi.org' },
    update: {},
    create: {
      name: 'NewsAPI',
      url: 'https://newsapi.org',
      type: 'NEWS_API',
      isActive: true,
    },
  });

  const techCrunchSource = await prisma.newsSource.upsert({
    where: { url: 'https://techcrunch.com' },
    update: {},
    create: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      type: 'RSS',
      isActive: true,
    },
  });

  console.log('✅ News sources created:', { newsApiSource, techCrunchSource });

  // 2. Create Sample Raw Articles
  const rawArticles = [
    {
      externalId: 'test-1',
      title: 'OpenAI Releases GPT-5 with Revolutionary Capabilities',
      description: 'OpenAI has announced GPT-5, featuring unprecedented reasoning and multimodal capabilities that surpass all previous models.',
      content: 'In a groundbreaking announcement today, OpenAI unveiled GPT-5, their latest and most advanced language model. The new model demonstrates remarkable improvements in reasoning, mathematical problem-solving, and creative tasks. Industry experts are calling this a watershed moment in AI development.',
      url: 'https://example.com/gpt5-release',
      publishedAt: new Date('2024-01-15'),
      sourceId: newsApiSource.id,
    },
    {
      externalId: 'test-2',
      title: 'Google Announces Major Breakthrough in Quantum Computing',
      description: 'Google researchers achieve quantum supremacy with new 1000-qubit processor, opening doors to revolutionary computing possibilities.',
      content: 'Google researchers have successfully demonstrated quantum supremacy using their latest 1000-qubit quantum processor. This breakthrough could revolutionize cryptography, drug discovery, and complex simulations. The achievement marks a significant milestone in the race for practical quantum computing.',
      url: 'https://example.com/google-quantum',
      publishedAt: new Date('2024-01-14'),
      sourceId: newsApiSource.id,
    },
    {
      externalId: 'test-3',
      title: 'Microsoft Integrates AI Deeply into Windows 12',
      description: 'Windows 12 brings native AI assistance to every aspect of the operating system, transforming user productivity.',
      content: 'Microsoft has revealed Windows 12, the first operating system built from the ground up with AI at its core. The new OS features intelligent task automation, real-time language translation, and adaptive performance optimization. Beta testing begins next month.',
      url: 'https://example.com/windows-12-ai',
      publishedAt: new Date('2024-01-13'),
      sourceId: techCrunchSource.id,
    },
    {
      externalId: 'test-4',
      title: 'Apple Vision Pro Launches with Record Pre-Orders',
      description: 'Apple\'s spatial computing headset sees unprecedented demand, selling out within hours of launch.',
      content: 'Apple Vision Pro officially launched today, with initial stock selling out in under 2 hours. The $3,499 mixed reality headset promises to revolutionize spatial computing. Early reviews praise its display quality and seamless integration with Apple ecosystem.',
      url: 'https://example.com/vision-pro-launch',
      publishedAt: new Date('2024-01-12'),
      sourceId: techCrunchSource.id,
    },
    {
      externalId: 'test-5',
      title: 'Tesla Announces Fully Autonomous Driving Update',
      description: 'Tesla releases FSD v12 with end-to-end neural network, achieving Level 4 autonomy in urban environments.',
      content: 'Tesla has released Full Self-Driving version 12, powered entirely by neural networks. The update eliminates traditional code-based driving logic, relying instead on AI trained on billions of miles of driving data. Early testers report significant improvements in complex urban scenarios.',
      url: 'https://example.com/tesla-fsd-12',
      publishedAt: new Date('2024-01-11'),
      sourceId: newsApiSource.id,
    },
  ];

  for (const article of rawArticles) {
    await prisma.rawArticle.upsert({
      where: { url: article.url },
      update: {},
      create: article,
    });
  }

  console.log(`✅ Created ${rawArticles.length} raw articles`);

  // 3. Create a sample processed Article
  const firstRaw = await prisma.rawArticle.findFirst({
    where: { externalId: 'test-1' },
  });

  if (firstRaw) {
    await prisma.article.upsert({
      where: { rawArticleId: firstRaw.id },
      update: {},
      create: {
        slug: 'openai-gpt-5-ni-taqdim-etdi',
        title: 'OpenAI GPT-5 ni taqdim etdi - Sun\'iy intellekt rivojlanishida yangi bosqich',
        summary: 'OpenAI kompaniyasi o\'zining eng kuchli til modeli GPT-5 ni e\'lon qildi. Yangi model mantiqiy fikrlash, matematik muammolarni yechish va ijodiy vazifalarni bajarishda oldingi modellardan ancha ustunroq.',
        content: `<h3>Umumiy ma'lumot</h3>
<p>Bugungi kun OpenAI kompaniyasi o'zining eng so'nggi va eng ilg'or til modeli GPT-5 ni taqdim etdi. Yangi model mantiqiy fikrlash, matematik muammolarni yechish va ijodiy vazifalarda sezilarli yaxshilanishlarni ko'rsatmoqda.</p>

<h3>Asosiy xususiyatlari</h3>
<ul>
<li>Yaxshilangan mantiqiy fikrlash qobiliyati</li>
<li>Ko'p modalli (multimodal) imkoniyatlar</li>
<li>Yuqori darajada ijodiy vazifalarni bajarish</li>
</ul>

<p>Sanoat ekspertlari buni sun'iy intellekt rivojlanishidagi muhim bosqich deb atashmoqda.</p>`,
        originalUrl: firstRaw.url,
        rawArticleId: firstRaw.id,
        language: 'uz',
        telegramPosted: false,
      },
    });

    console.log('✅ Created sample processed article');
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
