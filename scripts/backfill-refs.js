require('dotenv').config({ quiet: true });
const { PrismaClient } = require('@prisma/client');

function buildRefs(verification, primary) {
  const matched = verification && Array.isArray(verification.matchedSources) ? verification.matchedSources : [];
  const refs = matched.length > 0
    ? matched.map((s) => ({
        name: s && typeof s.sourceName === 'string' ? s.sourceName : primary.name,
        url: s && typeof s.canonicalUrl === 'string' && s.canonicalUrl.trim() ? s.canonicalUrl.trim() : primary.url,
      }))
    : [{ name: primary.name, url: primary.url }];
  const seen = new Set();
  return refs.filter((r) => {
    const k = String(r.url).trim().toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function main() {
  const p = new PrismaClient();
  const articles = await p.article.findMany({
    where: { status: 'APPROVED' },
    include: { rawArticle: { include: { source: true, verificationRecord: true } } },
  });
  let fixed = 0;
  for (const a of articles) {
    const primary = { name: a.rawArticle.source.name, url: a.rawArticle.canonicalUrl };
    const refs = buildRefs(a.rawArticle.verificationRecord, primary);
    await p.article.update({ where: { id: a.id }, data: { sourceReferences: refs } });
    fixed += 1;
  }
  console.log('BACKFILLED ' + fixed);
  await p.$disconnect();
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
