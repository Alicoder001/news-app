export class FilteringService {
  private static noiseKeywords = [
    'deal', 'price', 'discount', 'buy', 'offer', 'sale', 'cheap', 
    'vouchers', 'gift', 'coupon', 'giveaway'
  ];

  static shouldProcess(article: { title: string; description: string | null }): boolean {
    const content = `${article.title} ${article.description || ''}`.toLowerCase();

    // 1. Shovqinli kalit so'zlarni tekshirish (Clickbait/Reklama)
    const hasNoise = this.noiseKeywords.some(keyword => content.includes(keyword));
    if (hasNoise) return false;

    // 2. Minimal uzunlikni tekshirish (Juda qisqa postlarni o'tkazmaslik)
    if (article.title.length < 20) return false;

    // 3. Tilni tekshirish (Hozircha faqat Inglizchadan tarjima qilayotgan bo'lsak)
    // Bu yerda murakkabroq mantiq qo'shish mumkin
    
    return true;
  }
}
