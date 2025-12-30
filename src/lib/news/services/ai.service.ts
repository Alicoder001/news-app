export interface AIResult {
  title: string;
  summary: string;
  content: string;
  slug: string;
}

export class AIService {
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  static async processArticle(rawTitle: string, rawContent: string): Promise<AIResult> {
    // In a real implementation, this would call OpenAI/Gemini
    // For MVP, we'll simulate the AI processing structure
    
    const title = `[AI] ${rawTitle}`;
    const summary = `Bu maqola quyidagilar haqida: ${rawTitle}. Bu IT sohasi uchun juda muhim.`;
    const content = `<h3>Annotatsiya</h3><p>${summary}</p><br/>${rawContent}`;
    
    return {
      title,
      summary,
      content,
      slug: this.generateSlug(title)
    };
  }
}
