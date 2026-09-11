export const TELEGRAM_MAX_LENGTH = 900;

export type TelegramSourceRef = {
  name?: string | null;
  label?: string | null;
  title?: string | null;
  url: string;
};

export type FormatTelegramPostInput = {
  title: string;
  shortSummary: string;
  websiteUrl?: string | null;
  category?: string | null;
  tags?: string[] | null;
  sourceRefs?: TelegramSourceRef[] | null;
};

export function escapeTelegramHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeUrlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function splitSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [];
  }
  const matches = normalized.match(/[^.!?…]+[.!?…]+["'”’)]?|\S[^.!?…]*$/g);
  if (!matches) {
    return [normalized];
  }
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function toHashtag(raw: string): string | null {
  const cleaned = raw
    .trim()
    .replace(/^#+/, '')
    .replace(/[\s\-_]+/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
  if (!cleaned) {
    return null;
  }
  const tag = `#${cleaned.slice(0, 32)}`;
  return tag.length >= 2 ? tag : null;
}

function buildHashtags(category?: string | null, tags?: string[] | null): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const push = (raw: string | null | undefined) => {
    if (!raw || result.length >= 4) {
      return;
    }
    const tag = toHashtag(raw);
    if (!tag) {
      return;
    }
    const key = tag.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    result.push(tag);
  };

  push(category);
  for (const tag of tags ?? []) {
    push(tag);
    if (result.length >= 4) {
      break;
    }
  }

  if (result.length < 2) {
    push('Yangiliklar');
  }
  if (result.length < 2) {
    push('AI');
  }

  return result.slice(0, 4);
}

function truncateAtWordBoundary(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) {
    return trimmed;
  }
  if (maxChars <= 1) {
    return '…';
  }
  const slice = trimmed.slice(0, maxChars - 1).trimEnd();
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > maxChars * 0.4 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

export function formatTelegramPost(input: FormatTelegramPostInput): string {
  const title = input.title?.trim() || 'Untitled';
  const summary = input.shortSummary?.trim() || '';
  const websiteUrl = input.websiteUrl?.trim() || '';
  const sourceRefs = Array.isArray(input.sourceRefs) ? input.sourceRefs : [];

  const sentences = splitSentences(summary);
  const initialBodySentences = sentences.length === 0 ? [] : sentences.slice(0, 5);

  const seenUrls = new Set<string>();
  const validSources = sourceRefs
    .filter((ref) => ref && typeof ref.url === 'string' && ref.url.trim().length > 0)
    .filter((ref) => {
      const key = ref.url.trim().toLowerCase();
      if (seenUrls.has(key)) {
        return false;
      }
      seenUrls.add(key);
      return true;
    })
    .slice(0, 3);

  const hashtags = buildHashtags(input.category, input.tags);

  const buildPost = (bodySentences: string[]): string => {
    const parts: string[] = [];
    parts.push(`<b>${escapeTelegramHtml(title)}</b>`);

    if (bodySentences.length > 0) {
      parts.push(bodySentences.map((sentence) => escapeTelegramHtml(sentence)).join(' '));
    }

    if (validSources.length > 0) {
      const links = validSources.map((ref) => {
        const label = (ref.name ?? ref.label ?? ref.title ?? 'Manba').trim() || 'Manba';
        return `<a href="${escapeUrlAttr(ref.url.trim())}">${escapeTelegramHtml(label)}</a>`;
      });
      parts.push(`📰 Manbalar: ${links.join(', ')}`);
    }

    if (hashtags.length > 0) {
      parts.push(hashtags.join(' '));
    }

    if (websiteUrl) {
      const safeUrl = websiteUrl;
      parts.push(`🔗 <a href="${escapeUrlAttr(safeUrl)}">Batafsil o‘qish</a>`);
    }

    return parts.join('\n\n');
  };

  let bodySentences = initialBodySentences;
  let post = buildPost(bodySentences);

  if (post.length <= TELEGRAM_MAX_LENGTH) {
    return post;
  }

  // Graceful truncation: first reduce sentence count down to 3.
  while (bodySentences.length > 3) {
    bodySentences = bodySentences.slice(0, bodySentences.length - 1);
    post = buildPost(bodySentences);
    if (post.length <= TELEGRAM_MAX_LENGTH) {
      return post;
    }
  }

  // Still too long: truncate body text at a word boundary.
  const overheadPost = buildPost([]);
  const fixedOverhead = overheadPost.length;
  const separators = bodySentences.length > 0 ? 2 : 0;
  // Reserve room for ellipsis already handled in truncate helper.
  const availableForBody = TELEGRAM_MAX_LENGTH - fixedOverhead - separators;

  if (availableForBody <= 0) {
    // Extreme case: title/sources/hashtags/URL alone exceed the cap.
    // Truncate the whole post at a word boundary as a last resort.
    const plainTruncated = truncateAtWordBoundary(
      post.replace(/<[^>]*>/g, ''),
      TELEGRAM_MAX_LENGTH,
    );
    return escapeTelegramHtml(plainTruncated);
  }

  const fullBody = bodySentences.join(' ');
  const truncatedBody = truncateAtWordBoundary(fullBody, availableForBody);
  const truncatedSentences = splitSentences(truncatedBody).slice(0, 5);
  const finalBody = truncatedSentences.length > 0 ? truncatedSentences : [truncatedBody];
  post = buildPost(finalBody);

  if (post.length > TELEGRAM_MAX_LENGTH) {
    return truncateAtWordBoundary(post, TELEGRAM_MAX_LENGTH);
  }

  return post;
}
