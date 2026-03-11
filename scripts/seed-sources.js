const { PrismaClient, SourceType } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultSources = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/' },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  },
];

async function main() {
  let created = 0;

  for (const source of defaultSources) {
    await prisma.source.upsert({
      where: { url: source.url },
      update: {
        name: source.name,
        isActive: true,
      },
      create: {
        name: source.name,
        url: source.url,
        type: SourceType.RSS,
        isActive: true,
      },
    });

    created += 1;
  }

  console.log(`Seeded or updated ${created} RSS sources.`);
}

main()
  .catch((error) => {
    console.error('Failed to seed sources:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
