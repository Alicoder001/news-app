import { prisma } from '@/lib/db/prisma';
import { VerificationStatus } from '@prisma/client';
import type { TrustedSource, VerificationResultInput } from './types';
import { toVerificationDto } from '@/lib/content/dto';

export const TRUSTED_SOURCES: TrustedSource[] = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', tier: 1 },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss', tier: 1 },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', tier: 1 },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', tier: 2 },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', tier: 2 },
];

type MatchedSource = {
  rawArticleId: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  canonicalUrl: string;
  overlapScore: number;
  trustTier: number;
};

function tokenize(...parts: Array<string | null | undefined>) {
  return parts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 3);
}

function scoreAgainstTrustedList(sourceUrl: string) {
  const match = TRUSTED_SOURCES.find((source) => source.url === sourceUrl);
  return match?.tier ?? 3;
}

export async function createVerificationRecord(input: VerificationResultInput & { matchedSources?: MatchedSource[] }) {
  return prisma.verificationRecord.upsert({
    where: {
      rawArticleId: input.rawArticleId,
    },
    update: {
      status: input.status as VerificationStatus,
      confidence: input.confidence,
      notes: input.notes ?? null,
      sourceCount: input.sourceCount,
      matchedSources: input.matchedSources ?? [],
    },
    create: {
      rawArticleId: input.rawArticleId,
      status: input.status as VerificationStatus,
      confidence: input.confidence,
      notes: input.notes ?? null,
      sourceCount: input.sourceCount,
      matchedSources: input.matchedSources ?? [],
    },
  });
}

export async function verifyRawArticle(rawArticleId: string) {
  const rawArticle = await prisma.rawArticle.findUnique({
    where: { id: rawArticleId },
    include: { source: true },
  });

  if (!rawArticle) {
    throw new Error(`Raw article not found: ${rawArticleId}`);
  }

  const baseTokens = new Set(tokenize(rawArticle.title, rawArticle.summary, rawArticle.content));

  const candidates = await prisma.rawArticle.findMany({
    where: {
      id: { not: rawArticle.id },
      sourceId: { not: rawArticle.sourceId },
      isDuplicate: false,
    },
    include: { source: true },
    take: 50,
    orderBy: { ingestedAt: 'desc' },
  });

  const matchedSources = candidates
    .map<MatchedSource | null>((candidate) => {
      const candidateTokens = tokenize(candidate.title, candidate.summary, candidate.content);
      const overlap = candidateTokens.filter((token) => baseTokens.has(token));

      if (overlap.length < 3) {
        return null;
      }

      return {
        rawArticleId: candidate.id,
        sourceId: candidate.sourceId,
        sourceName: candidate.source.name,
        sourceUrl: candidate.source.url,
        title: candidate.title,
        canonicalUrl: candidate.canonicalUrl,
        overlapScore: overlap.length,
        trustTier: scoreAgainstTrustedList(candidate.source.url),
      };
    })
    .filter((item): item is MatchedSource => Boolean(item))
    .sort((a, b) => {
      if (a.trustTier !== b.trustTier) {
        return a.trustTier - b.trustTier;
      }

      return b.overlapScore - a.overlapScore;
    })
    .slice(0, 2);

  const sourceCount = 1 + matchedSources.length;
  const tierBonus = matchedSources.reduce((sum, source) => sum + (4 - source.trustTier) * 0.1, 0);
  const overlapBonus = matchedSources.reduce((sum, source) => sum + Math.min(source.overlapScore, 8) * 0.03, 0);
  const confidence = Math.min(0.99, Number((0.3 + tierBonus + overlapBonus).toFixed(2)));

  let status: VerificationStatus = VerificationStatus.INSUFFICIENT;
  if (sourceCount >= 3) {
    status = VerificationStatus.VERIFIED;
  } else if (sourceCount === 2) {
    status = VerificationStatus.PARTIAL;
  }

  const notes =
    status === VerificationStatus.INSUFFICIENT
      ? 'Only one trusted reporting path found. Hold until another source confirms the story.'
      : `Matched ${matchedSources.length} supporting source(s) by keyword overlap and trust tier.`;

  return createVerificationRecord({
    rawArticleId,
    status,
    confidence,
    notes,
    sourceCount,
    matchedSources: [
      {
        rawArticleId: rawArticle.id,
        sourceId: rawArticle.sourceId,
        sourceName: rawArticle.source.name,
        sourceUrl: rawArticle.source.url,
        title: rawArticle.title,
        canonicalUrl: rawArticle.canonicalUrl,
        overlapScore: baseTokens.size,
        trustTier: scoreAgainstTrustedList(rawArticle.source.url),
      },
      ...matchedSources,
    ],
  });
}

export async function listVerificationRecords() {
  const records = await prisma.verificationRecord.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      rawArticle: {
        include: {
          source: true,
          article: true,
        },
      },
    },
  });

  return records.map(toVerificationDto);
}
