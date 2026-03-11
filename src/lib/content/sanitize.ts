const BLOCKED_TAGS = /<\/?(script|style|iframe|object|embed)[^>]*>/gi;
const EVENT_HANDLERS = /\son[a-z]+\s*=\s*(['"]).*?\1/gi;
const JAVASCRIPT_URLS = /javascript:/gi;

export function sanitizeHtml(html: string) {
  return html
    .replace(BLOCKED_TAGS, '')
    .replace(EVENT_HANDLERS, '')
    .replace(JAVASCRIPT_URLS, '')
    .trim();
}
