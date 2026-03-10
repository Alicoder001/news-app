'use client';

/**
 * View Tracker Hook
 * 
 * Optimized client-side view tracking:
 * - Debounced to prevent duplicate calls
 * - Uses sessionStorage to track viewed articles
 * - Fires only once per session
 * 
 * @author Antigravity Team
 */

import { useEffect, useRef } from 'react';

const VIEWED_KEY = 'antigravity_viewed';
const DEBOUNCE_MS = 1000;

/**
 * Get viewed articles from session
 */
function getViewed(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const stored = sessionStorage.getItem(VIEWED_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

/**
 * Mark article as viewed in session
 */
function markViewed(slug: string): void {
  const viewed = getViewed();
  viewed.add(slug);
  sessionStorage.setItem(VIEWED_KEY, JSON.stringify([...viewed]));
}

/**
 * Check if article was already viewed this session
 */
function wasViewed(slug: string): boolean {
  return getViewed().has(slug);
}

/**
 * Send view to API
 */
async function sendView(slug: string): Promise<void> {
  try {
    await fetch('/api/articles/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
  } catch {
    // Silently fail - view count is not critical
  }
}

/**
 * Hook to track article view
 * 
 * @example
 * function ArticlePage({ slug }: { slug: string }) {
 *   useViewTracker(slug);
 *   return <div>...</div>;
 * }
 */
export function useViewTracker(slug: string): void {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount
    if (tracked.current) return;
    
    // Only track if not already viewed this session
    if (wasViewed(slug)) return;

    // Debounce the view
    const timer = setTimeout(() => {
      tracked.current = true;
      markViewed(slug);
      sendView(slug);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [slug]);
}

/**
 * Track multiple articles (for list pages)
 * Uses batch API for efficiency
 */
export async function trackBatchViews(slugs: string[]): Promise<void> {
  const viewed = getViewed();
  const newSlugs = slugs.filter(slug => !viewed.has(slug));
  
  if (newSlugs.length === 0) return;

  try {
    await fetch('/api/articles/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: newSlugs }),
    });
    
    // Mark all as viewed
    newSlugs.forEach(markViewed);
  } catch {
    // Silently fail
  }
}
