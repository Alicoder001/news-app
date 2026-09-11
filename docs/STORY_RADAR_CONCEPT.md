# Story Radar konsepsiyasi (6-faza, kelajak)

## Maqsad

Donalab yangilik emas, **voqeani** kuzatish. Bir nechta maqola bitta `Story`ga birlashadi,
kanal esa “birinchi xabar beruvchi”ga aylanadi.

## Holatlar

- `KUTILMOQDA` — oldindan ma’lum tadbir (taqdimot, saylov, hisobot, konferensiya).
  AI tadbir kalendarini yuritadi. Tadbirdan 2 soat oldin polling tezlashadi,
  fon-maqola (kontekst) oldindan yozib qo‘yiladi.
- `FAOL` — portlash aniqlandi: 30 daqiqalik oynada bir xil kalit so‘zlar
  kamida 3 mustaqil manbada sakrasa, mavzu navbat boshiga o‘tadi.
  Tekshiruv bu holatda qattiqroq: faqat rasmiy manba tasdiqlaydi.
- `YAKUNLANDI` — rasmiy tasdiq chiqqach avtomatik yakuniy xulosa post qilinadi,
  story yopiladi.

## Nashr qoidasi

Bir voqeaning N-yangiligi N ta alohida post emas. Telegram’da bitta post
tahrirlash/yangilash zanjiri bo‘ladi. Spam yo‘q.

## Signallar (manbalar)

1. Tadbir kalendari (qo‘lda + AI to‘ldiradi)
2. Kalit so‘z tezligi (ingest oynalaridagi token velocity)
3. Qidiruv trendi va bashorat bozorlari (tashqi signal, ixtiyoriy)
4. Rasmiy manba tasdig‘i (majburiy, FAOL uchun)

## Xavfsizlik chegarasi

FAOL ga o‘tish uchun: kamida 3 mustaqil manba + ishonch bali.
Shov-shuvni voqea deb adashtirish — kanalni mish-mish tarqatgichga aylantiradi.

## Ma’lumot modeli (reja)

- `Story`: id, sarlavha, status (KUTILMOQDA/FAOL/YAKUNLANDI), boshlanish/kutilayotgan vaqt
- `RawArticle.storyId?`, `Article.storyId?` — ixtiyoriy bog‘lanish
- `StoryEvent`: status o‘tishlari logi (PipelineEvent kabi)

## Bosqichlar

1. Faqat `KUTILMOQDA`: tadbir kalendari + countdown + oldindan fon-maqola
2. Burst-detektor: token velocity + FAOL o‘tish
3. Thread-yangilash: Telegram post tahrirlash zanjiri + YAKUNLANDI xulosasi

## MVP bilan bog‘liqlik

MVP oqimi o‘zgarmaydi. Story Radar alohida qatlam: ingest’ga `storyId`
tavsiyasi qo‘shadi, publish tartibini (web first, telegram second) saqlaydi.
Diqqat: FAOL dagi qat’iy verifikatsiya 2-3 source qoidasini kuchaytiradi,
yumshatmaydi.
