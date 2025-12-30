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

  // Update existing article with category and metadata
  const aiCategory = await prisma.category.findUnique({
    where: { slug: 'ai' },
  });

  const openaiTag = await prisma.tag.findUnique({
    where: { slug: 'openai' },
  });

  const gptTag = await prisma.tag.findUnique({
    where: { slug: 'gpt' },
  });

  if (aiCategory && openaiTag && gptTag) {
    const firstArticle = await prisma.article.findFirst();

    if (firstArticle) {
      await prisma.article.update({
        where: { id: firstArticle.id },
        data: {
          categoryId: aiCategory.id,
          tags: {
            connect: [{ id: openaiTag.id }, { id: gptTag.id }],
          },
          readingTime: 7,
          wordCount: 850,
          difficulty: Difficulty.INTERMEDIATE,
          importance: Importance.HIGH,
        },
      });
      console.log('✅ Updated first article with category and tags');
    }
  }

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
