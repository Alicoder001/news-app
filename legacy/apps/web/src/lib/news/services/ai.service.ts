import OpenAI from 'openai';
import { z } from 'zod';
import { 
  SYSTEM_PROMPT, 
  createArticlePrompt, 
  createMinimalPrompt,
  AI_CONFIG,
  type AIArticleResponse 
} from '../prompts';
import { trackAIUsage } from '@/lib/admin/usage-tracker';

/**
 * AI Service for Article Processing
 * 
 * Handles communication with OpenAI API for:
 * - Article translation and localization
 * - Summary generation
 * - Content structuring
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Structured JSON output validation
 * - Graceful error handling
 * - Fallback for missing API key (development mode)
 * 
 * @author Aishunos Team
 * @version 2.0.0
 */

/**
 * Zod schema for validating AI response
 */
const aiResponseSchema = z.object({
  title: z.string().min(10).max(200),
  summary: z.string().min(50).max(500),
  content: z.string().min(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string().min(2).max(50),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  importance: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  tags: z.array(z.string()).min(1).max(10),
});

/**
 * Legacy result interface for backward compatibility
 */
export interface AIResult {
  title: string;
  summary: string;
  content: string;
  slug: string;
  category: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  importance?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
}

/**
 * Custom error class for AI-related errors
 */
export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'API_KEY_MISSING' | 'API_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT',
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt: number): number {
  const delay = AI_CONFIG.RETRY.INITIAL_DELAY_MS * Math.pow(2, attempt);
  return Math.min(delay, AI_CONFIG.RETRY.MAX_DELAY_MS);
}

/**
 * AI Service Class
 * 
 * @example
 * const result = await AIService.processArticle("Apple announces new AI features", "...");
 * console.log(result.title); // O'zbekcha sarlavha
 */
export class AIService {
  private static client: OpenAI | null = null;

  /**
   * Initialize OpenAI client lazily
   */
  private static getClient(): OpenAI | null {
    if (this.client) return this.client;

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not found. AI features will use fallback mode.');
      return null;
    }

    this.client = new OpenAI({ apiKey });
    return this.client;
  }

  /**
   * Generate URL-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
      .replace(/\s+/g, '-')             // Spaces to hyphens
      .replace(/-+/g, '-')              // Multiple hyphens to single
      .replace(/(^-|-$)/g, '')          // Trim hyphens
      .slice(0, 80);                    // Limit length
  }

  /**
   * Fallback processing when API key is not available
   * Useful for development and testing
   */
  private static fallbackProcess(rawTitle: string, rawContent: string): AIResult {
    console.log('🔄 Using fallback AI processing (no API key)');
    
    const title = `[DEV] ${rawTitle}`;
    const summary = `Bu maqola quyidagilar haqida: ${rawTitle.slice(0, 100)}...`;
    const content = `
      <h3>Annotatsiya</h3>
      <p>${summary}</p>
      <h3>Asosiy mazmun</h3>
      <p>${rawContent?.slice(0, 500) || 'Kontent mavjud emas.'}</p>
      <h3>Bu nima uchun muhim?</h3>
      <p>Bu IT sohasi uchun muhim yangilik hisoblanadi.</p>
    `.trim();

    return {
      title,
      summary,
      content,
      slug: this.generateSlug(title),
      category: 'tech',
      difficulty: 'INTERMEDIATE',
      importance: 'MEDIUM',
      tags: ['texnologiya', 'yangiliklar'],
    };
  }

  /**
   * Call OpenAI API with retry logic
   */
  private static async callWithRetry(
    client: OpenAI,
    messages: OpenAI.ChatCompletionMessageParam[],
    attempt: number = 0
  ): Promise<string> {
    try {
      const response = await client.chat.completions.create({
        model: AI_CONFIG.MODEL,
        response_format: { type: 'json_object' },
        temperature: AI_CONFIG.TEMPERATURE.STRICT,
        max_tokens: AI_CONFIG.MAX_TOKENS.ARTICLE,
        messages,
      });

      const content = response.choices[0]?.message?.content;
      
      // Track usage if available
      if (response.usage) {
        trackAIUsage({
          model: AI_CONFIG.MODEL,
          operation: 'article_process',
          usage: {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          },
        }).catch(() => {}); // Fire and forget
      }
      
      if (!content) {
        throw new AIServiceError('Empty response from AI', 'API_ERROR');
      }

      return content;
    } catch (error) {
      // Check if it's a rate limit error
      if (error instanceof OpenAI.RateLimitError) {
        if (attempt < AI_CONFIG.RETRY.MAX_ATTEMPTS) {
          const delay = getBackoffDelay(attempt);
          console.log(`⏳ Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${AI_CONFIG.RETRY.MAX_ATTEMPTS})`);
          await sleep(delay);
          return this.callWithRetry(client, messages, attempt + 1);
        }
        throw new AIServiceError('Rate limit exceeded after retries', 'RATE_LIMIT', error);
      }

      // Check if it's a transient API error
      if (error instanceof OpenAI.APIError && attempt < AI_CONFIG.RETRY.MAX_ATTEMPTS) {
        const delay = getBackoffDelay(attempt);
        console.log(`🔄 API error. Retrying in ${delay}ms (attempt ${attempt + 1}/${AI_CONFIG.RETRY.MAX_ATTEMPTS})`);
        await sleep(delay);
        return this.callWithRetry(client, messages, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Parse and validate AI response
   */
  private static parseResponse(content: string): AIArticleResponse {
    let parsed: unknown;
    
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new AIServiceError(
        `Failed to parse AI response as JSON: ${content.slice(0, 100)}...`,
        'PARSE_ERROR',
        error
      );
    }

    const validated = aiResponseSchema.safeParse(parsed);
    
    if (!validated.success) {
      console.error('Validation errors:', validated.error.flatten());
      throw new AIServiceError(
        `AI response validation failed: ${validated.error.message}`,
        'VALIDATION_ERROR',
        validated.error
      );
    }

    return validated.data;
  }

  /**
   * Process an article through AI
   * 
   * @param rawTitle - Original article title
   * @param rawContent - Original article content
   * @param sourceUrl - Optional source URL for attribution
   * @returns Processed article data in O'zbek
   * 
   * @example
   * const result = await AIService.processArticle(
   *   "OpenAI releases GPT-5",
   *   "OpenAI announced today..."
   * );
   */
  static async processArticle(
    rawTitle: string,
    rawContent: string,
    sourceUrl?: string
  ): Promise<AIResult> {
    console.log(`🤖 Processing article: "${rawTitle.slice(0, 50)}..."`);

    const client = this.getClient();
    
    // Use fallback if no API key
    if (!client) {
      return this.fallbackProcess(rawTitle, rawContent);
    }

    try {
      // Determine which prompt to use
      const userPrompt = rawContent && rawContent.length > 50
        ? createArticlePrompt(rawTitle, rawContent, sourceUrl)
        : createMinimalPrompt(rawTitle);

      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ];

      // Call API with retry
      const responseContent = await this.callWithRetry(client, messages);

      // Parse and validate
      const parsed = this.parseResponse(responseContent);

      console.log(`✅ Successfully processed: "${parsed.title.slice(0, 50)}..."`);

      return {
        title: parsed.title,
        summary: parsed.summary,
        content: parsed.content,
        slug: parsed.slug || this.generateSlug(parsed.title),
        category: parsed.category || 'tech',
        difficulty: parsed.difficulty,
        importance: parsed.importance,
        tags: parsed.tags,
      };
    } catch (error) {
      if (error instanceof AIServiceError) {
        console.error(`❌ AI Service Error [${error.code}]: ${error.message}`);
      } else {
        console.error('❌ Unexpected error during AI processing:', error);
      }

      // Return fallback in case of error
      console.log('🔄 Falling back to basic processing');
      return this.fallbackProcess(rawTitle, rawContent);
    }
  }

  /**
   * Check if AI service is available
   */
  static isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  /**
   * Get current AI provider name
   */
  static getProviderName(): string {
    if (process.env.OPENAI_API_KEY) return 'OpenAI GPT-4o-mini';
    return 'Fallback (No API Key)';
  }
}
