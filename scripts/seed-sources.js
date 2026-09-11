const { PrismaClient, SourceType } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultSources = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', isActive: false },
  { name: 'NVIDIA Developer Blog', url: 'https://developer.nvidia.com/blog/feed' },
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

function isValidSourceUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return false;
  }

  let parsed;

  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  return parsed.protocol === 'http:' || parsed.protocol === 'https:';
}

function validateSource(source) {
  if (!source || typeof source !== 'object') {
    return { valid: false, reason: 'source entry is not an object' };
  }

  if (typeof source.name !== 'string' || source.name.trim().length === 0) {
    return { valid: false, reason: 'missing or empty name' };
  }

  if (!isValidSourceUrl(source.url)) {
    return { valid: false, reason: `invalid URL: ${String(source.url)}` };
  }

  return { valid: true };
}

async function main() {
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const source of defaultSources) {
    const label = `${source && source.name ? source.name : '<unnamed>'} <${
      source && source.url ? source.url : '<missing url>'
    }>`;
    const validation = validateSource(source);

    if (!validation.valid) {
      skipped += 1;
      console.warn(`[SKIP] ${label} - ${validation.reason}`);
      continue;
    }

    const url = source.url.trim();
    const name = source.name.trim();

    try {
      // Idempotent: Source.url is @unique, so re-running the seed only updates.
      await prisma.source.upsert({
        where: { url },
        update: {
          name,
          isActive: source.isActive ?? true,
        },
        create: {
          name,
          url,
          type: SourceType.RSS,
          isActive: source.isActive ?? true,
        },
      });

      ok += 1;
      console.log(`[OK] ${name} <${url}>`);
    } catch (error) {
      failed += 1;
      console.error(`[FAIL] ${label} - ${error.message}`);
    }
  }

  const total = defaultSources.length;
  console.log(`Seed summary: OK=${ok} SKIP=${skipped} FAIL=${failed} total=${total}`);

  if (failed > 0) {
    throw new Error(`${failed} source(s) failed to seed`);
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed sources:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
