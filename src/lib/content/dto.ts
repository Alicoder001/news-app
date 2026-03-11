import type { Article, RawArticle, Source, VerificationRecord } from '@prisma/client';

type ArticleWithOptionalRefs = Article & {
  sourceReferences?: unknown;
};

type VerificationWithRefs = VerificationRecord & {
  matchedSources?: unknown;
};

type SourceReferenceDto = {
  name: string;
  url: string;
};

function normalizeReference(value: unknown): SourceReferenceDto | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as { name?: unknown; url?: unknown };
  if (typeof candidate.name !== 'string' || typeof candidate.url !== 'string') {
    return null;
  }

  return {
    name: candidate.name,
    url: candidate.url,
  };
}

function normalizeReferences(value: unknown): SourceReferenceDto[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeReference).filter((reference): reference is SourceReferenceDto => Boolean(reference));
}

export function toPublicArticleDto(article: ArticleWithOptionalRefs) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    shortSummary: article.shortSummary,
    shortPost: article.shortPost,
    fullArticle: article.fullArticle,
    category: article.category,
    tags: article.tags,
    websiteUrl: article.websiteUrl,
    websitePublishedAt: article.websitePublishedAt,
    sourceReferences: normalizeReferences(article.sourceReferences),
  };
}

export function toAdminArticleDto(
  article: ArticleWithOptionalRefs & {
    rawArticle?: RawArticle | null;
    deliveries?: Array<{ channel: string; status: string; errorMessage: string | null; externalId: string | null }>;
  },
) {
  return {
    ...toPublicArticleDto(article),
    status: article.status,
    holdReason: article.holdReason,
    rejectReason: article.rejectReason,
    telegramPublished: article.telegramPublished,
    websitePublished: article.websitePublished,
    telegramPublishedAt: article.telegramPublishedAt,
    rawArticle: article.rawArticle
      ? {
          id: article.rawArticle.id,
          title: article.rawArticle.title,
          canonicalUrl: article.rawArticle.canonicalUrl,
          processingState: article.rawArticle.processingState,
          holdReason: article.rawArticle.holdReason,
          rejectReason: article.rawArticle.rejectReason,
        }
      : null,
    deliveries: article.deliveries ?? [],
  };
}

export function toVerificationDto(
  record: VerificationWithRefs & {
    rawArticle: RawArticle & { source: Source; article?: Article | null };
  },
) {
  return {
    id: record.id,
    status: record.status,
    confidence: record.confidence,
    notes: record.notes,
    sourceCount: record.sourceCount,
    matchedSources: normalizeReferences(record.matchedSources).map((reference) => ({
      sourceName: reference.name,
      sourceUrl: reference.url,
    })),
    rawArticle: {
      id: record.rawArticle.id,
      title: record.rawArticle.title,
      canonicalUrl: record.rawArticle.canonicalUrl,
      source: {
        id: record.rawArticle.source.id,
        name: record.rawArticle.source.name,
        url: record.rawArticle.source.url,
      },
      article: record.rawArticle.article
        ? {
            id: record.rawArticle.article.id,
            slug: record.rawArticle.article.slug,
            title: record.rawArticle.article.title,
            status: record.rawArticle.article.status,
          }
        : null,
    },
  };
}
