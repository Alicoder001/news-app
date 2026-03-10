# ai_shunos MVP Requirements

## Maqsad

MVP versiya uchun tizim quyidagicha ishlashi kerak:

1. Yangiliklar `RSS` orqali olinadi
2. Pipeline `har 30 minutda` ishga tushadi
3. RSS'dan kelgan item kamida `2-3 ta ishonchli manba` bilan tekshiriladi
4. So'ng `3 ta agent` ketma-ket ishlaydi
5. Avval batafsil kontent `web site` ga yoziladi
6. Keyin qisqa post `Telegram bot` va `kanal`ga yuboriladi
7. `Telegram Mini App` batafsil kontentni web yoki umumiy bazadan oladi

Bu hujjat MVP uchun aniq ishchi talablarni belgilaydi.

## MVP Oqimi

To'liq oqim:

```text
RSS -> Yig'uvchi agent -> Tahlil qiluvchi / post tayyorlovchi agent ->
Tekshiruvchi agent -> Web site -> Telegram bot va kanal ->
Telegram Mini App
```

## 1. Ma'lumot Manbai

MVP'da ma'lumot faqat `RSS` orqali olinadi.

### Asosiy RSS manbalar

Kamida quyidagi ishonchli manbalardan boshlanadi:

- OpenAI Blog
- Anthropic News
- Google DeepMind yoki Google AI Blog
- NVIDIA Blog
- TechCrunch AI
- The Verge AI

### Talablar

- source list database yoki config'da saqlanadi
- har bir source `active/inactive` holatga ega bo'ladi
- duplicate URL qayta saqlanmaydi
- fetch vaqti log qilinadi

## 2. Ishga Tushish Rejimi

Pipeline `har 30 minutda` bir marta ishlaydi.

### Schedule

- `*/30 * * * *`

### Har run'dagi bosqichlar

1. RSS'dan yangi itemlarni olish
2. yangi itemlarni `raw_articles` ga saqlash
3. tekshiruv uchun mos itemlarni agentlarga yuborish
4. tasdiqlangan full article'ni web site'ga yozish
5. web URL olingandan keyin Telegram post yuborish

### Muhim cheklovlar

- bir xil item ikkinchi marta ishlanmasligi kerak
- pipeline parallel run bo'lib ketmasligi kerak
- bitta run yiqilsa keyingisiga xalaqit bermasligi kerak

## 3. Ishonchlilik Tekshiruvi

RSS orqali kelgan yangilik publish bo'lishidan oldin kamida `2-3 ta ishonchli manba` bilan tekshirilishi kerak.

## Tekshirish logikasi

Har bir item uchun:

- original source olinadi
- shu voqeaga oid kamida `yana 1 yoki 2` qo'shimcha ishonchli source topiladi
- jami `kamida 2`, ideal holatda `3` source bo'lishi kerak

## Ishonchli source mezoni

Ishonchli deb quyidagilar olinadi:

- rasmiy kompaniya bloglari
- rasmiy product yoki research announcement sahifalari
- yirik texnologik nashrlar
- obro'li AI yoki tech media

### Priority

1. rasmiy source
2. yirik media confirmation
3. ikkinchi mustaqil media confirmation

## Minimal qaror qoidasi

- `3 ta source` bo'lsa: yuqori ishonch
- `2 ta source` bo'lsa: publish mumkin
- `1 ta source` bo'lsa: hold yoki manual review

## 4. Uchta Agent

MVP uchun agentlar soni `3 ta`.

## Agent 1: Yig'uvchi

Vazifasi:

- RSS orqali kelgan itemlarni yig'ish
- xom ma'lumotni tozalash
- duplicate'larni chiqarib tashlash
- asosiy metadata'ni tayyorlash
- keyingi agentga uzatish

### Input

- RSS item
- source metadata

### Output

- normalized raw article
- source list
- published date
- title
- summary
- url

## Agent 2: Tahlil qiluvchi va Post Tayyorlovchi

Vazifasi:

- maqolaning AI/IT/tech ga aloqadorligini aniqlash
- ishonchlilik tekshiruvi natijasini hisobga olish
- Uzbekcha qisqa post tayyorlash
- Uzbekcha batafsil article tayyorlash
- category, tags, slug yaratish

### Output

- short post
- full article
- category
- tags
- confidence
- source references

### Qoidalar

- clickbait yo'q
- faqat mavjud faktlar
- texnik atamalar o'rinli joyda inglizcha qoladi
- short post lo'nda bo'ladi
- full article batafsilroq bo'ladi

## Agent 3: Tekshiruvchi

Vazifasi:

- short post va full article'ni qayta tekshirish
- source reference'lar borligini tekshirish
- format to'g'riligini tekshirish
- noto'g'ri yoki tasdiqlanmagan gaplarni ushlash
- final approval berish

### Qarorlar

- `APPROVE`
- `REJECT`
- `HOLD`

### Reject sabablari

- source yetarli emas
- faktlar mos emas
- post noto'g'ri taassurot beryapti
- format noto'g'ri

## 5. Kontent Tarqatish

MVP'da kontent ikki xil ko'rinishda tarqatiladi.

## 5.1 Telegram Bot va Kanal

Bu yerga `short post` yuboriladi.

### Short post tarkibi

- sarlavha yoki asosiy gap
- 3-5 gaplik qisqa mazmun
- source ko'rsatish
- hashtaglar
- web site link

### Yuborish yo'nalishlari

- Telegram kanal
- kerak bo'lsa admin bot chat

## 5.2 Telegram Mini App

Bu yerga `full article` chiqadi.

### Mini App'da bo'ladi

- title
- summary
- to'liq article
- source list
- category
- tags
- publish date

## 5.3 Web Site

Bu yerga ham `full article` chiqadi.

### Website'da bo'ladi

- home page'da list
- article detail page
- category page
- source reference block

## 6. Database Talablari

MVP uchun kamida quyidagi entity'lar bo'lishi kerak:

- `sources`
- `raw_articles`
- `verification_records`
- `articles`
- `deliveries`
- `pipeline_runs`

## Minimal ma'no

### `sources`

- RSS manbalari

### `raw_articles`

- RSS'dan kelgan xom itemlar

### `verification_records`

- qaysi item qaysi 2-3 source bilan tekshirilgani

### `articles`

- tayyor full article va short post

### `deliveries`

- Telegram, Mini App, Web'ga yuborilgan statuslar

### `pipeline_runs`

- har 30 minutlik run logi

## 7. Minimal Admin Talablari

MVP uchun minimal admin funksiyalar:

- source list ko'rish
- pipeline run ko'rish
- manual trigger
- raw article list
- approved article list
- failed yoki hold item list

## 8. Minimal Texnik Talablar

- env validation
- duplicate protection
- retry policy
- log yozish
- parse error handling
- Telegram send error handling
- source verification natijasini saqlash

## 9. MVP Success Criteria

MVP tayyor deb hisoblash uchun quyidagilar ishlashi kerak:

- RSS source'dan data keladi
- pipeline har 30 minutda ishlaydi
- har bir publish item kamida 2 ta source bilan tasdiqlanadi
- 3 ta agent ketma-ket ishlaydi
- short post Telegram kanalga ketadi
- full article Mini App'da chiqadi
- full article website'da chiqadi
- xatolar log qilinadi
- duplicate post bo'lmaydi

## 10. MVPdan Keyingi Ishlar

MVP'dan keyin qo'shiladigan asosiy yo'nalishlar:

- stronger fact-check
- reviewer intelligence'ni oshirish
- queue worker
- analytics
- richer admin panel
- multi-language
- Twitter/X yoki boshqa source'lar
- multi-agent'ni chuqurlashtirish

## Yakuniy Qaror

MVP arxitekturasi murakkab emas, lekin aniq bo'ladi:

- `RSS only`
- `30 minut cron`
- `2-3 source verification`
- `3 agent`
- `short post -> Telegram`
- `full article -> Mini App + Web`

Shu scope MVP uchun yetarli va real ishlaydigan birinchi versiyani beradi.
