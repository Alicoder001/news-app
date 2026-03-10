# ai_shunos Prompt Engineering Pipeline

## Maqsad

Bu hujjat MVP uchun 3 agentli prompt engineering pipeline'ni aniq belgilaydi.

Fokus:

- har agentning roli
- aniq input/output kontrakti
- guardrail'lar
- noto'g'ri generatsiyani kamaytirish
- publish oldi sifat nazorati

Asosiy tamoyil:

`promptlar kreativ emas, boshqariladigan va tekshiriladigan bo'lishi kerak`

## Pipeline Oqimi

```text
RSS item
-> Agent 1: Collector
-> Agent 2: Analyzer/Writer
-> Agent 3: Reviewer
-> Web publish
-> Telegram publish
```

## Prompt Engineering Qoidalari

Har bir agent prompti quyidagi 5 qismdan iborat bo'lishi kerak:

1. `Role`
2. `Task`
3. `Input contract`
4. `Output contract`
5. `Rules and failure conditions`

## Global Qoidalar

Barcha agentlar uchun umumiy qoidalar:

- faqat berilgan input bilan ishlash
- fakt to'qimaslik
- noaniq joyni aniq belgilash
- JSON formatni buzmaslik
- keraksiz izoh yozmaslik
- source reference'larni yo'qotmaslik

## JSON First Yondashuvi

Har agent natijani `strict JSON` ko'rinishida qaytaradi.

Sababi:

- pipeline'da parse qilish oson bo'ladi
- retry qilish oson bo'ladi
- agentlar orasida kontrakt aniq bo'ladi

## Agent 1: Collector

### Roli

RSS'dan kelgan itemni tozalovchi va normalizatsiya qiluvchi agent.

### Vazifasi

- raw RSS itemni tushunarli struktura qilish
- shovqinli yoki keraksiz qismlarni kamaytirish
- asosiy metadata'ni ajratish
- verification uchun mos summary tayyorlash

### Input contract

```json
{
  "source": {
    "name": "string",
    "url": "string",
    "type": "rss"
  },
  "rss_item": {
    "title": "string",
    "summary": "string",
    "content": "string",
    "url": "string",
    "published_at": "string"
  }
}
```

### Output contract

```json
{
  "status": "ok|skip",
  "skip_reason": "string|null",
  "normalized_article": {
    "title": "string",
    "summary": "string",
    "content": "string",
    "canonical_url": "string",
    "published_at": "string|null",
    "source_name": "string",
    "source_url": "string",
    "keywords": ["string"]
  }
}
```

### Collector qoidalari

- title bo'sh bo'lmasin
- canonical URL saqlansin
- summary juda iflos bo'lsa tozalansin
- HTML noise olib tashlansin
- agar kontent juda kam bo'lsa `skip` qilish mumkin

## Agent 2: Analyzer / Writer

### Roli

Maqolaning mosligini baholaydi, verification natijalarini hisobga oladi va final kontent tayyorlaydi.

### Vazifasi

- maqola AI/IT/tech mavzusiga mosligini tekshirish
- 2-3 source verification natijasini hisobga olish
- Uzbekcha short post yozish
- Uzbekcha full article yozish
- category, tags, slug yaratish

### Input contract

```json
{
  "normalized_article": {
    "title": "string",
    "summary": "string",
    "content": "string",
    "canonical_url": "string",
    "published_at": "string|null",
    "source_name": "string",
    "source_url": "string",
    "keywords": ["string"]
  },
  "verification": {
    "status": "verified|partial|insufficient",
    "confirmed_sources": [
      {
        "name": "string",
        "url": "string",
        "type": "official|media"
      }
    ],
    "notes": "string"
  }
}
```

### Output contract

```json
{
  "status": "ok|skip|hold",
  "decision_reason": "string|null",
  "article": {
    "title": "string",
    "slug": "string",
    "category": "string",
    "tags": ["string"],
    "short_post": "string",
    "full_article": "string",
    "short_summary": "string",
    "confidence": 0.0,
    "sources": [
      {
        "name": "string",
        "url": "string"
      }
    ]
  }
}
```

### Analyzer / Writer qoidalari

- verification `insufficient` bo'lsa `hold` yoki `skip`
- clickbait sarlavha yozmasin
- source'da yo'q faktni qo'shmasin
- short post lo'nda bo'lsin
- full article web uchun o'qiladigan bo'lsin
- short post Telegram uchun web link bilan yakunlanishga mos bo'lsin

## Agent 3: Reviewer

### Roli

Final kontentni publish oldidan tekshiruvchi agent.

### Vazifasi

- short post va full article'ni tekshirish
- source reference mavjudligini tekshirish
- verification status bilan mosligini tekshirish
- noto'g'ri yoki oshirib yuborilgan gaplarni topish
- final qaror berish

### Input contract

```json
{
  "normalized_article": {
    "title": "string",
    "summary": "string",
    "content": "string",
    "canonical_url": "string"
  },
  "verification": {
    "status": "verified|partial|insufficient",
    "confirmed_sources": [
      {
        "name": "string",
        "url": "string"
      }
    ]
  },
  "draft_article": {
    "title": "string",
    "slug": "string",
    "category": "string",
    "tags": ["string"],
    "short_post": "string",
    "full_article": "string",
    "sources": [
      {
        "name": "string",
        "url": "string"
      }
    ]
  }
}
```

### Output contract

```json
{
  "decision": "APPROVE|REJECT|HOLD",
  "reason": "string",
  "issues": ["string"],
  "publish_ready": true
}
```

### Reviewer qoidalari

- verification yetarli bo'lmasa approve bermasin
- source list bo'lmasa approve bermasin
- short post va full article bir-biriga zid bo'lmasin
- original voqeani noto'g'ri interpretatsiya qilmasin
- publish format buzilgan bo'lsa reject qilsin

## Prompt Design Patterns

### 1. Negative constraints

Har promptda aniq taqiqlar yoziladi:

- do not invent facts
- do not output markdown unless requested
- do not include explanation outside JSON

### 2. Schema anchoring

Har agent output schema bilan bog'lanadi.

Bu quyidagilarni kamaytiradi:

- noto'g'ri format
- extra text
- parsing xatolari

### 3. Decision gates

Har agent mustaqil publish qilmaydi.

- Collector faqat normalize qiladi
- Writer faqat draft tayyorlaydi
- Reviewer final qaror beradi

### 4. Fail-safe output

Agar agent ishonchsiz bo'lsa, u:

- `skip`
- `hold`
- `reject`

qaytarishi kerak.

Noaniq holatda agressiv publish qilish taqiqlanadi.

## Prompt Versioning

Har prompt versiyalanadi.

Masalan:

- `collector.v1.txt`
- `writer.v1.txt`
- `reviewer.v1.txt`

Keyin:

- `collector.v2.txt`
- `writer.v2.txt`
- `reviewer.v2.txt`

## Tavsiya Etilgan Papka Tuzilishi

```text
prompts/
  collector/
    system.v1.txt
    task.v1.txt
  writer/
    system.v1.txt
    task.v1.txt
  reviewer/
    system.v1.txt
    task.v1.txt
```

## Retry Strategiyasi

### Retry holatlari

- invalid JSON
- required field yetishmasa
- empty output
- impossible decision state

### Retry soni

- 1-marta: original prompt
- 2-marta: stricter formatting reminder
- 3-marta: fail va hold

## MVP uchun Success Criteria

Prompt engineering pipeline yaxshi qurilgan deb hisoblanadi, agar:

- 3 agentning input/output kontrakti aniq bo'lsa
- JSON parse xatolari kam bo'lsa
- agentlar rol aralashmasdan ishlasa
- verification yetarli bo'lmaganda hold/reject qaytsa
- web first, telegram second publish oqimiga mos natija bersa

## Keyingi Qadam

1. 3 agent uchun `system` prompt yozish
2. 3 agent uchun `task` prompt yozish
3. JSON schema'larni kodga ko'chirish
4. retry policy yozish
5. 3-5 sample article bilan sinash
