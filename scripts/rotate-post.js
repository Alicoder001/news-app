require('dotenv').config({ quiet: true });
const { PrismaClient } = require('@prisma/client');

async function main() {
  const p = new PrismaClient();
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const c = process.env.TELEGRAM_CHANNEL_ID;
  const tg = async (msgId) => {
    const r = await fetch('https://api.telegram.org/bot' + t + '/deleteMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: c, message_id: Number(msgId) }),
    });
    return await r.text();
  };
  // 1. Hozir kanaldagi inglizcha postni o'chirish (eng so'nggi SUCCESS delivery)
  const d = await p.delivery.findFirst({ where: { channel: 'TELEGRAM', status: 'SUCCESS' }, orderBy: { createdAt: 'desc' } });
  console.log('DEL:' + await tg(d.externalId));
  await p.article.update({ where: { id: d.articleId }, data: { status: 'HOLD', telegramPublished: false, telegramPublishedAt: null, telegramMessageId: null } });
  console.log('HELD_BAD:' + d.articleId);
  // 2. Meta postini HOLD dan qaytarish
  const meta = await p.article.findFirst({ where: { status: 'HOLD', title: { contains: 'Muse' } } });
  if (meta) {
    await p.article.update({ where: { id: meta.id }, data: { status: 'APPROVED' } });
    console.log('UNHELD_META:' + meta.id);
  }
  await p.$disconnect();
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
