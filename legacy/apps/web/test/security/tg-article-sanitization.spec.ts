import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Telegram article sanitization', () => {
  it('keeps strict sanitize configuration for forbidden tags/attributes', () => {
    const sanitizeSource = readFileSync(
      join(process.cwd(), 'src', 'lib', 'sanitize.ts'),
      'utf8',
    );

    expect(sanitizeSource).toContain("FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input']");
    expect(sanitizeSource).toContain("FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover']");
  });

  it('keeps sanitizeHtml call in telegram article detail page', () => {
    const source = readFileSync(
      join(process.cwd(), 'src', 'app', '[locale]', 'tg', 'article', '[slug]', 'page.tsx'),
      'utf8',
    );

    expect(source).toContain('sanitizeHtml(article.content)');
  });
});
