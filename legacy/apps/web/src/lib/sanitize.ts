/**
 * HTML Sanitization Utility
 * 
 * Prevents XSS attacks by sanitizing HTML content before rendering.
 * Uses DOMPurify for robust sanitization.
 * 
 * @author Antigravity Team
 */

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Server-side DOMPurify setup
 * DOMPurify needs a window object, which doesn't exist on server
 */
function createDOMPurify() {
  if (typeof window !== 'undefined') {
    // Client-side - use browser's window
    return DOMPurify;
  }
  
  // Server-side - create virtual DOM
  const dom = new JSDOM('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return DOMPurify(dom.window as any);
}

const purify = createDOMPurify();

/**
 * Allowed HTML tags for article content
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's',
  'a', 'img',
  'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
];

/**
 * Allowed HTML attributes
 */
const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title',
  'class', 'id',
  'target', 'rel',
  'width', 'height',
];

/**
 * Sanitize HTML content for safe rendering
 * 
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML safe for dangerouslySetInnerHTML
 * 
 * @example
 * const safeContent = sanitizeHtml(article.content);
 * <div dangerouslySetInnerHTML={{ __html: safeContent }} />
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return purify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'], // Allow target for links
    ADD_TAGS: [], // No additional tags
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
  });
}

/**
 * Sanitize plain text (strip all HTML)
 * 
 * @param text - Text that may contain HTML
 * @returns Plain text with all HTML removed
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return purify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
