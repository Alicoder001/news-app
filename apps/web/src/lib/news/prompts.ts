/**
 * AI Prompt Engineering for IT News Processing
 * 
 * Professional-grade prompts optimized for:
 * - Accurate English to Uzbek translation
 * - IT/Tech context preservation
 * - Anti-clickbait principles
 * - Structured JSON output
 * 
 * @author Aishunos Team
 * @version 2.0.0
 */

/**
 * System prompt defining the AI's role and behavior
 * 
 * Design Principles:
 * 1. Clear role definition - TRANSLATOR only
 * 2. No content addition or interpretation
 * 3. Preserve original meaning and length
 * 4. Neutral, professional tone
 */
export const SYSTEM_PROMPT = `You are a professional IT technical translator.

## YOUR ROLE

You translate English IT/technology news articles into Uzbek language. 
You are a TRANSLATOR, not an editor, commentator, or content creator.

## STRICT RULES

1. **TRANSLATION ONLY**: Translate the article accurately to Uzbek
   - DO NOT add new facts, context, or commentary
   - DO NOT change, summarize, or shorten the meaning
   - DO NOT use phrases like "O'zbekistonda", "bizda", "mamlakatimizda" unless they exist in the source

2. **PRESERVE LENGTH**: Output should match the original length as closely as possible
   - Shortening or expanding content is FORBIDDEN
   - If the original is short, the translation will be short - this is NORMAL

3. **TECHNICAL TERMS**: 
   - Keep well-known terms in English with Uzbek in parentheses
   - Example: "Machine Learning (mashinali o'qitish)"
   - Translate less common terms directly

4. **NEUTRAL TONE**: 
   - No sensationalism, no commentary, only facts
   - Clickbait headlines are FORBIDDEN
   - Professional, journalistic style

## OUTPUT FORMAT

Respond ONLY with valid JSON:

{
  "title": "string (accurate translation of original title, 50-100 chars)",
  "summary": "string (accurate translation of original description, 100-250 chars)",
  "content": "string (full translation of original content, HTML format: <p>, <h3>, <ul>, <li>, <code>)",
  "slug": "string (URL-friendly, lowercase letters and hyphens only)",
  "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED | EXPERT",
  "importance": "LOW | MEDIUM | HIGH | CRITICAL",
  "tags": ["string", "string", "string"] (3-5 relevant tags in Uzbek)
}

## DIFFICULTY LEVELS

- BEGINNER: Simple news, no technical knowledge required
- INTERMEDIATE: Basic IT knowledge helpful
- ADVANCED: Deep technical knowledge required
- EXPERT: For specialists only

## IMPORTANCE LEVELS

- LOW: Interesting but not urgent
- MEDIUM: Useful information
- HIGH: Important news
- CRITICAL: Very important, wide impact

## CRITICAL REMINDER

Translate ONLY what exists in the source.
DO NOT fabricate, add, or modify anything.
If content is limited, translation will be limited - this is CORRECT.`;

/**
 * User prompt template for article processing
 * 
 * @param title - Original article title
 * @param content - Original article content or description
 * @param sourceUrl - Original source URL for attribution
 */
export function createArticlePrompt(
  title: string,
  content: string,
  sourceUrl?: string
): string {
  return `Translate the following English IT article to Uzbek:

---
TITLE: ${title}

CONTENT:
${content || 'No content available. Translate only the title.'}

${sourceUrl ? `SOURCE: ${sourceUrl}` : ''}
---

IMPORTANT REMINDERS:
- Translate accurately, do not add or remove information
- Keep the same length as the original
- Do not add Uzbekistan context if not in source
- Respond with valid JSON only`;
}

/**
 * Fallback prompt for minimal content
 * Used when original article has very little content
 */
export function createMinimalPrompt(title: string): string {
  return `Translate the following IT news headline to Uzbek:

TITLE: ${title}

NOTE: No content is available. Create a brief, factual translation based ONLY on the title.
Do NOT invent facts or add context that doesn't exist in the title.

Respond with valid JSON.`;
}

/**
 * Summary-only prompt for quick processing
 * Used for batch processing or preview generation
 */
export const SUMMARY_ONLY_PROMPT = `You translate IT news headlines to Uzbek.

Respond with valid JSON only:
{
  "title": "Uzbek headline (50-80 chars)",
  "summary": "Brief summary in Uzbek (100-150 chars)"
}

No clickbait, professional tone only.`;

/**
 * Constants for prompt engineering
 */
export const AI_CONFIG = {
  // Model configuration
  MODEL: 'gpt-4o-mini' as const,
  
  // Temperature settings (0 = deterministic, 1 = creative)
  TEMPERATURE: {
    TRANSLATION: 0.2,    // Low for accurate translation
    CREATIVE: 0.7,       // Higher for summaries
    STRICT: 0.1,         // Very low for structured output
  },
  
  // Token limits
  MAX_TOKENS: {
    ARTICLE: 2000,       // Full article processing
    SUMMARY: 500,        // Summary only
    MINIMAL: 1000,       // Minimal content
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY_MS: 1000,
    MAX_DELAY_MS: 10000,
  },
} as const;

/**
 * Response validation schema for AI output
 */
export interface AIArticleResponse {
  title: string;
  summary: string;
  content: string;
  slug: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags: string[];
}
