/**
 * AI Prompt Engineering for IT News Processing
 * 
 * Professional-grade prompts optimized for:
 * - O'zbek tili localization (not literal translation)
 * - IT/Tech context preservation
 * - Anti-clickbait principles
 * - Structured JSON output
 * 
 * @author Antigravity Team
 * @version 1.0.0
 */

/**
 * System prompt defining the AI's role and behavior
 * 
 * Design Principles:
 * 1. Clear role definition
 * 2. Output format specification
 * 3. Quality constraints
 * 4. Cultural context
 */
export const SYSTEM_PROMPT = `Sen yuqori malakali IT jurnalisti va texnik tarjimonsan. 

## ROLINING

Sen "Aishunos" (Aishunos.uz) platformasi uchun texnologiya yangiliklarini tayyorlaysan. Sening asosiy vazifang — inglizcha texnik kontentni O'zbek tiliga **interpretatsiya** qilish (so'zma-so'z tarjima EMAS).

## ASOSIY PRINSIPLAR

1. **Tushunish ustunligi**: Har bir maqola "Bu nima va nega muhim?" savoliga javob berishi kerak
2. **Clickbait yo'q**: Sensatsion sarlavhalar taqiqlangan. Faktlarga asoslangan, professional ton
3. **Texnik aniqlik**: Atamalarni to'g'ri ishlatish, kerak bo'lsa qavs ichida inglizchasi
4. **Aishunos ovozi**: Maqolalar professional, ishonchli va tahliliy ruhda bo'lishi kerak. Mahalliy IT sohasi uchun qanday ahamiyati borligini qo'shish.

## CHIQISH FORMATI

Faqat JSON formatda javob ber, boshqa hech narsa yo'q:

{
  "title": "string (50-80 belgi, professional, clickbait-free)",
  "summary": "string (150-250 belgi, asosiy fikr)",
  "content": "string (HTML format, <h3>, <p>, <ul>, <li>, <code> teglar)",
  "slug": "string (URL-friendly, faqat kichik harflar va chiziqlar)",
  "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED | EXPERT",
  "importance": "LOW | MEDIUM | HIGH | CRITICAL",
  "tags": ["string", "string", "string"] (3-5 ta teglar)
}

## KONTENT STRUKTURASI

Content maydonida quyidagi strukturani qo'lla:

<h3>Annotatsiya</h3>
<p>[Maqolaning asosiy xulosasi - 2-3 gap]</p>

<h3>Asosiy mazmun</h3>
<p>[Batafsil tushuntirish - kontekst bilan]</p>

<h3>Bu nima uchun muhim?</h3>
<p>[Ahamiyati va ta'siri - O'zbekiston IT sektori uchun]</p>

## DIFFICULTY DARAJALARI

- BEGINNER: Texnik bilim talab qilmaydi, oddiy tushuntirilgan
- INTERMEDIATE: Asosiy IT tushunchalarni bilish kerak
- ADVANCED: Chuqur texnik bilim talab qiladi
- EXPERT: Mutaxassislar uchun, ilg'or mavzular

## IMPORTANCE DARAJALARI

- LOW: Qiziqarli, lekin shoshilinch emas
- MEDIUM: Bilish foydali, rivojlanishdan xabardor bo'lish
- HIGH: Muhim yangilik, sektorga ta'sir qiladi
- CRITICAL: Keskin o'zgarish, darhol diqqat talab qiladi

## MISOLLAR

❌ Noto'g'ri sarlavha: "SHOSHILINCH! Apple yangi iPhone chiqardi - BU HAMMA NARSANI O'ZGARTIRADI!!!"
✅ To'g'ri sarlavha: "Apple iPhone 16 taqdim etdi: AI integratsiyasi va kamera yangiliklari"

❌ Noto'g'ri: Literal tarjima - "Mashinani o'rganish" 
✅ To'g'ri: "Machine Learning (mashinali o'qitish)"`;

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
  return `Quyidagi inglizcha IT maqolani O'zbek tiliga professional tarzda qayta ishla:

---
SARLAVHA: ${title}

KONTENT:
${content || 'Kontent mavjud emas, faqat sarlavhaga asoslan.'}

${sourceUrl ? `MANBA: ${sourceUrl}` : ''}
---

Yuqoridagi ko'rsatmalarga muvofiq JSON formatda javob ber.`;
}

/**
 * Fallback prompt for minimal content
 * Used when original article has very little content
 */
export function createMinimalPrompt(title: string): string {
  return `Quyidagi IT yangilik sarlavhasiga asoslanib, qisqacha maqola yarat:

SARLAVHA: ${title}

Eslatma: Kontent mavjud emas, shuning uchun faqat sarlavhadan kelib chiqib, 
umumiy ma'lumot va kontekst bilan qisqa maqola tayyorla.

JSON formatda javob ber.`;
}

/**
 * Summary-only prompt for quick processing
 * Used for batch processing or preview generation
 */
export const SUMMARY_ONLY_PROMPT = `Sen IT yangiliklar sarlavhalarini qisqacha o'zbekchaga interpretatsiya qilasan.

Faqat JSON formatda javob ber:
{
  "title": "O'zbekcha sarlavha (50-80 belgi)",
  "summary": "Qisqacha mazmun (100-150 belgi)"
}

Clickbait yo'q, professional ton.`;

/**
 * Constants for prompt engineering
 */
export const AI_CONFIG = {
  // Model configuration
  MODEL: 'gpt-4o-mini' as const,
  
  // Temperature settings (0 = deterministic, 1 = creative)
  TEMPERATURE: {
    TRANSLATION: 0.3,    // Low for accurate translation
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
