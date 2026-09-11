require('dotenv').config({ quiet: true });
const { PrismaClient } = require('@prisma/client');

async function main() {
  const p = new PrismaClient();
  const a = await p.article.findFirst({
    where: { status: 'APPROVED', telegramPublished: false },
    orderBy: { createdAt: 'asc' },
  });
  if (!a) {
    console.log('NO_PENDING');
    await p.$disconnect();
    return;
  }
  const title = 'Meta’ning Muse AI yordamchisi ishlamoqda — lekin biroz qo‘rqinchli';
  const body = 'Meta yangi Muse AI yordamchisini chiqardi — kompaniyaning unumdorlik vositalaridagi ilk jiddiy qadami. Yordamchi xarid, xatlar va safar rejalashdagi mayda ishlarni o‘z zimmasiga oladi. Sinovda u kutilgandek ishladi, lekin foydalanuvchi haqida mustaqil ravishda to‘plagan hayratlanarli darajada ko‘p ma’lumot taassurotni soya qildi.';
  await p.article.update({
    where: { id: a.id },
    data: { title, shortPost: body, shortSummary: body, category: 'ai', tags: ['suniy-intellekt', 'meta', 'muse'] },
  });
  console.log('UPDATED ' + a.id);
  await p.$disconnect();
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
