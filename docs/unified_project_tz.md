# YAGONA TEXNIK TOPSHIRIQ (UNIFIED TZ)

## 1. Loyiha mohiyati va pozitsiyasi

Ushbu loyiha — IT va texnologiya sohasidagi yangiliklarni avtomatlashtirilgan tarzda yig‘ish, filtrlash, tahlil qilish va mahalliy auditoriya uchun **mazmunan tushuntirib beruvchi** raqamli media platforma.

Platforma tezkorlik yoki sensatsiya uchun emas, balki:
- tushunish
- kontekst
- ishonch

uchun quriladi.

Bu loyiha:
- oddiy news‑aggregator emas
- so‘zma‑so‘z tarjima qiluvchi kanal emas
- clickbait media emas

Asosiy savol har bir kontent uchun o‘zgarmas:
**“Bu yangilik nimasi bilan muhim va kim uchun?”**

---

## 2. Strategik maqsad

Loyihaning asosiy maqsadi — uzoq muddatli **ishonchli IT auditoriya** shakllantirish va vaqt o‘tib shu auditoriya orqali o‘z startap hamda mahsulotlarini **majburiy reklamasiz, axloqiy va tabiiy shaklda** tanishtirish.

Telegram — trafik va jalb qilish vositasi.
Web platforma — asosiy kontent va bilim markazi.

Auditoriya “ko‘rishlar” emas, **aktiv** sifatida qaraladi.

---

## 3. Platforma qatlamlari

Platforma 3 qatlamdan iborat bo‘ladi:

1. **Web platforma (asosiy)**
   - canonical maqolalar
   - SEO va arxiv
   - barcha tillar uchun asos

2. **Telegram Mini App**
   - yengil o‘qish interfeysi
   - audio va qisqa kontentga tez kirish

3. **Telegram kanal**
   - tarqatish
   - jalb qilish
   - web’ga yo‘naltirish

Qatlamlar bir‑birini takrorlamaydi, balki rollari aniq ajratilgan.

---

## 4. Foydalanuvchi rollari

### Reader (o‘quvchi)
- Telegram orqali kontentni ko‘radi
- zaruratda saytga kirib batafsil o‘qiydi
- platforma bilan interaktiv aloqaga kirmaydi

### Admin (loyiha egasi)
- manbalarni boshqaradi
- filtr va AI promptlarni sozlaydi
- postlarni tasdiqlaydi yoki bekor qiladi
- umumiy kontent yo‘nalishini nazorat qiladi

---

## 5. Asosiy pipeline (ishlash oqimi)

1. Cron ishga tushadi
2. News API orqali xom ma’lumot olinadi
3. Filtering layer:
   - manba sifati
   - takrorlanish
   - shovqin va clickbait
4. AI processing:
   - mazmuniy qayta bayon
   - tushuntirish
5. Canonical maqola web’da saqlanadi va indexlanadi
6. Qisqa Telegram‑friendly versiya yaratiladi
7. Telegram kanalga post qilinadi
8. Har doim saytga havola mavjud bo‘ladi

Telegram — oxirgi bosqich, web — markaz.

---

## 6. Funktsional talablar

### Majburiy (MVP)
- kamida 1–2 ishonchli News API
- avtomatik filtrlar
- AI orqali canonical maqola
- web’da birinchi bo‘lib nashr
- Telegram uchun qisqa versiya
- Telegram bot orqali avtomatik post
- public listing va arxiv

### Ixtiyoriy (V2)
- manual approve / reject
- kategoriya va mavzu bo‘yicha ajratish
- manba bo‘yicha filtrlash

### Qat’iyan kiritilmaydi (hozircha)
- comment tizimi
- real‑time analytics
- user profiling

---

## 7. Audio Digest (V2+)

Audio Digest — matnni almashtirmaydi, balki **qo‘shimcha iste’mol kanali**.

### Asosiy xususiyatlar
- kuniga 1 marta pre‑generated audio
- 2–4 daqiqa
- faqat muhim xulosalar
- neytral va ishonchli ovoz

### Qat’iyan taqiqlanadi
- dramatik ohang
- to‘liq maqolani o‘qib berish
- real‑time audio generatsiya

Agar audio sifati matndan past bo‘lsa — feature bekor qilinadi.

---

## 8. Ko‘p tilli kengayish (V2+)

Lokalizatsiya — tarjima emas, **interpretatsiya**.

### Arxitektura
- bitta domain
- til bo‘yicha path:
  - /uz
  - /ru
  - /kk va h.k.

### SEO qoidalar
- har bir til sahifasi o‘z canonical’iga ega
- hreflang majburiy
- avtomatik geo‑redirect taqiqlanadi

Har bir til:
- alohida auditoriya
- alohida AI prompt
- lokal kontekst

---

## 9. Nofunktsional talablar

### Performance
- soatiga 5–10 post barqaror qayta ishlanishi
- background job’lar user flow’ni bloklamaydi

### Security
- barcha secret’lar server‑side
- admin endpoint’lar yopiq

### Reliability
- bitta API ishdan chiqsa pipeline to‘xtamasligi
- idempotent publish

### Scalability
- yangi manba yoki til minimal refaktor bilan

### Maintainability
- cron, filtr, AI va publish modullar ajratilgan
- konfiguratsiya koddan ajratilgan

---

## 10. Texnik stack

- Frontend: Next.js (App Router)
- Backend: Next.js API Routes (MVP)
- Database: PostgreSQL
- Telegram: Bot API + Mini App
- AI: GPT oilasi (almashtiriladigan)

Keyinchalik yuklama oshsa backend alohida servisga ajratilishi mumkin.

---

## 11. Huquqiy va axloqiy tamoyillar

- original kontent nusxalanmaydi
- har doim source attribution
- faqat ruxsat etilgan API’lar
- clickbait va manipulyatsiya yo‘q
- AI xatolari uchun mas’uliyat loyiha egasida

Bu buzilsa:
- ishonch yo‘qoladi
- loyiha qiymati tushadi

---

## 12. Roadmap

### MVP (4–6 hafta)
- barqaror pipeline
- kuniga 3–5 post
- semantik xatolar yo‘q

### V2 (6–10 hafta)
- manbalarni ko‘paytirish
- manual moderation
- Audio Digest

### Qat’iyan tavsiya etilmaydi
- erta monetizatsiya
- reklama va sponsor postlar
- trafik uchun sifatdan voz kechish

---

## 13. Yakuniy prinsip

Bu loyiha:
- tez viral bo‘lish uchun emas
- uzoq muddatli ishonch uchun

Agar biror feature shu prinsipga zid bo‘lsa — u **kiritilmaydi**.

